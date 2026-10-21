import type { Metadata } from 'next';
import { PolicyPage } from '@/components/PolicyPage';
import { fullAddress, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return (
    <PolicyPage
      current="/privacy"
      title="Privacy policy"
      intro="What personal data we collect when you shop or rent with us, why, and the choices you have."
    >
      <h2>Who is responsible</h2>
      <p>
        {site.legalName}, {fullAddress}, is responsible for your personal data. Contact us at {site.email} about
        anything in this policy.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Order details:</strong> your name, email, mobile number, delivery address and what you bought or rented.</li>
        <li><strong>Rental checks:</strong> the ID document you show at handover, which we record for the rental period.</li>
        <li><strong>Payment results:</strong> whether a payment succeeded, its reference and the last four digits of the card. We never receive or store full card numbers or CVV codes; these go directly to Paymob.</li>
        <li><strong>Messages:</strong> what you send us through the contact form, email or phone.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To process payments, deliver orders and manage rentals.</li>
        <li>To contact you about your order, returns and refunds.</li>
        <li>To meet our legal, tax and accounting obligations.</li>
        <li>To prevent fraud and protect our equipment.</li>
      </ul>
      <p>We do not sell your data, and we only send marketing messages if you ask us to.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>Paymob</strong>, to process your payment securely.</li>
        <li><strong>Delivery partners</strong>, who receive your name, phone and address to deliver your order.</li>
        <li><strong>Service providers</strong> that host our website, database and email, under agreements to keep your data safe.</li>
        <li><strong>Authorities</strong>, when the law requires it.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep order records for as long as Egyptian tax and commercial law requires, currently up to five years. Contact
        messages are kept for up to two years. Rental ID records are deleted 90 days after the gear is returned, unless
        there is an open claim.
      </p>

      <h2>Cookies and storage</h2>
      <p>
        We use your browser&apos;s local storage to remember your cart. We do not use advertising cookies. Paymob&apos;s
        payment page may set its own cookies to secure the payment.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Egyptian Personal Data Protection Law (No. 151 of 2020) you can ask to see, correct or delete your
        personal data, or object to how we use it. Email {site.email} and we will reply within 30 days.
      </p>

      <h2>Security</h2>
      <p>
        The store runs over HTTPS, payments are handled by a PCI DSS certified provider, and access to order data is
        limited to staff who need it.
      </p>
    </PolicyPage>
  );
}
