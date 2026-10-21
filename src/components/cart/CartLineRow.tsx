'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ProductArt } from '../ProductArt';
import { formatEGP, type PricedLine } from '@/lib/pricing';
import { useCart, type CartLine } from './CartProvider';
import { formatRange } from '@/lib/format';

export function CartLineRow({ line, priced, compact }: { line: CartLine; priced?: PricedLine; compact?: boolean }) {
  const { setQuantity, remove } = useCart();
  const s = line.snapshot;
  return (
    <li className="flex gap-4 py-4">
      <Link href={`/products/${s.slug}`} className="block h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface sm:h-24 sm:w-24">
        {s.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <ProductArt art={s.art} label="" className="h-full w-full" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-fg-muted">{s.brand}</p>
            <Link href={`/products/${s.slug}`} className="block truncate font-semibold hover:text-accent">
              {s.name}
            </Link>
            <p className="mt-0.5 text-sm text-fg-secondary">
              {line.mode === 'rent' ? (
                <>
                  Rent · {formatRange(line.startDate, line.endDate)}
                  {priced?.days ? ` · ${priced.days} ${priced.days === 1 ? 'day' : 'days'}` : ''}
                </>
              ) : (
                'Buy'
              )}
            </p>
            {priced && priced.discountPercent > 0 && (
              <p className="text-xs text-badge-green">{priced.discountPercent}% multi-day discount</p>
            )}
          </div>
          <p className="shrink-0 font-semibold">{priced ? formatEGP(priced.lineTotal) : '…'}</p>
        </div>
        <div className={`mt-auto flex items-center justify-between ${compact ? 'pt-2' : 'pt-3'}`}>
          <div className="flex items-center rounded-full border border-line">
            <button
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface disabled:opacity-40"
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              disabled={line.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
            <button
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface disabled:opacity-40"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              disabled={line.quantity >= 10}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => remove(line.key)}
            className="flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-badge-red"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
