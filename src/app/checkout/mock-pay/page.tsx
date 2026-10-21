import { notFound } from 'next/navigation';
import { connectDb } from '@/lib/db';
import { Order } from '@/models/Order';
import { paymobConfig } from '@/lib/paymob';
import { formatEGP } from '@/lib/pricing';
import { Container } from '@/components/ui';
import { MockPayButtons } from './MockPayButtons';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Test payment', robots: { index: false } };

// Stand-in for Paymob's hosted page while PAYMOB_MODE=mock.
export default async function MockPayPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  if (paymobConfig().mode !== 'mock') notFound();
  const { ref } = await searchParams;
  if (!ref || !/^[a-f0-9]{24}$/i.test(ref)) notFound();
  await connectDb();
  const order = await Order.findById(ref).lean();
  if (!order) notFound();

  return (
    <Container className="max-w-md py-16">
      <div className="rounded-2xl border border-badge-amber bg-badge-amber-fill/40 px-4 py-3 text-sm text-badge-amber">
        Test mode. No real payment is taken. Set PAYMOB_MODE=live with Paymob keys to use the real checkout.
      </div>
      <div className="mt-6 rounded-2xl border border-line-subtle bg-bg-secondary p-6">
        <p className="text-sm text-fg-muted">Paying BackRoom Store</p>
        <p className="mt-1 text-3xl font-extrabold">{formatEGP(order.total ?? 0)}</p>
        <p className="mt-1 text-sm text-fg-secondary">Order {order.number}</p>
        <div className="mt-6 space-y-3">
          <input className="field" defaultValue="5123 4567 8901 2346" aria-label="Card number" readOnly />
          <div className="grid grid-cols-2 gap-3">
            <input className="field" defaultValue="12/30" aria-label="Expiry" readOnly />
            <input className="field" defaultValue="123" aria-label="CVV" readOnly />
          </div>
        </div>
        <MockPayButtons reference={ref} />
      </div>
    </Container>
  );
}
