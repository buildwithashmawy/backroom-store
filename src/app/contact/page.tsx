import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Container, PageHeader } from '@/components/ui';
import { fullAddress, registration, site } from '@/lib/site';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = { title: 'Contact us' };

export default function ContactPage() {
  const items = [
    { icon: Phone, label: 'Phone', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: site.whatsapp, href: `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Studio', value: fullAddress },
    { icon: Clock, label: 'Hours', value: site.hours },
  ];
  return (
    <Container>
      <PageHeader
        title="Talk to the BackRoom team"
        intro="Questions about an order, a rental or a custom kit for your shoot? We usually reply within a few hours on working days."
      />
      <div className="grid gap-12 py-12 lg:grid-cols-[1fr_1.3fr]">
        <ul className="space-y-6">
          {items.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface">
                <Icon size={19} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-fg-muted">{label}</p>
                {href ? (
                  <a href={href} className="font-semibold hover:text-accent">{value}</a>
                ) : (
                  <p className="font-semibold">{value}</p>
                )}
              </div>
            </li>
          ))}
          <li className="pt-2 text-sm text-fg-muted">
            {[site.legalName, registration].filter(Boolean).join(' · ')}
          </li>
        </ul>
        <div className="rounded-2xl border border-line-subtle bg-bg-secondary p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
