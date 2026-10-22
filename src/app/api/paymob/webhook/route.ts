import { applyTransaction } from "@/lib/orders";
import {
  confirmTransaction,
  hmacValuesFromTransaction,
  summarizeTransaction,
} from "@/lib/paymob";

// Paymob's "transaction processed" callback. Paymob signs it with the HMAC
// secret and sends the signature as the `hmac` query parameter. Without a
// secret the transaction is looked up from Paymob instead.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = (await req.json().catch(() => null)) as {
    type?: string;
    obj?: unknown;
  } | null;
  if (!body?.obj)
    return Response.json({ error: "Bad payload" }, { status: 400 });

  // Paymob also posts TOKEN callbacks for saved cards; only transactions matter here.
  if (body.type && body.type !== "TRANSACTION")
    return Response.json({ ok: true, ignored: body.type });

  const hmac = url.searchParams.get("hmac") ?? (body as { hmac?: string }).hmac;
  const obj = body.obj;
  const tx = await confirmTransaction(
    hmacValuesFromTransaction(obj),
    hmac,
    String(summarizeTransaction(obj).transactionId),
    () => summarizeTransaction(obj),
  );
  if (!tx)
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  const result = await applyTransaction(tx, "webhook");
  return Response.json(result, { status: result.ok ? 200 : 404 });
}
