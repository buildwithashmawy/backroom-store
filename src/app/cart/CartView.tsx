'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { useQuote } from '@/components/cart/useQuote';
import { CartLineRow } from '@/components/cart/CartLineRow';
import { buttonClass } from '@/components/ui';
import { PaymentMarks } from '@/components/layout/Footer';
import { formatEGP } from '@/lib/pricing';
import { freeShippingThreshold } from '@/lib/catalog';

export function CartView() {
  const { lines, ready } = useCart();
  const { quote, error } = useQuote(lines);

  if (!ready) return <div className="h-64" />;
  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <p className="mt-1 text-fg-secondary">Browse the kit room and add gear to buy or rent.</p>
        <Link href="/shop" className={buttonClass('primary', 'md', 'mt-6')}>
          Browse gear
        </Link>
      </div>
    );
  }

  const t = quote?.totals;
  return (
    <div className="grid gap-10 py-8 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-line-subtle">
        {lines.map((l, i) => (
          <CartLineRow key={l.key} line={l} priced={quote?.lines[i]} />
        ))}
      </ul>
      <aside className="h-fit rounded-2xl border border-line-subtle bg-bg-secondary p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Order summary</h2>
        {error && <p className="mt-4 rounded-md bg-badge-red-fill px-3 py-2 text-sm text-badge-red">{error}</p>}
        <dl className="mt-4 space-y-2 text-sm">
          {t && t.purchaseSubtotal > 0 && <Row label="Purchases" value={formatEGP(t.purchaseSubtotal)} />}
          {t && t.rentalSubtotal > 0 && <Row label="Rentals" value={formatEGP(t.rentalSubtotal)} />}
          <Row label="Delivery" value="At checkout" muted />
          <div className="border-t border-line-subtle pt-3">
            <Row label="Subtotal" value={t ? formatEGP(t.subtotal) : '…'} bold />
          </div>
          {t && t.deposit > 0 && (
            <p className="pt-1 text-xs text-fg-muted">
              Plus a refundable deposit of {formatEGP(t.deposit)}, paid at handover. It is not charged online.
            </p>
          )}
          {t && t.purchaseSubtotal > 0 && t.purchaseSubtotal < freeShippingThreshold && (
            <p className="text-xs text-fg-muted">Free delivery on purchases over {formatEGP(freeShippingThreshold)}.</p>
          )}
        </dl>
        <Link
          href="/checkout"
          aria-disabled={!!error || !quote}
          className={buttonClass('primary', 'lg', `mt-6 w-full ${error || !quote ? 'pointer-events-none opacity-50' : ''}`)}
        >
          Continue to checkout
        </Link>
        <div className="mt-5 flex justify-center">
          <PaymentMarks />
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-semibold' : 'text-fg-secondary'}`}>
      <dt>{label}</dt>
      <dd className={muted ? 'text-fg-muted' : 'tabular-nums'}>{value}</dd>
    </div>
  );
}
