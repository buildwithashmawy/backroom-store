import { applyTransaction } from '@/lib/orders';
import { hmacValuesFromTransaction, paymobConfig, summarizeTransaction, verifyHmac } from '@/lib/paymob';

// Paymob's "transaction processed" callback. Paymob signs it with the HMAC
// secret and sends the signature as the `hmac` query parameter.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = (await req.json().catch(() => null)) as { type?: string; obj?: unknown } | null;
  if (!body?.obj) return Response.json({ error: 'Bad payload' }, { status: 400 });

  // Paymob also posts TOKEN callbacks for saved cards; only transactions matter here.
  if (body.type && body.type !== 'TRANSACTION') return Response.json({ ok: true, ignored: body.type });

  const hmac = url.searchParams.get('hmac') ?? (body as { hmac?: string }).hmac;
  if (!verifyHmac(hmacValuesFromTransaction(body.obj), hmac, paymobConfig().hmacSecret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  const result = await applyTransaction(summarizeTransaction(body.obj), 'webhook');
  return Response.json(result, { status: result.ok ? 200 : 404 });
}
