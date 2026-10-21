'use client';

import { useEffect, useState } from 'react';
import type { PricedLine, Totals } from '@/lib/pricing';
import type { ShippingMethod } from '@/lib/catalog';
import type { CartLine } from './CartProvider';

export interface Quote {
  lines: PricedLine[];
  totals: Totals;
}

/** Asks the server to price the cart, so the browser never computes totals on its own. */
export function useQuote(lines: CartLine[], shippingMethod: ShippingMethod | null = null) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const payload = JSON.stringify({
    lines: lines.map(({ productId, mode, quantity, startDate, endDate }) => ({ productId, mode, quantity, startDate, endDate })),
    shippingMethod,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    fetch('/api/cart/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Could not price your cart.');
          setQuote(null);
        } else {
          setError(null);
          setQuote(data);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Could not reach the store. Check your connection.');
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [payload]);

  return { quote, error, loading };
}
