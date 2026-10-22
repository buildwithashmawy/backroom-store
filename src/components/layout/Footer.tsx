import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { categories } from '@/lib/catalog';
import { fullAddress, registration, site } from '@/lib/site';

const policies = [
  { href: '/terms', label: 'Terms and conditions' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/refund-policy', label: 'Refund and return policy' },
  { href: '/shipping-policy', label: 'Delivery and shipping' },
  { href: '/rental-terms', label: 'Rental terms' },
];

const company = [
  { href: '/about', label: 'About BackRoom' },
  { href: '/how-renting-works', label: 'How renting works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact us' },
];

export function PaymentMarks() {
  const marks = ['Visa', 'Mastercard', 'Meeza', 'Mobile wallets'];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {marks.map((m) => (
        <span key={m} className="rounded-[6px] border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
          {m}
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line-subtle bg-bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-fg-secondary">{site.description}</p>
          <ul className="mt-6 space-y-2.5 text-sm text-fg-secondary">
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-fg-muted" />
              {fullAddress}
            </li>
            <li className="flex gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-fg-muted" />
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-fg">{site.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-fg-muted" />
              <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
            </li>
          </ul>
        </div>
        <FooterColumn title="Shop" links={categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name }))} />
        <FooterColumn title="Company" links={company} />
        <FooterColumn title="Policies" links={policies} />
      </div>
      <div className="border-t border-line-subtle">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-fg-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}.{registration && ` ${registration}.`} Prices in Egyptian pounds (EGP).
          </p>
          <div className="flex items-center gap-3">
            <span>Secure payments by Paymob</span>
            <PaymentMarks />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-fg-secondary transition hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
