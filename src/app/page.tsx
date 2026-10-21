import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui';
import { ProductPhoto } from '@/components/ProductPhoto';
import { ProductGrid } from '@/components/product/ProductCard';
import { categories, freeShippingThreshold, rentalDiscounts, shippingMethods } from '@/lib/catalog';
import { formatEGP } from '@/lib/pricing';
import { listProducts } from '@/lib/products';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await listProducts();
  const lead = products.find((p) => p.slug === 'sony-fx3') ?? products[0];
  const rest = products.filter((p) => p.slug !== lead?.slug);
  const featured = [...rest.filter((p) => p.featured), ...rest.filter((p) => !p.featured)].slice(0, 8);
  const byCategory = categories.map((c) => {
    const items = products.filter((p) => p.category === c.slug);
    const dayRates = items.map((p) => p.rentPricePerDay).filter((v): v is number => v != null);
    return { ...c, count: items.length, fromRate: dayRates.length ? Math.min(...dayRates) : null };
  });

  return (
    <>
      <Container className="grid gap-10 pb-16 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-14">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem]">
              The kit room,
              <br />
              open online.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-fg-secondary">
              Cameras, glass, lighting and sound from our studio in {site.address.area}. Rent by the day for your next
              shoot, or buy new with local warranty.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop?mode=rent">Browse rentals</ButtonLink>
              <ButtonLink href="/shop?mode=buy" variant="ghost">
                Shop to buy
              </ButtonLink>
            </div>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line-subtle pt-6 text-sm">
            <div>
              <dt className="text-fg-muted">Items</dt>
              <dd className="mt-1 text-lg font-bold tabular-nums">{products.length}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Week rate</dt>
              <dd className="mt-1 text-lg font-bold">−{rentalDiscounts[0].percent}%</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Delivery</dt>
              <dd className="mt-1 text-lg font-bold">Cairo · Giza</dd>
            </div>
          </dl>
        </div>

        {lead && (
          <Link href={`/products/${lead.slug}`} className="group relative lg:col-span-7">
            <ProductPhoto
              src={lead.images[0]}
              alt={lead.name}
              brand={lead.brand}
              priority
              label={false}
              padding="p-[10%]"
              className="aspect-[4/3] rounded-lg"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-on-tile">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">On the shelf</p>
                <p className="mt-1 text-lg font-bold leading-tight">{lead.name}</p>
              </div>
              <p className="shrink-0 text-right text-sm">
                {lead.rentPricePerDay != null && (
                  <>
                    <span className="font-bold">{formatEGP(lead.rentPricePerDay)}</span> / day
                  </>
                )}
              </p>
            </div>
            <ArrowUpRight className="absolute right-5 top-5 text-on-tile opacity-0 transition group-hover:opacity-100" size={22} />
          </Link>
        )}
      </Container>

      <Container>
        <div className="flex items-baseline justify-between border-b border-line-subtle pb-4">
          <h2 className="text-xl font-bold tracking-tight">Departments</h2>
          <Link href="/shop" className="text-sm text-fg-secondary hover:text-fg">
            All gear
          </Link>
        </div>
        <ul className="grid sm:grid-cols-2">
          {byCategory.map((c, i) => (
            <li key={c.slug} className={`border-b border-line-subtle ${i % 2 === 0 ? 'sm:pr-8' : 'sm:border-l sm:pl-8'}`}>
              <Link href={`/shop?category=${c.slug}`} className="group flex items-center justify-between gap-4 py-5">
                <span>
                  <span className="text-lg font-semibold group-hover:underline group-hover:underline-offset-4">{c.name}</span>
                  <span className="ml-2 text-sm tabular-nums text-fg-muted">{c.count}</span>
                  <span className="mt-0.5 block text-sm text-fg-muted">{c.blurb}</span>
                </span>
                <span className="shrink-0 text-right text-sm text-fg-secondary">
                  {c.fromRate != null ? (
                    <>
                      from <span className="font-semibold text-fg">{formatEGP(c.fromRate)}</span>/day
                    </>
                  ) : (
                    'Buy only'
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {featured.length > 0 && (
        <Container className="pt-20">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">Featured gear</h2>
            <Link href="/shop?mode=rent" className="text-sm text-fg-secondary hover:text-fg">
              All rentals
            </Link>
          </div>
          <ProductGrid products={featured} />
        </Container>
      )}

      <Container className="pt-24">
        <div className="grid gap-10 border-t border-line-subtle pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold tracking-tight">Rental rates</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
              Every date from pickup to return counts as a day. Longer bookings are discounted automatically at checkout.
            </p>
            <Link href="/how-renting-works" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
              How renting works
            </Link>
          </div>
          <table className="w-full text-sm lg:col-span-8">
            <tbody className="divide-y divide-line-subtle">
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">1 to {rentalDiscounts[1].minDays - 1} days</th>
                <td className="py-3.5 text-right font-semibold">Day rate</td>
              </tr>
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">
                  {rentalDiscounts[1].minDays} to {rentalDiscounts[0].minDays - 1} days
                </th>
                <td className="py-3.5 text-right font-semibold">{rentalDiscounts[1].percent}% off</td>
              </tr>
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">{rentalDiscounts[0].minDays} days or more</th>
                <td className="py-3.5 text-right font-semibold">{rentalDiscounts[0].percent}% off</td>
              </tr>
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">Delivery and collection, Cairo and Giza</th>
                <td className="py-3.5 text-right font-semibold">{formatEGP(shippingMethods.cairo_giza.rentalFee)}</td>
              </tr>
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">Pickup from the studio</th>
                <td className="py-3.5 text-right font-semibold">Free</td>
              </tr>
              <tr>
                <th className="py-3.5 text-left font-medium text-fg-secondary">Purchases delivered anywhere in Egypt</th>
                <td className="py-3.5 text-right font-semibold">Free over {formatEGP(freeShippingThreshold)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
