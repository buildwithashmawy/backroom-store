import crypto from 'node:crypto';
import { connectDb } from '@/lib/db';
import { Order } from '@/models/Order';
import { hmacValuesFromQuery, paymobConfig, signHmac } from '@/lib/paymob';

// Simulates Paymob's redirect for local and demo use (PAYMOB_MODE=mock).
// It builds the same signed query string Paymob sends, so the result page
// exercises the real HMAC check.
export async function POST(req: Request) {
  const cfg = paymobConfig();
  if (cfg.mode !== 'mock') return new Response('Not found', { status: 404 });

  const { ref, outcome } = (await req.json().catch(() => ({}))) as { ref?: string; outcome?: string };
  if (!ref || !/^[a-f0-9]{24}$/i.test(ref)) return Response.json({ error: 'Bad reference' }, { status: 400 });
  await connectDb();
  const order = await Order.findById(ref).lean();
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

  const success = outcome === 'success';
  const q = new URLSearchParams({
    amount_cents: String(Math.round((order.total ?? 0) * 100)),
    created_at: new Date().toISOString(),
    currency: 'EGP',
    error_occured: 'false',
    has_parent_transaction: 'false',
    id: String(crypto.randomInt(100000000, 999999999)),
    integration_id: '0',
    is_3d_secure: 'true',
    is_auth: 'false',
    is_capture: 'false',
    is_refunded: 'false',
    is_standalone_payment: 'true',
    is_voided: 'false',
    order: String(crypto.randomInt(100000000, 999999999)),
    owner: '0',
    pending: 'false',
    'source_data.pan': '2346',
    'source_data.sub_type': 'MasterCard',
    'source_data.type': 'card',
    success: String(success),
    merchant_order_id: ref,
    'data.message': success ? 'Approved' : 'Do not honour',
  });
  q.set('hmac', signHmac(hmacValuesFromQuery(q), cfg.hmacSecret));
  return Response.json({ redirectUrl: `/checkout/result?${q}` });
}
