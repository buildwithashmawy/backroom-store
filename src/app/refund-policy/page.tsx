import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/PolicyPage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Refund and return policy' };

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      current="/refund-policy"
      title="Refund and return policy"
      intro="How returns, rental cancellations and refunds work for purchases and rentals from the BackRoom Store."
    >
      <h2>Returning a purchase</h2>
      <p>
        You can return any item you bought within <strong>14 days of receiving it</strong>, in line with the Egyptian
        Consumer Protection Law (No. 181 of 2018), as long as it is unused, complete and in its original packaging with
        all accessories, manuals and seals.
      </p>
      <ul>
        <li>To start a return, contact us with your order number at {site.email} or {site.phone}.</li>
        <li>You can drop the item at our studio, or we can collect it in Cairo and Giza for the standard delivery fee.</li>
        <li>We inspect the item within 3 working days of receiving it and tell you the outcome.</li>
        <li>
          Memory cards, batteries and other consumables can only be returned if their packaging is still sealed, for
          hygiene and data-safety reasons.
        </li>
      </ul>

      <h2>Faulty or wrong items</h2>
      <p>
        If an item arrives damaged, faulty or is not what you ordered, tell us within <strong>30 days</strong> of
        delivery. We will repair it, replace it or refund it in full, including the delivery fee, at your choice where
        the law allows. Items covered by a manufacturer warranty after that period are handled through the authorised
        agent, and we help you with the claim.
      </p>

      <h2>Cancelling a rental</h2>
      <ul>
        <li>
          <strong>48 hours or more</strong> before the rental start date: full refund.
        </li>
        <li>
          <strong>Between 24 and 48 hours</strong> before the start date: 50% refund of the rental amount.
        </li>
        <li>
          <strong>Less than 24 hours</strong> before the start date, or not collecting the gear: no refund.
        </li>
        <li>You can move a rental to new dates once, free of charge, if you ask at least 24 hours before it starts and the gear is free.</li>
        <li>Returning gear early does not refund the unused days.</li>
        <li>
          If gear we supply is faulty and we cannot replace it with equivalent gear the same day, we refund the affected
          days in full.
        </li>
      </ul>

      <h2>Security deposits</h2>
      <p>
        Rental deposits are not charged online. They are collected at handover and returned in full when the gear comes
        back complete and undamaged, normally the same day. See the <Link href="/rental-terms">rental terms</Link> for
        what happens if gear is damaged or late.
      </p>

      <h2>How refunds are paid</h2>
      <ul>
        <li>Refunds go back to the card or wallet you paid with, through Paymob.</li>
        <li>
          We issue the refund within 3 working days of approving it. Your bank or wallet provider usually takes 7 to 14
          working days to show it on your statement.
        </li>
        <li>Delivery fees are refunded only when the item was faulty, wrong, or the order was cancelled by us.</li>
        <li>We do not charge any fee for processing a refund.</li>
      </ul>

      <h2>Orders we cancel</h2>
      <p>
        If we cannot fulfil an order, for example because an item is no longer available, we tell you straight away and
        refund the full amount you paid, including delivery.
      </p>

      <h2>Contact</h2>
      <p>
        {site.legalName}, {site.address.line1}, {site.address.area}, {site.address.city}. Email {site.email}, phone{' '}
        {site.phone}, {site.hours}.
      </p>
    </PolicyPage>
  );
}
