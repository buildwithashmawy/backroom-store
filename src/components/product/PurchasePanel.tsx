'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Check, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useCart } from '../cart/CartProvider';
import { useQuote } from '../cart/useQuote';
import { Button } from '../ui';
import { addDays, formatEGP, todayInCairo, type Mode } from '@/lib/pricing';
import { rentalDiscounts, rentalLimits } from '@/lib/catalog';

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    images: string[];
    buyPrice: number | null;
    compareAtPrice: number | null;
    rentPricePerDay: number | null;
    deposit: number;
    stock: number;
    rentalUnits: number;
  };
}

export function PurchasePanel({ product }: Props) {
  const canBuy = product.buyPrice != null;
  const canRent = product.rentPricePerDay != null;
  const [mode, setMode] = useState<Mode>(canRent ? 'rent' : 'buy');
  const [quantity, setQuantity] = useState(1);
  const earliest = useMemo(() => addDays(todayInCairo(), rentalLimits.minLeadDays), []);
  const [startDate, setStartDate] = useState(earliest);
  const [endDate, setEndDate] = useState(addDays(earliest, 2));
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const line = {
    key: 'preview',
    productId: product.id,
    mode,
    quantity,
    startDate: mode === 'rent' ? startDate : undefined,
    endDate: mode === 'rent' ? endDate : undefined,
    snapshot: { name: product.name, slug: product.slug, brand: product.brand, image: product.images[0] },
  };
  const { quote, error, loading } = useQuote([line]);
  const priced = quote?.lines[0];
  const outOfStock = mode === 'buy' && product.stock <= 0;
  const maxQty = mode === 'buy' ? Math.max(1, Math.min(10, product.stock)) : Math.max(1, Math.min(10, product.rentalUnits));

  const onAdd = () => {
    add({
      productId: product.id,
      mode,
      quantity,
      startDate: line.startDate,
      endDate: line.endDate,
      snapshot: line.snapshot,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-line-subtle bg-bg-secondary p-5 sm:p-6">
      {canBuy && canRent && (
        <div className="mb-5 grid grid-cols-2 rounded-full bg-surface p-1" role="tablist">
          {(['rent', 'buy'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setQuantity(1);
              }}
              className={`rounded-full py-2.5 text-sm font-semibold transition duration-300 ${
                mode === m ? 'bg-action text-on-action shadow' : 'text-fg-secondary hover:text-fg'
              }`}
            >
              {m === 'rent' ? 'Rent' : 'Buy'}
            </button>
          ))}
        </div>
      )}

      {mode === 'buy' ? (
        <div>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-extrabold">{formatEGP(product.buyPrice!)}</p>
            {product.compareAtPrice && product.compareAtPrice > product.buyPrice! && (
              <p className="text-lg text-fg-muted line-through">{formatEGP(product.compareAtPrice)}</p>
            )}
          </div>
          <p className={`mt-1 text-sm ${product.stock > 0 ? 'text-badge-green' : 'text-badge-red'}`}>
            {product.stock > 3 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-extrabold">
            {formatEGP(product.rentPricePerDay!)}
            <span className="text-base font-medium text-fg-secondary"> / day</span>
          </p>
          <p className="mt-1 text-sm text-fg-secondary">
            Save {rentalDiscounts[1].percent}% on {rentalDiscounts[1].minDays}+ days, {rentalDiscounts[0].percent}% on{' '}
            {rentalDiscounts[0].minDays}+ days.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-fg-secondary">
                <CalendarDays size={14} /> Start
              </span>
              <input
                type="date"
                className="field"
                min={earliest}
                value={startDate}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartDate(v);
                  if (v && endDate < v) setEndDate(v);
                }}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-fg-secondary">
                <CalendarDays size={14} /> Return
              </span>
              <input
                type="date"
                className="field"
                min={startDate || earliest}
                max={startDate ? addDays(startDate, rentalLimits.maxDays - 1) : undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-fg-secondary">Quantity</span>
        <div className="flex items-center rounded-full border border-line">
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface disabled:opacity-40" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold tabular-nums">{quantity}</span>
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface disabled:opacity-40" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} aria-label="Increase quantity">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {mode === 'rent' && (
        <div className="mt-5 space-y-2 rounded-xl bg-surface p-4 text-sm">
          {priced ? (
            <>
              <Row label={`${formatEGP(product.rentPricePerDay!)} × ${priced.days} ${priced.days === 1 ? 'day' : 'days'}${quantity > 1 ? ` × ${quantity}` : ''}`} value={formatEGP(product.rentPricePerDay! * priced.days! * quantity)} />
              {priced.discountPercent > 0 && (
                <Row label={`Multi-day discount (${priced.discountPercent}%)`} value={`− ${formatEGP(product.rentPricePerDay! * priced.days! * quantity - priced.lineTotal)}`} accent />
              )}
              <div className="border-t border-line-subtle pt-2">
                <Row label="Rental total" value={formatEGP(priced.lineTotal)} bold />
              </div>
              {product.deposit > 0 && (
                <p className="flex gap-2 pt-1 text-xs text-fg-muted">
                  <ShieldCheck size={14} className="shrink-0" />
                  Refundable deposit of {formatEGP(product.deposit * quantity)} at handover, with your ID.
                </p>
              )}
            </>
          ) : error ? (
            <p className="text-badge-red">{error}</p>
          ) : (
            <p className="text-fg-muted">{loading ? 'Checking availability…' : 'Pick your dates to see the price.'}</p>
          )}
        </div>
      )}
      {mode === 'buy' && error && !outOfStock && <p className="mt-4 text-sm text-badge-red">{error}</p>}

      <Button
        size="lg"
        className="mt-5 w-full"
        onClick={onAdd}
        disabled={outOfStock || (mode === 'rent' && !priced) || loading || !!error}
      >
        {added ? (
          <>
            <Check size={18} /> Added to cart
          </>
        ) : outOfStock ? (
          'Out of stock'
        ) : mode === 'rent' ? (
          'Add rental to cart'
        ) : (
          'Add to cart'
        )}
      </Button>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${bold ? 'font-semibold text-fg' : 'text-fg-secondary'} ${accent ? '!text-badge-green' : ''}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
