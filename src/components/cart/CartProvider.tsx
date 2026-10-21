'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Mode } from '@/lib/pricing';

export interface CartLine {
  key: string;
  productId: string;
  mode: Mode;
  quantity: number;
  startDate?: string;
  endDate?: string;
  snapshot: { name: string; slug: string; brand: string; art: string; image?: string };
}

interface CartState {
  lines: CartLine[];
  ready: boolean;
  count: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (line: Omit<CartLine, 'key'>) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = 'backroom-store-cart-v1';

function lineKey(l: Pick<CartLine, 'productId' | 'mode' | 'startDate' | 'endDate'>) {
  return [l.productId, l.mode, l.startDate ?? '', l.endDate ?? ''].join(':');
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setLines(saved);
    } catch {
      // Storage can be blocked (private mode); the cart then lives in memory.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, 'key'>) => {
    const key = lineKey(line);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, l.quantity + line.quantity) } : l));
      }
      return [...prev, { ...line, key }];
    });
    setDrawerOpen(true);
  }, []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity: (key, quantity) =>
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(10, quantity)) } : l))),
      remove: (key) => setLines((prev) => prev.filter((l) => l.key !== key)),
      clear: () => setLines([]),
    }),
    [lines, ready, drawerOpen, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
