import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Container, PageHeader } from '@/components/ui';
import { ProductGrid } from '@/components/product/ProductCard';
import { categories, categoryName } from '@/lib/catalog';
import { listProducts, type Sort } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop gear', description: 'Buy or rent cameras, lenses, lighting, audio and grip in Egypt.' };

type Params = { category?: string; mode?: string; q?: string; sort?: string };

const sorts: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price, low to high' },
  { value: 'price_desc', label: 'Price, high to low' },
  { value: 'name', label: 'Name' },
];

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const category = categories.some((c) => c.slug === sp.category) ? sp.category : undefined;
  const mode = sp.mode === 'buy' || sp.mode === 'rent' ? sp.mode : undefined;
  const sort = sorts.some((s) => s.value === sp.sort) ? (sp.sort as Sort) : 'featured';
  const q = sp.q?.slice(0, 60).trim() || undefined;
  const products = await listProducts({ category, mode, q, sort });

  const href = (patch: Partial<Params>) => {
    const next = new URLSearchParams();
    const merged = { category, mode, q, sort: sort === 'featured' ? undefined : sort, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/shop?${s}` : '/shop';
  };

  const title = category ? categoryName(category) : mode === 'rent' ? 'Rent gear' : mode === 'buy' ? 'Buy gear' : 'All gear';

  return (
    <Container>
      <PageHeader
        title={title}
        intro={
          mode === 'rent'
            ? 'Daily rates with multi-day discounts. Pick your dates on any product to check availability.'
            : 'New and checked production equipment, priced in EGP with delivery across Egypt.'
        }
      />

      <div className="sticky top-16 z-30 -mx-4 border-b border-line-subtle bg-bg/90 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Chip href={href({ category: undefined })} active={!category}>All</Chip>
            {categories.map((c) => (
              <Chip key={c.slug} href={href({ category: c.slug })} active={category === c.slug}>
                {c.name}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-line p-0.5">
              {[
                { v: undefined, l: 'All' },
                { v: 'rent', l: 'Rent' },
                { v: 'buy', l: 'Buy' },
              ].map((m) => (
                <Link
                  key={m.l}
                  href={href({ mode: m.v })}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    mode === m.v ? 'bg-action text-on-action' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  {m.l}
                </Link>
              ))}
            </div>
            <form action="/shop" className="relative flex-1 lg:w-56 lg:flex-none">
              {category && <input type="hidden" name="category" value={category} />}
              {mode && <input type="hidden" name="mode" value={mode} />}
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input name="q" defaultValue={q} placeholder="Search gear" className="field !rounded-full !py-2 pl-10 text-sm" aria-label="Search gear" />
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-6 text-sm text-fg-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>
          {products.length} {products.length === 1 ? 'item' : 'items'}
          {q && (
            <>
              {' '}for “{q}” ·{' '}
              <Link href={href({ q: undefined })} className="text-accent">
                clear
              </Link>
            </>
          )}
        </p>
        <div className="-mx-1 flex items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <span className="hidden sm:inline">Sort:</span>
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={href({ sort: s.value === 'featured' ? undefined : s.value })}
              className={`rounded-full px-2.5 py-1 ${sort === s.value ? 'bg-surface font-semibold text-fg' : 'hover:text-fg'}`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-xl border border-line-subtle py-20 text-center">
          <p className="font-semibold">Nothing matches that yet</p>
          <p className="mt-1 text-sm text-fg-secondary">Try another category, or contact us and we will source it.</p>
        </div>
      )}
    </Container>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-[10px] border px-3.5 py-2 text-sm font-semibold transition ${
        active ? 'border-on-dark bg-elevated text-fg' : 'border-line-subtle text-fg-secondary hover:border-line hover:text-fg'
      }`}
    >
      {children}
    </Link>
  );
}
