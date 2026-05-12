import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncManagerInvoicesToComponentStock } from '@/lib/manager/sync';

export const dynamic = 'force-dynamic';

type SyncRequestBody = {
  from?: string;
  to?: string;
};

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Missing bearer token.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase environment variables are missing.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: permissionResult, error: permissionError } = await supabase.rpc(
      'current_user_has_permission',
      { permission_key: 'integrations.manager.sync' }
    );

    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 500 });
    }

    if (!permissionResult) {
      return NextResponse.json({ error: 'You do not have permission to run the Manager.io sync.' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as SyncRequestBody;
    const summary = await syncManagerInvoicesToComponentStock({ from: body.from, to: body.to });

    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Manager.io sync error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
