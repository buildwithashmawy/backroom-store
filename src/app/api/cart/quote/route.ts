import { quoteCart } from '@/lib/orders';
import { PricingError } from '@/lib/pricing';
import { quoteSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  const parsed = quoteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Invalid cart.' }, { status: 400 });
  if (parsed.data.lines.length === 0) {
    return Response.json({ lines: [], totals: { subtotal: 0, purchaseSubtotal: 0, rentalSubtotal: 0, shipping: 0, total: 0, deposit: 0 } });
  }
  try {
    return Response.json(await quoteCart(parsed.data.lines, parsed.data.shippingMethod ?? null));
  } catch (err) {
    if (err instanceof PricingError) return Response.json({ error: err.message }, { status: 422 });
    throw err;
  }
}
