import Link from 'next/link';
import { ArrowRight, CalendarDays, CreditCard, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui';
import { ProductArt } from '@/components/ProductArt';
import { ProductGrid } from '@/components/product/ProductCard';
import { categories, rentalDiscounts } from '@/lib/catalog';
import { listProducts } from '@/lib/products';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

const categoryArt: Record<string, string> = {
  cameras: 'cinema-camera',
  lenses: 'lens',
  lighting: 'light-cob',
  audio: 'wireless',
  grip: 'gimbal',
  drones: 'drone',
  monitors: 'monitor',
  accessories: 'battery',
};

export default async function HomePage() {
  const products = await listProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(87,180,229,0.16),transparent_70%)]" />
        <Container className="relative grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-16">
          <div className="animate-rise">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs font-semibold text-fg-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-badge-green" /> Delivering across Cairo and Giza
            </p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Production gear.
              <br />
              <span className="text-fg-secondary">Buy it, or rent it by the day.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-secondary">
              Cinema cameras, lenses, lighting, audio and drones from the BackRoom kit room. Every item is checked
              before it goes out, and you pay securely online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop?mode=rent" size="lg">
                Rent gear <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/shop?mode=buy" size="lg" variant="ghost">
                Shop to buy
              </ButtonLink>
            </div>
          </div>
          <div className="animate-rise relative [animation-delay:120ms]">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {['cinema-camera', 'light-panel', 'lens', 'drone'].map((art, i) => (
                <div
                  key={art}
                  className={`overflow-hidden rounded-2xl border border-line-subtle ${i % 2 ? 'translate-y-6' : ''}`}
                >
                  <ProductArt art={art} label="" className="aspect-[16/15] w-full" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line-subtle bg-bg-secondary">
        <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {[
            { icon: CreditCard, title: 'Secure payment', text: 'Cards, Meeza and wallets through Paymob' },
            { icon: Truck, title: 'Delivery or pickup', text: `Cairo and Giza, or our ${site.address.area} studio` },
            { icon: Wrench, title: 'Tested kit', text: 'Every item checked before handover' },
            { icon: ShieldCheck, title: 'Clear policies', text: '14-day returns on unused purchases' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon size={22} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-fg-muted">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <Container className="pt-20">
        <SectionTitle title="Shop by category" href="/shop" cta="All gear" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="animate-rise group relative overflow-hidden rounded-xl border border-line-subtle bg-surface"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ProductArt
                art={categoryArt[c.slug]}
                label=""
                className="aspect-[4/3] w-full opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-fg-secondary">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {featured.length > 0 && (
        <Container className="pt-20">
          <SectionTitle title="Popular on set" href="/shop" cta="Shop all" />
          <div className="mt-8">
            <ProductGrid products={featured} />
          </div>
        </Container>
      )}

      <Container className="pt-24">
        <div className="grid gap-10 rounded-2xl border border-line-subtle bg-bg-secondary p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Renting</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Book a kit for your shoot in three steps</h2>
            <p className="mt-4 text-fg-secondary">
              Rentals are priced per day. Book {rentalDiscounts[1].minDays} days or more and save{' '}
              {rentalDiscounts[1].percent}%, or {rentalDiscounts[0].percent}% for a week or longer.
            </p>
            <ButtonLink href="/how-renting-works" variant="ghost" className="mt-6">
              How renting works
            </ButtonLink>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: CalendarDays, title: 'Pick your dates', text: 'Choose the gear and the days you need it. Availability is checked live.' },
              { icon: CreditCard, title: 'Pay online', text: 'Pay the rental securely by card or wallet. You get a confirmation by email.' },
              { icon: Truck, title: 'Collect and shoot', text: 'Pick up from the studio or get it delivered. Show your ID at handover.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="rounded-xl bg-surface p-5">
                <div className="flex items-center justify-between">
                  <Icon size={22} className="text-accent" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-fg-subtle">0{i + 1}</span>
                </div>
                <p className="mt-6 font-semibold">{title}</p>
                <p className="mt-1.5 text-sm text-fg-secondary">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </>
  );
}

function SectionTitle({ title, href, cta }: { title: string; href: string; cta: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <Link href={href} className="flex items-center gap-1.5 text-sm font-semibold text-fg-secondary hover:text-fg">
        {cta} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
