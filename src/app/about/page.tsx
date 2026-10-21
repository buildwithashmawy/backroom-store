import type { Metadata } from 'next';
import { ButtonLink, Container, PageHeader } from '@/components/ui';
import { fullAddress, site } from '@/lib/site';

export const metadata: Metadata = { title: 'About BackRoom', description: site.description };

export default function AboutPage() {
  return (
    <Container>
      <PageHeader title="About BackRoom" />
      <div className="grid gap-12 py-12 lg:grid-cols-12">
        <div className="space-y-5 text-[17px] leading-relaxed text-fg-secondary lg:col-span-7">
          <p className="text-xl leading-snug text-fg">
            BackRoom is a production marketplace for Egypt&apos;s creative industry. The store is our own kit room: the
            cameras, lenses, lights and sound we rent to crews every week, and new gear we sell with local warranty.
          </p>
          <p>
            Getting a shoot ready in Cairo used to mean calling around rental houses, chasing availability on WhatsApp and
            paying cash at the counter. Here you see the day rate, pick your dates and pay online. We hold the gear for you
            and have it checked and charged before you collect it.
          </p>
          <p>
            Between rentals every item is cleaned, tested and logged by our technicians. Bodies are updated to current
            firmware, lenses are checked for back focus, and batteries are cycled. When something fails on set, call us
            and we swap it.
          </p>
          <p>
            New equipment is sourced through the authorised agents in Egypt, so warranty claims are handled locally. The
            BackRoom app also books crew, talent, studios and locations, if you need more than gear.
          </p>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <dl className="divide-y divide-line-subtle border-y border-line-subtle text-sm">
            {[
              ['Studio', fullAddress],
              ['Hours', site.hours],
              ['Phone', site.phone],
              ['Email', site.email],
              ['Company', site.legalName],
              ['Registration', `${site.commercialRegister} · ${site.taxId}`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3.5">
                <dt className="text-fg-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/shop?mode=rent">Browse rentals</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Contact us
            </ButtonLink>
          </div>
        </aside>
      </div>
    </Container>
  );
}
