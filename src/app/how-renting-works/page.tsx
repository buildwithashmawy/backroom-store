import type { Metadata } from 'next';
import { CalendarDays, CreditCard, IdCard, PackageCheck, RotateCcw, Truck } from 'lucide-react';
import { ButtonLink, Container, PageHeader } from '@/components/ui';
import { rentalDiscounts, shippingMethods } from '@/lib/catalog';
import { formatEGP } from '@/lib/pricing';

export const metadata: Metadata = { title: 'How renting works' };

export default function HowRentingWorksPage() {
  const steps = [
    { icon: CalendarDays, title: 'Choose gear and dates', text: 'Open any rental item, pick the start and return dates and see the total straight away. Availability is checked live against other bookings.' },
    { icon: CreditCard, title: 'Pay online', text: 'Check out and pay the rental securely through Paymob. You get an email confirmation with your order number.' },
    { icon: Truck, title: 'Delivery or pickup', text: `Collect from the studio for free, or get it delivered and collected in Cairo and Giza for ${formatEGP(shippingMethods.cairo_giza.rentalFee)}.` },
    { icon: IdCard, title: 'Handover check', text: 'Show your national ID or passport and pay the refundable deposit. We test every item with you before you leave.' },
    { icon: PackageCheck, title: 'Shoot', text: 'Call or WhatsApp us any time during the rental if something is not working. We will help or swap the item.' },
    { icon: RotateCcw, title: 'Return', text: 'Bring the gear back by 20:00 on the return date, or we collect it. Your deposit is returned once it is checked.' },
  ];
  return (
    <Container>
      <PageHeader
        eyebrow="Renting"
        title="How renting works"
        intro={`Daily rates, ${rentalDiscounts[1].percent}% off ${rentalDiscounts[1].minDays}+ days and ${rentalDiscounts[0].percent}% off a week or more.`}
      />
      <ol className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="animate-rise rounded-2xl border border-line-subtle bg-bg-secondary p-6" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <Icon size={24} className="text-accent" strokeWidth={1.8} />
              <span className="text-sm font-bold text-fg-subtle">0{i + 1}</span>
            </div>
            <p className="mt-8 text-lg font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{text}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/shop?mode=rent">Browse rentals</ButtonLink>
        <ButtonLink href="/rental-terms" variant="ghost">Read the rental terms</ButtonLink>
      </div>
    </Container>
  );
}
