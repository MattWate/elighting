import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type AuthMode =
  | 'bearer'
  | 'basic'
  | 'basic-reverse'
  | 'basic-token-only'
  | 'token-secret-headers'
  | 'query-token-secret'
  | 'bearer-plus-secret-header';

const authModes: AuthMode[] = [
  'basic',
  'basic-reverse',
  'basic-token-only',
  'bearer',
  'bearer-plus-secret-header',
  'token-secret-headers',
  'query-token-secret',
];

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
}

function buildManagerUrl() {
  const managerBaseUrl = process.env.MANAGER_API_BASE_URL;
  const managerSalesInvoicesPath = process.env.MANAGER_SALES_INVOICES_PATH || '/api2/sales-invoices';

  if (managerSalesInvoicesPath.startsWith('http://') || managerSalesInvoicesPath.startsWith('https://')) {
    return new URL(managerSalesInvoicesPath);
  }

  if (!managerBaseUrl) {
    throw new Error('Missing MANAGER_API_BASE_URL environment variable.');
  }

  return new URL(managerSalesInvoicesPath, managerBaseUrl);
}

function basic(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

function getHeaders(mode: AuthMode, token: string, secret: string): Record<string, string> {
  if (mode === 'basic') return { Authorization: basic(token, secret) };
  if (mode === 'basic-reverse') return { Authorization: basic(secret, token) };
  if (mode === 'basic-token-only') return { Authorization: basic(token, '') };
  if (mode === 'bearer') return { Authorization: `Bearer ${token}` };
  if (mode === 'bearer-plus-secret-header') return { Authorization: `Bearer ${token}`, 'X-Manager-Secret': secret };
  if (mode === 'token-secret-headers') return { 'X-Manager-Token': token, 'X-Manager-Secret': secret };
  return {};
}

function addQueryAuth(url: URL, mode: AuthMode, token: string, secret: string) {
  if (mode !== 'query-token-secret') return;
  url.searchParams.set('token', token);
  url.searchParams.set('secret', secret);
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getBearerToken(request);

    if (!sessionToken) {
      return NextResponse.json({ error: 'Missing bearer token.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase environment variables are missing.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${sessionToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: permissionResult, error: permissionError } = await supabase.rpc(
      'current_user_has_permission',
      { permission_key: 'integrations.manager.view' }
    );

    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 500 });
    }

    if (!permissionResult) {
      return NextResponse.json({ error: 'You do not have permission to probe the Manager.io connection.' }, { status: 403 });
    }

    const token = process.env.MANAGER_API_TOKEN;
    const secret = process.env.MANAGER_API_SECRET;

    if (!token || !secret) {
      return NextResponse.json({ error: 'Missing MANAGER_API_TOKEN or MANAGER_API_SECRET.' }, { status: 500 });
    }

    const baseUrl = buildManagerUrl();
    const results = [];

    for (const mode of authModes) {
      const url = new URL(baseUrl.toString());
      addQueryAuth(url, mode, token, secret);

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            ...getHeaders(mode, token, secret),
            Accept: 'application/json',
          },
          cache: 'no-store',
        });

        const body = await response.text();
        results.push({
          mode,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          bodyPreview: body.slice(0, 300),
        });
      } catch (error) {
        results.push({
          mode,
          ok: false,
          status: null,
          statusText: 'Request failed',
          bodyPreview: error instanceof Error ? error.message : 'Unknown request error',
        });
      }
    }

    return NextResponse.json({
      target: {
        origin: baseUrl.origin,
        pathname: baseUrl.pathname,
      },
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Manager.io auth probe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
