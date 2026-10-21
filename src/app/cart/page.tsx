import type { Metadata } from 'next';
import { Container, PageHeader } from '@/components/ui';
import { CartView } from './CartView';

export const metadata: Metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <Container>
      <PageHeader title="Your cart" />
      <CartView />
    </Container>
  );
}
