import { ButtonLink, Container } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="max-w-xl py-28 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-3xl font-extrabold">This page is not on the call sheet</h1>
      <p className="mt-3 text-fg-secondary">The link may be old, or the item is no longer available.</p>
      <ButtonLink href="/shop" className="mt-8">Browse gear</ButtonLink>
    </Container>
  );
}
