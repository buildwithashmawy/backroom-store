import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, PackageCheck, RotateCcw, Truck } from 'lucide-react';
import { Container } from '@/components/ui';
import { ProductImage } from '@/components/ProductArt';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { ProductGrid } from '@/components/product/ProductCard';
import { categoryName } from '@/lib/catalog';
import { getProduct, relatedProducts } from '@/lib/products';
import { formatEGP } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: 'Not found' };
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const related = await relatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.summary,
    ...(product.buyPrice != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EGP',
        price: product.buyPrice,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    }),
  };

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="flex items-center gap-1.5 pt-6 text-sm text-fg-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-fg">Shop</Link>
        <ChevronRight size={14} />
        <Link href={`/shop?category=${product.category}`} className="hover:text-fg">
          {categoryName(product.category)}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-fg-secondary">{product.name}</span>
      </nav>

      <div className="grid gap-8 pt-6 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div className="animate-rise">
          <div className="overflow-hidden rounded-2xl border border-line-subtle bg-surface">
            <ProductImage product={product} className="aspect-[16/15]" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="animate-rise [animation-delay:80ms] lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold text-fg-muted">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-fg-secondary">{product.summary}</p>
          <div className="mt-6">
            <PurchasePanel product={product} />
          </div>
          <ul className="mt-5 space-y-3 text-sm text-fg-secondary">
            <li className="flex gap-3">
              <Truck size={18} className="shrink-0 text-fg-muted" />
              <span>
                Delivery in Cairo and Giza in 1 to 2 working days, or free pickup from the studio.{' '}
                <Link href="/shipping-policy" className="text-accent">Delivery details</Link>
              </span>
            </li>
            <li className="flex gap-3">
              <RotateCcw size={18} className="shrink-0 text-fg-muted" />
              <span>
                {product.buyPrice != null ? '14-day returns on unused purchases. ' : ''}
                Free rental cancellation up to 48 hours before the start date.{' '}
                <Link href="/refund-policy" className="text-accent">Refund policy</Link>
              </span>
            </li>
            {product.warranty && (
              <li className="flex gap-3">
                <PackageCheck size={18} className="shrink-0 text-fg-muted" />
                <span>{product.warranty}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-16 grid gap-12 border-t border-line-subtle pt-12 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">About this {product.rentPricePerDay != null && product.buyPrice == null ? 'rental' : 'item'}</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-fg-secondary">
            {product.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {product.inTheBox.length > 0 && (
            <>
              <h3 className="mt-8 font-semibold">{product.buyPrice != null ? 'In the box' : 'Included in the rental'}</h3>
              <ul className="mt-3 grid gap-2 text-sm text-fg-secondary sm:grid-cols-2">
                {product.inTheBox.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section>
          <h2 className="text-xl font-bold">Specifications</h2>
          <dl className="mt-4 divide-y divide-line-subtle rounded-xl border border-line-subtle">
            {product.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
                <dt className="text-fg-muted">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
              <dt className="text-fg-muted">Condition</dt>
              <dd>{product.condition === 'new' ? 'New' : 'Used, checked and cleaned'}</dd>
            </div>
            {product.deposit > 0 && (
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
                <dt className="text-fg-muted">Rental deposit</dt>
                <dd>{formatEGP(product.deposit)}, refundable</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-extrabold tracking-tight">More {categoryName(product.category).toLowerCase()}</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
