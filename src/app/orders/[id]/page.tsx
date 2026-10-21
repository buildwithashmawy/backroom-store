import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { findOrderForCustomer } from '@/lib/orders';
import { formatEGP } from '@/lib/pricing';
import { shippingMethods, type ShippingMethod } from '@/lib/catalog';
import { formatRange } from '@/lib/format';
import { Badge, ButtonLink, Container } from '@/components/ui';
import { site } from '@/lib/site';
import { ClearCart } from './ClearCart';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your order', robots: { index: false } };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const [{ id }, { t }] = await Promise.all([params, searchParams]);
  const order = await findOrderForCustomer(id, t ?? '');
  if (!order) notFound();

  const paid = order.status === 'paid';
  const failed = order.status === 'payment_failed' || order.status === 'cancelled';
  const method = shippingMethods[order.shipping?.method as ShippingMethod];
  const hasRental = order.lines.some((l) => l.mode === 'rent');

  return (
    <Container className="max-w-3xl py-14">
      {paid && <ClearCart />}
      <div className="animate-rise text-center">
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
            paid ? 'bg-badge-green-fill text-badge-green' : failed ? 'bg-badge-red-fill text-badge-red' : 'bg-badge-amber-fill text-badge-amber'
          }`}
        >
          {paid ? <CheckCircle2 size={32} /> : failed ? <XCircle size={32} /> : <Clock size={32} />}
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {paid
            ? `Thank you, ${order.customer?.firstName}`
            : failed
              ? 'Your payment did not go through'
              : 'We are confirming your payment'}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-fg-secondary">
          {paid
            ? `Your order ${order.number} is confirmed. We sent the details to ${order.customer?.email}.`
            : failed
              ? `${order.payment?.message ? `${order.payment.message}. ` : ''}Nothing was charged. Your cart is saved, so you can try again with another card or wallet.`
              : 'This usually takes a few seconds. Refresh this page in a moment.'}
        </p>
        {failed && (
          <ButtonLink href="/checkout" className="mt-6">
            Try again
          </ButtonLink>
        )}
      </div>

      <div className="mt-12 rounded-2xl border border-line-subtle bg-bg-secondary">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-6 py-4">
          <div>
            <p className="text-sm text-fg-muted">Order</p>
            <p className="font-bold">{order.number}</p>
          </div>
          <Badge tone={paid ? 'green' : failed ? 'red' : 'amber'}>
            {paid ? 'Paid' : failed ? 'Not paid' : 'Awaiting payment'}
          </Badge>
        </div>
        <ul className="divide-y divide-line-subtle px-6">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-4 text-sm">
              <div>
                <p className="font-semibold">
                  {l.name} × {l.quantity}
                </p>
                <p className="text-fg-muted">
                  {l.mode === 'rent'
                    ? `Rental, ${formatRange(l.startDate ?? undefined, l.endDate ?? undefined)} (${l.days} ${l.days === 1 ? 'day' : 'days'})`
                    : 'Purchase'}
                </p>
              </div>
              <p className="font-semibold tabular-nums">{formatEGP(l.lineTotal ?? 0)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-line-subtle px-6 py-4 text-sm">
          <div className="flex justify-between text-fg-secondary">
            <dt>Subtotal</dt>
            <dd>{formatEGP(order.subtotal ?? 0)}</dd>
          </div>
          <div className="flex justify-between text-fg-secondary">
            <dt>{method?.label ?? 'Delivery'}</dt>
            <dd>{order.shippingFee ? formatEGP(order.shippingFee) : 'Free'}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold">
            <dt>{paid ? 'Total paid' : 'Total'}</dt>
            <dd>{formatEGP(order.total ?? 0)}</dd>
          </div>
          {paid && order.payment?.maskedPan && (
            <p className="text-xs text-fg-muted">
              Paid with {order.payment.sourceType || 'card'} ending {order.payment.maskedPan.slice(-4)}
            </p>
          )}
        </dl>
      </div>

      {paid && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line-subtle p-5 text-sm">
            <p className="font-semibold">What happens next</p>
            <p className="mt-2 text-fg-secondary">
              {order.shipping?.method === 'pickup'
                ? `We will message you on ${order.customer?.phone} when your order is ready to collect from ${site.address.line1}, ${site.address.area}.`
                : `We will call ${order.customer?.phone} to arrange delivery to ${order.shipping?.city}, ${order.shipping?.governorate}.`}
            </p>
          </div>
          {hasRental && (
            <div className="rounded-2xl border border-line-subtle p-5 text-sm">
              <p className="font-semibold">For your rental</p>
              <p className="mt-2 text-fg-secondary">
                Bring your national ID or passport to the handover.
                {order.deposit ? ` A refundable deposit of ${formatEGP(order.deposit)} is collected then.` : ''}
              </p>
            </div>
          )}
        </div>
      )}
      <p className="mt-8 text-center text-sm text-fg-muted">
        Questions? Call {site.phone} or email {site.email} with your order number.
      </p>
    </Container>
  );
}
