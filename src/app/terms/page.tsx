import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/PolicyPage';
import { fullAddress, registration, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms and conditions' };

export default function TermsPage() {
  return (
    <PolicyPage
      current="/terms"
      title="Terms and conditions"
      intro={`These terms apply to every purchase and rental made on the ${site.storeName} website.`}
    >
      <h2>Who we are</h2>
      <p>
        The {site.storeName} is operated by {site.legalName}{registration && ` (${registration})`}, {fullAddress}.
        You can reach us at {site.email} or {site.phone}.
      </p>

      <h2>Using the store</h2>
      <ul>
        <li>You must be 18 or older to place an order, and 21 or older to rent equipment.</li>
        <li>The details you give at checkout must be accurate, as we use them to deliver your order and contact you.</li>
        <li>Product photos and descriptions are as accurate as we can make them. Small differences in colour or packaging can occur.</li>
      </ul>

      <h2>Prices and payment</h2>
      <ul>
        <li>All prices are in Egyptian pounds (EGP) and include applicable taxes. Delivery fees are shown at checkout before you pay.</li>
        <li>
          Payments are processed by Paymob, a payment provider licensed by the Central Bank of Egypt. You can pay by Visa,
          Mastercard, Meeza or mobile wallet. Card details are entered on Paymob&apos;s secure page and never reach our
          servers.
        </li>
        <li>If a price is shown incorrectly because of an obvious error, we will contact you and you can cancel for a full refund.</li>
      </ul>

      <h2>Orders</h2>
      <ul>
        <li>Your order is confirmed when payment succeeds and you receive a confirmation email.</li>
        <li>We may cancel an order if an item is unavailable or we suspect fraud. In that case we refund the full amount.</li>
        <li>Rental bookings are also subject to our <Link href="/rental-terms">rental terms</Link>.</li>
      </ul>

      <h2>Returns, refunds and delivery</h2>
      <p>
        See our <Link href="/refund-policy">refund and return policy</Link> and our{' '}
        <Link href="/shipping-policy">delivery and shipping policy</Link>.
      </p>

      <h2>Warranty</h2>
      <p>
        New items carry the manufacturer or local agent warranty stated on the product page. Used items are checked and
        come with a 30-day BackRoom warranty against faults that existed at the time of sale.
      </p>

      <h2>Liability</h2>
      <p>
        We are responsible for supplying the goods and services you ordered as described. We are not liable for indirect
        losses, such as lost footage or lost production days, except where the law says otherwise. Nothing in these
        terms limits your rights under the Egyptian Consumer Protection Law.
      </p>

      <h2>Privacy</h2>
      <p>
        We handle your personal data as described in our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the Arab Republic of Egypt. Disputes are handled by the competent courts
        of Cairo, without affecting your right to complain to the Consumer Protection Agency.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The version in force when you place your order applies to that order.</p>
    </PolicyPage>
  );
}
