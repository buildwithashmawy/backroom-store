import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Container>
      <h1 className="pb-2 pt-10 text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </Container>
  );
}
