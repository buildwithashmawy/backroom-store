'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../cart/CartProvider';

const nav = [
  { href: '/shop', label: 'Shop all' },
  { href: '/shop?mode=rent', label: 'Rent' },
  { href: '/shop?mode=buy', label: 'Buy' },
  { href: '/how-renting-works', label: 'How renting works' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { count, ready, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen ? 'border-b border-line-subtle bg-bg/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-secondary transition hover:bg-surface hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            onClick={openDrawer}
            className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-surface"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
            {ready && count > 0 && (
              <span className="animate-fade absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-action">
                {count}
              </span>
            )}
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-surface lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="animate-fade border-t border-line-subtle px-4 pb-6 pt-2 lg:hidden" aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-line-subtle py-4 text-lg font-semibold">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
