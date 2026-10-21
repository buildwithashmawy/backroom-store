import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, PageHeader } from '@/components/ui';
import { freeShippingThreshold } from '@/lib/catalog';
import { formatEGP } from '@/lib/pricing';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'FAQ' };

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: 'How do I pay?', a: 'By Visa, Mastercard, Meeza card or mobile wallet, on Paymob’s secure payment page. Your card details never reach our servers.' },
  { q: 'Are prices in Egyptian pounds?', a: 'Yes. Every price on the store is in EGP and includes applicable taxes. Delivery is added at checkout before you pay.' },
  { q: 'How is a rental day counted?', a: 'Every calendar date from your start date to your return date counts as a day, both included. A Thursday to Saturday rental is three days.' },
  { q: 'Do I pay the deposit online?', a: 'No. The refundable deposit is paid at handover, together with showing your national ID or passport, and returned when the gear comes back in good condition.' },
  { q: 'Can I cancel a rental?', a: <>Yes. Cancel 48 hours or more before the start date for a full refund. See the <Link href="/refund-policy" className="text-accent">refund policy</Link> for the details.</> },
  { q: 'Can I return something I bought?', a: 'Unused items in their original packaging can be returned within 14 days of delivery. Faulty items can be reported within 30 days.' },
  { q: 'Where do you deliver?', a: `Purchases ship anywhere in Egypt, and are free over ${formatEGP(freeShippingThreshold)}. Rentals are delivered and collected in Cairo and Giza, or picked up from our studio.` },
  { q: 'Is the rental gear insured?', a: 'You are responsible for the gear during the rental, as set out in the rental terms. For high-value kits we can recommend production insurance.' },
  { q: 'Can my company rent on account?', a: `Yes. Email ${site.email} with your company details and we will set up invoicing and a deposit arrangement.` },
];

export default function FaqPage() {
  return (
    <Container className="max-w-4xl">
      <PageHeader title="Frequently asked questions" />
      <div className="divide-y divide-line-subtle py-6">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
              {f.q}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-fg-secondary transition duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="animate-fade mt-3 max-w-3xl leading-relaxed text-fg-secondary">{f.a}</p>
          </details>
        ))}
      </div>
    </Container>
  );
}
