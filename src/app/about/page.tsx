import type { Metadata } from 'next';
import { Camera, Clapperboard, HeartHandshake, Wrench } from 'lucide-react';
import { ButtonLink, Container, PageHeader } from '@/components/ui';
import { ProductArt } from '@/components/ProductArt';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'About BackRoom', description: site.description };

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="About"
        title="The kit room behind Egypt's creative productions"
        intro="BackRoom connects filmmakers, photographers and creators with the gear, talent and locations they need. The BackRoom Store is where you buy or rent that gear directly from us."
      />
      <div className="grid gap-12 py-14 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 text-lg leading-relaxed text-fg-secondary">
          <p>
            We started BackRoom because getting a shoot off the ground in Cairo meant calling ten rental houses, chasing
            availability on WhatsApp and paying cash on the day. We wanted one place where a production can see what is
            free, book it and pay in a few minutes.
          </p>
          <p>
            Our kit room holds cinema cameras, cine and photo lenses, LED lighting, sound, grip and drones. Every item is
            cleaned, tested and logged between rentals by our technicians, and we sell new gear sourced through authorised
            Egyptian agents with local warranty.
          </p>
          <p>
            Beyond the store, the BackRoom app lets you book crew, talent, studios and locations for your project, all
            in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['cinema-camera', 'light-cob', 'tripod', 'wireless'].map((art) => (
            <div key={art} className="overflow-hidden rounded-2xl border border-line-subtle">
              <ProductArt art={art} label="" className="aspect-square w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 border-t border-line-subtle py-14 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Camera, title: 'Professional kit', text: 'The cameras, glass and lights Egyptian productions actually use.' },
          { icon: Wrench, title: 'Checked every time', text: 'Tested and cleaned before every rental, with a handover check.' },
          { icon: Clapperboard, title: 'Built for shoots', text: 'Daily pricing, multi-day discounts and delivery to set.' },
          { icon: HeartHandshake, title: 'Real support', text: `Talk to a technician ${site.hours.toLowerCase()}.` },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl bg-surface p-6">
            <Icon className="text-accent" size={24} strokeWidth={1.8} />
            <p className="mt-5 font-semibold">{title}</p>
            <p className="mt-1.5 text-sm text-fg-secondary">{text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line-subtle bg-bg-secondary p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Planning a shoot?</h2>
        <p className="mx-auto mt-3 max-w-xl text-fg-secondary">
          Tell us what you are making and we will put a kit together for you.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/shop?mode=rent">Browse rentals</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
