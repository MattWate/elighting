import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchRawManagerSalesInvoices } from '@/lib/manager/client';

export const dynamic = 'force-dynamic';

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
}

function isPlainObject(value: unknown) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function previewValue(value: unknown) {
  if (value === null || value === undefined) return value;

  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
      firstItemType: value[0] === null ? 'null' : Array.isArray(value[0]) ? 'array' : typeof value[0],
    };
  }

  if (typeof value === 'object') {
    return {
      type: 'object',
      keys: Object.keys(value as Record<string, unknown>).slice(0, 30),
    };
  }

  return typeof value;
}

function inspectInvoice(invoice: Record<string, unknown>) {
  const topLevelKeys = Object.keys(invoice);

  const simplePreview = Object.fromEntries(
    topLevelKeys
      .filter((key) => {
        const value = invoice[key];
        return value === null || ['string', 'number', 'boolean', 'undefined'].includes(typeof value);
      })
      .slice(0, 40)
      .map((key) => [key, invoice[key]])
  );

  const arrayFields = topLevelKeys
    .filter((key) => Array.isArray(invoice[key]))
    .map((key) => {
      const value = invoice[key] as unknown[];
      const firstItem = value[0];

      return {
        field: key,
        length: value.length,
        firstItemType: firstItem === null ? 'null' : Array.isArray(firstItem) ? 'array' : typeof firstItem,
        firstItemKeys: isPlainObject(firstItem)
          ? Object.keys(firstItem as Record<string, unknown>)
          : [],
        firstItemPreview: isPlainObject(firstItem)
          ? Object.fromEntries(
              Object.entries(firstItem as Record<string, unknown>)
                .slice(0, 25)
                .map(([k, v]) => [k, previewValue(v)])
            )
          : previewValue(firstItem),
      };
    });

  const objectFields = topLevelKeys
    .filter((key) => isPlainObject(invoice[key]))
    .map((key) => ({
      field: key,
      keys: Object.keys(invoice[key] as Record<string, unknown>).slice(0, 40),
      preview: Object.fromEntries(
        Object.entries(invoice[key] as Record<string, unknown>)
          .slice(0, 20)
          .map(([k, v]) => [k, previewValue(v)])
      ),
    }));

  return {
    topLevelKeys,
    simplePreview,
    arrayFields,
    objectFields,
  };
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
      { permission_key: 'integrations.manager.view' }
    );

    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 500 });
    }

    if (!permissionResult) {
      return NextResponse.json({ error: 'You do not have permission to inspect Manager.io invoice data.' }, { status: 403 });
    }

    const invoices = await fetchRawManagerSalesInvoices();
    const firstInvoice = invoices[0];

    if (!firstInvoice || !isPlainObject(firstInvoice)) {
      return NextResponse.json({
        ok: true,
        invoiceCount: invoices.length,
        message: 'No inspectable invoice object returned.',
      });
    }

    return NextResponse.json({
      ok: true,
      invoiceCount: invoices.length,
      firstInvoiceShape: inspectInvoice(firstInvoice as Record<string, unknown>),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown invoice shape inspection error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
