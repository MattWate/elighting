import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchManagerSalesInvoices } from '@/lib/manager/client';

export const dynamic = 'force-dynamic';

type TestRequestBody = {
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
      { permission_key: 'integrations.manager.view' }
    );

    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 500 });
    }

    if (!permissionResult) {
      return NextResponse.json({ error: 'You do not have permission to test the Manager.io connection.' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as TestRequestBody;
    const invoices = await fetchManagerSalesInvoices({ from: body.from, to: body.to });

    return NextResponse.json({
      ok: true,
      message: 'Manager.io connection succeeded.',
      invoiceCount: invoices.length,
      sampleInvoice: invoices[0]
        ? {
            id: invoices[0].id,
            invoiceNumber: invoices[0].invoiceNumber,
            invoiceDate: invoices[0].invoiceDate,
            customerName: invoices[0].customerName,
            status: invoices[0].status,
            lineCount: invoices[0].lines.length,
            sampleLine: invoices[0].lines[0]
              ? {
                  itemCode: invoices[0].lines[0].itemCode,
                  itemName: invoices[0].lines[0].itemName,
                  description: invoices[0].lines[0].description,
                  quantity: invoices[0].lines[0].quantity,
                }
              : null,
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Manager.io connection test error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
