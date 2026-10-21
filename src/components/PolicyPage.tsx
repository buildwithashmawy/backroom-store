import Link from 'next/link';
import { Container, PageHeader } from './ui';
import { site } from '@/lib/site';

const links = [
  { href: '/terms', label: 'Terms and conditions' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/refund-policy', label: 'Refund and return policy' },
  { href: '/shipping-policy', label: 'Delivery and shipping' },
  { href: '/rental-terms', label: 'Rental terms' },
];

export function PolicyPage({ title, intro, current, children }: { title: string; intro?: string; current: string; children: React.ReactNode }) {
  return (
    <Container>
      <PageHeader eyebrow="Policies" title={title} intro={intro} />
      <div className="grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block" aria-label="Policies">
          <ul className="sticky top-24 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    current === l.href ? 'bg-surface font-semibold text-fg' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose-policy max-w-3xl">
          <p className="text-sm text-fg-muted">Last updated {site.lastPolicyUpdate}</p>
          {children}
        </article>
      </div>
    </Container>
  );
}
