'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { useQuote } from './useQuote';
import { CartLineRow } from './CartLineRow';
import { buttonClass } from '../ui';
import { formatEGP } from '@/lib/pricing';

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer } = useCart();
  const { quote, error } = useQuote(drawerOpen ? lines : []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;
  const priced = (key: string) => {
    const i = lines.findIndex((l) => l.key === key);
    return quote?.lines[i];
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
      <div className="animate-fade absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg-secondary shadow-2xl">
        <div className="flex items-center justify-between border-b border-line-subtle px-5 py-4">
          <h2 className="text-lg font-bold">Your cart</h2>
          <button onClick={closeDrawer} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-surface">
              <ShoppingBag size={26} className="text-fg-muted" />
            </div>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm text-fg-secondary">Add gear to buy, or pick dates to rent.</p>
            <Link href="/shop" onClick={closeDrawer} className={buttonClass('primary', 'md', 'mt-2')}>
              Browse gear
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line-subtle overflow-y-auto px-5">
              {lines.map((l) => (
                <CartLineRow key={l.key} line={l} priced={priced(l.key)} compact />
              ))}
            </ul>
            <div className="border-t border-line-subtle px-5 py-5">
              {error && <p className="mb-3 rounded-md bg-badge-red-fill px-3 py-2 text-sm text-badge-red">{error}</p>}
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{quote ? formatEGP(quote.totals.subtotal) : '…'}</span>
              </div>
              <p className="mt-1 text-xs text-fg-muted">Delivery is calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={closeDrawer} className={buttonClass('ghost')}>
                  View cart
                </Link>
                <Link href="/checkout" onClick={closeDrawer} className={buttonClass('primary')}>
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
