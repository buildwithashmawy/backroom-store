'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';

const topics = ['Order question', 'Rental booking', 'Returns and refunds', 'Custom kit quote', 'Other'];

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    setState('sending');
    setFormError(null);
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
    if (res?.ok) return setState('sent');
    const data = await res?.json().catch(() => ({}));
    setErrors(data?.fieldErrors ?? {});
    setFormError(data?.error ?? 'Could not send your message. Please email us instead.');
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <div className="animate-fade py-12 text-center">
        <CheckCircle2 size={40} className="mx-auto text-badge-green" />
        <p className="mt-4 text-lg font-semibold">Message sent</p>
        <p className="mt-1 text-fg-secondary">Thanks. We will get back to you soon.</p>
      </div>
    );
  }

  const field = (name: string, label: string, props: React.ComponentProps<'input'> = {}) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">{label}</span>
      <input name={name} className="field" aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <span className="mt-1 block text-xs text-badge-red">{errors[name]}</span>}
    </label>
  );

  return (
    <form
      onSubmit={onSubmit}
      onChange={(e) => {
        const name = (e.target as unknown as HTMLInputElement).name;
        if (name) setErrors((prev) => ({ ...prev, [name]: '' }));
      }}
      noValidate
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {field('name', 'Name', { autoComplete: 'name' })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
        {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel' })}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">Topic</span>
          <select name="topic" className="field">
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-fg-secondary">Message</span>
        <textarea name="message" rows={5} className="field" aria-invalid={!!errors.message} />
        {errors.message && <span className="mt-1 block text-xs text-badge-red">{errors.message}</span>}
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {formError && <p className="rounded-md bg-badge-red-fill px-3 py-2 text-sm text-badge-red">{formError}</p>}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
