import { connectDb } from '@/lib/db';
import { Order } from '@/models/Order';
import { newAccessToken, newOrderNumber, quoteCart } from '@/lib/orders';
import { PricingError } from '@/lib/pricing';
import { checkoutSchema, normalizePhone } from '@/lib/schemas';
import { createIntention, paymobConfig, PaymobError } from '@/lib/paymob';
import { appUrl } from '@/lib/app-url';

export async function POST(req: Request) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join('.')] ??= issue.message;
    return Response.json({ error: 'Please check the highlighted fields.', fieldErrors }, { status: 400 });
  }
  const { lines, customer, shipping } = parsed.data;

  let quote;
  try {
    quote = await quoteCart(lines, shipping.method);
  } catch (err) {
    if (err instanceof PricingError) return Response.json({ error: err.message }, { status: 422 });
    throw err;
  }

  await connectDb();
  const base = appUrl(req);
  const cfg = paymobConfig();
  const order = await Order.create({
    number: newOrderNumber(),
    accessToken: newAccessToken(),
    lines: quote.lines,
    customer: { ...customer, phone: normalizePhone(customer.phone) },
    shipping,
    subtotal: quote.totals.subtotal,
    shippingFee: quote.totals.shipping,
    total: quote.totals.total,
    deposit: quote.totals.deposit,
    payment: { provider: 'paymob', mode: cfg.mode },
  });

  const items = quote.lines.map((l) => ({
    name: l.mode === 'rent' ? `Rent: ${l.name}` : l.name,
    // Paymob wants item amounts per unit; rentals are billed as one unit per window.
    amountCents: Math.round((l.mode === 'rent' ? l.lineTotal : l.unitPrice) * 100),
    quantity: l.mode === 'rent' ? 1 : l.quantity,
    description:
      l.mode === 'rent' ? `${l.quantity} unit(s), ${l.startDate} to ${l.endDate} (${l.days} days)` : 'Purchase',
  }));
  if (quote.totals.shipping > 0) {
    items.push({ name: 'Delivery', amountCents: quote.totals.shipping * 100, quantity: 1, description: shipping.method });
  }

  try {
    const intention = await createIntention(
      {
        amountCents: Math.round(quote.totals.total * 100),
        reference: String(order._id),
        items,
        billing: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: normalizePhone(customer.phone),
          street: shipping.street,
          building: shipping.building,
          floor: shipping.floor,
          apartment: shipping.apartment,
          city: shipping.city,
          state: shipping.governorate,
        },
        notificationUrl: `${base}/api/paymob/webhook`,
        redirectionUrl: `${base}/checkout/result`,
      },
      base,
    );
    await Order.updateOne(
      { _id: order._id },
      { $set: { 'payment.intentionId': intention.intentionId, 'payment.paymobOrderId': intention.paymobOrderId } },
    );
    return Response.json({
      orderId: String(order._id),
      token: order.accessToken,
      checkoutUrl: intention.checkoutUrl,
    });
  } catch (err) {
    await Order.updateOne({ _id: order._id }, { $set: { status: 'cancelled' } });
    if (err instanceof PaymobError) return Response.json({ error: err.message }, { status: 502 });
    throw err;
  }
}
