import { redirect } from 'next/navigation';
import { connectDb } from '@/lib/db';
import { Order } from '@/models/Order';
import { applyTransaction } from '@/lib/orders';
import { hmacValuesFromQuery, paymobConfig, summarizeQuery, verifyHmac } from '@/lib/paymob';
import { ButtonLink, Container } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Payment', robots: { index: false } };

// Paymob sends the customer back here with the transaction in a signed query
// string. A valid signature lets us record the result straight away, without
// waiting for the webhook.
export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(raw)) if (typeof v === 'string') q.set(k, v);

  if (verifyHmac(hmacValuesFromQuery(q), q.get('hmac'), paymobConfig().hmacSecret)) {
    const tx = summarizeQuery(q);
    const result = await applyTransaction(tx, 'redirect');
    if (result.ok) {
      await connectDb();
      const order = await Order.findById(result.orderId).select('accessToken').lean();
      if (order) redirect(`/orders/${result.orderId}?t=${order.accessToken}`);
    }
  }

  return (
    <Container className="max-w-xl py-24 text-center">
      <h1 className="text-3xl font-extrabold">We could not confirm this payment</h1>
      <p className="mt-4 text-fg-secondary">
        If money left your account, your order is safe: we will confirm it by email as soon as Paymob notifies us. You
        can also contact us with your order number.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/contact">Contact us</ButtonLink>
        <ButtonLink href="/cart" variant="ghost">
          Back to cart
        </ButtonLink>
      </div>
    </Container>
  );
}
