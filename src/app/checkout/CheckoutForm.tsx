'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useQuote } from '@/components/cart/useQuote';
import { formatRange } from '@/lib/format';
import { ProductArt } from '@/components/ProductArt';
import { Button, buttonClass } from '@/components/ui';
import { PaymentMarks } from '@/components/layout/Footer';
import { formatEGP, shippingFee } from '@/lib/pricing';
import { governorates, shippingMethods, type ShippingMethod } from '@/lib/catalog';

type Errors = Record<string, string>;

export function CheckoutForm() {
  const { lines, ready } = useCart();
  const hasRental = lines.some((l) => l.mode === 'rent');
  const [method, setMethod] = useState<ShippingMethod>('pickup');
  const { quote, error: quoteError } = useQuote(lines, method);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const methods = useMemo(
    () => (Object.keys(shippingMethods) as ShippingMethod[]).filter((m) => !hasRental || shippingMethods[m].allowsRental),
    [hasRental],
  );

  if (!ready) return <div className="h-96" />;
  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <Link href="/shop" className={buttonClass('primary', 'md', 'mt-6')}>
          Browse gear
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '');
    const body = {
      lines: lines.map(({ productId, mode, quantity, startDate, endDate }) => ({ productId, mode, quantity, startDate, endDate })),
      customer: { firstName: get('firstName'), lastName: get('lastName'), email: get('email'), phone: get('phone') },
      shipping: {
        method,
        governorate: get('governorate'),
        city: get('city'),
        street: get('street'),
        building: get('building'),
        floor: get('floor'),
        apartment: get('apartment'),
        notes: get('notes'),
      },
      acceptTerms: f.get('acceptTerms') === 'on',
    };
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setFormError('Could not reach the store. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  const t = quote?.totals;
  const err = (k: string) => errors[k];

  return (
    <form
      onSubmit={onSubmit}
      onChange={(e) => {
        const name = (e.target as unknown as HTMLInputElement).name;
        if (!name) return;
        setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== name && !k.endsWith(`.${name}`))));
      }}
      noValidate
      className="grid gap-10 py-6 lg:grid-cols-[1.4fr_1fr]"
    >
      <div className="space-y-10">
        <Section title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="firstName" label="First name" autoComplete="given-name" error={err('customer.firstName')} />
            <Field name="lastName" label="Last name" autoComplete="family-name" error={err('customer.lastName')} />
            <Field name="email" label="Email" type="email" autoComplete="email" error={err('customer.email')} />
            <Field name="phone" label="Mobile number" type="tel" autoComplete="tel" placeholder="01001234567" error={err('customer.phone')} />
          </div>
        </Section>

        <Section title="Delivery">
          {hasRental && (
            <p className="mb-4 text-sm text-fg-secondary">
              Your cart has rentals, so delivery is available in Cairo and Giza, or you can pick up from the studio.
            </p>
          )}
          <div className="grid gap-3">
            {methods.map((m) => {
              const info = shippingMethods[m];
              const fee = quote ? shippingFee(m, quote.lines) : info.fee;
              return (
                <label
                  key={m}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    method === m ? 'border-on-dark bg-elevated' : 'border-line-subtle hover:border-line'
                  }`}
                >
                  <input type="radio" name="method" className="mt-1 accent-[#57B4E5]" checked={method === m} onChange={() => setMethod(m)} />
                  <span className="flex-1">
                    <span className="flex justify-between gap-3 font-semibold">
                      {info.label}
                      <span className="tabular-nums">{fee === 0 ? 'Free' : formatEGP(fee)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-fg-secondary">{info.description}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {method !== 'pickup' && (
            <div className="animate-fade mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">Governorate</span>
                <select name="governorate" className="field" defaultValue={method === 'cairo_giza' ? 'Cairo' : ''} aria-invalid={!!err('shipping.governorate')}>
                  {method === 'other_governorates' && <option value="">Choose…</option>}
                  {governorates
                    .filter((g) => (method === 'cairo_giza' ? ['Cairo', 'Giza'].includes(g) : !['Cairo', 'Giza'].includes(g)))
                    .map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                </select>
                {err('shipping.governorate') && <span className="mt-1 block text-xs text-badge-red">{err('shipping.governorate')}</span>}
              </label>
              <Field name="city" label="City or area" placeholder="Maadi, Sheikh Zayed…" error={err('shipping.city')} />
              <Field name="street" label="Street" autoComplete="address-line1" className="sm:col-span-2" error={err('shipping.street')} />
              <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                <Field name="building" label="Building" error={err('shipping.building')} />
                <Field name="floor" label="Floor" optional />
                <Field name="apartment" label="Apartment" optional />
              </div>
            </div>
          )}
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">
              Notes <span className="font-normal text-fg-muted">(optional)</span>
            </span>
            <textarea name="notes" rows={3} className="field" placeholder="Landmarks, preferred delivery time, shoot location…" />
          </label>
        </Section>

        <Section title="Payment">
          <div className="rounded-xl border border-line-subtle bg-surface p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Lock size={16} className="text-accent" /> Pay securely with Paymob
            </p>
            <p className="mt-1 text-sm text-fg-secondary">
              You will enter your card or wallet details on Paymob&apos;s secure page. BackRoom never sees or stores your
              card number.
            </p>
            <div className="mt-3">
              <PaymentMarks />
            </div>
          </div>
        </Section>
      </div>

      <aside className="h-fit rounded-2xl border border-line-subtle bg-bg-secondary p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="mt-4 space-y-4">
          {lines.map((l, i) => {
            const p = quote?.lines[i];
            return (
              <li key={l.key} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface">
                  <ProductArt art={l.snapshot.art} label="" className="h-full w-full" />
                  <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-md bg-muted px-1 text-[11px] font-bold">
                    {l.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">{l.snapshot.name}</p>
                  <p className="text-fg-muted">
                    {l.mode === 'rent' ? `Rent · ${formatRange(l.startDate, l.endDate)}` : 'Buy'}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{p ? formatEGP(p.lineTotal) : '…'}</p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line-subtle pt-4 text-sm">
          <Row label="Subtotal" value={t ? formatEGP(t.subtotal) : '…'} />
          <Row label="Delivery" value={t ? (t.shipping === 0 ? 'Free' : formatEGP(t.shipping)) : '…'} />
          <div className="flex justify-between border-t border-line-subtle pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{t ? formatEGP(t.total) : '…'}</dd>
          </div>
          {t && t.deposit > 0 && (
            <p className="text-xs text-fg-muted">
              Refundable deposit of {formatEGP(t.deposit)} is paid at handover and is not charged now.
            </p>
          )}
        </dl>

        <label className="mt-5 flex gap-3 text-sm text-fg-secondary">
          <input type="checkbox" name="acceptTerms" className="mt-0.5 h-4 w-4 accent-[#57B4E5]" aria-invalid={!!err('acceptTerms')} />
          <span>
            I agree to the <Link href="/terms" className="text-accent underline" target="_blank">terms</Link>,{' '}
            <Link href="/refund-policy" className="text-accent underline" target="_blank">refund policy</Link>
            {hasRental && (
              <>
                {' '}and <Link href="/rental-terms" className="text-accent underline" target="_blank">rental terms</Link>
              </>
            )}
            .
          </span>
        </label>
        {err('acceptTerms') && <p className="mt-1 text-xs text-badge-red">{err('acceptTerms')}</p>}

        {(formError || quoteError) && (
          <p className="mt-4 rounded-md bg-badge-red-fill px-3 py-2 text-sm text-badge-red">{formError || quoteError}</p>
        )}
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting || !quote || !!quoteError}>
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Opening secure payment…
            </>
          ) : (
            <>
              <Lock size={16} /> Pay {t ? formatEGP(t.total) : ''}
            </>
          )}
        </Button>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  optional,
  className = '',
  ...props
}: React.ComponentProps<'input'> & { label: string; error?: string; optional?: boolean }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">
        {label} {optional && <span className="font-normal text-fg-muted">(optional)</span>}
      </span>
      <input className="field" aria-invalid={!!error} {...props} />
      {error && <span className="mt-1 block text-xs text-badge-red">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-fg-secondary">
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
