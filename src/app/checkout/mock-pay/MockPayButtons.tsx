'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

export function MockPayButtons({ reference }: { reference: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function pay(outcome: 'success' | 'decline') {
    setBusy(outcome);
    const res = await fetch('/api/paymob/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: reference, outcome }),
    });
    const data = await res.json();
    if (data.redirectUrl) window.location.assign(data.redirectUrl);
    else setBusy(null);
  }
  return (
    <div className="mt-6 grid gap-3">
      <Button size="lg" onClick={() => pay('success')} disabled={!!busy}>
        {busy === 'success' ? 'Processing…' : 'Pay (approve)'}
      </Button>
      <Button size="lg" variant="ghost" onClick={() => pay('decline')} disabled={!!busy}>
        {busy === 'decline' ? 'Processing…' : 'Simulate a declined card'}
      </Button>
    </div>
  );
}
