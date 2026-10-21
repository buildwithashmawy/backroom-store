import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink, Container, PageHeader } from '@/components/ui';
import { rentalDiscounts, shippingMethods } from '@/lib/catalog';
import { formatEGP } from '@/lib/pricing';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'How renting works' };

export default function HowRentingWorksPage() {
  const steps = [
    {
      title: 'Choose gear and dates',
      text: 'Open any rental item and pick your pickup and return dates. The price updates straight away and availability is checked against other bookings.',
    },
    {
      title: 'Pay online',
      text: 'Check out and pay the rental by card, Meeza or mobile wallet through Paymob. Your booking is confirmed by email with an order number.',
    },
    {
      title: 'Collect or get it delivered',
      text: `Pick up from the studio in ${site.address.area} for free, or have it delivered and collected in Cairo and Giza for ${formatEGP(shippingMethods.cairo_giza.rentalFee)}.`,
    },
    {
      title: 'Handover check',
      text: 'Show your national ID or passport and leave the refundable deposit. We power up and test each item with you and note serial numbers.',
    },
    {
      title: 'Shoot',
      text: `If anything misbehaves on set, call or WhatsApp ${site.whatsapp}. We troubleshoot with you or swap the item.`,
    },
    {
      title: 'Return',
      text: 'Bring the gear back by 20:00 on the return date, or we collect it. The deposit is returned once everything is checked in.',
    },
  ];
  return (
    <Container>
      <PageHeader
        title="How renting works"
        intro={`Day rates, with ${rentalDiscounts[1].percent}% off ${rentalDiscounts[1].minDays} days or more and ${rentalDiscounts[0].percent}% off a week or longer.`}
      />
      <ol className="max-w-3xl divide-y divide-line-subtle py-6">
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[48px_1fr] gap-2 py-6">
            <span className="text-sm font-semibold tabular-nums text-fg-muted">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="text-lg font-semibold">{s.title}</p>
              <p className="mt-1.5 leading-relaxed text-fg-secondary">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-4">
        <ButtonLink href="/shop?mode=rent">Browse rentals</ButtonLink>
        <Link href="/rental-terms" className="text-sm font-semibold underline underline-offset-4">
          Read the rental terms
        </Link>
      </div>
    </Container>
  );
}
