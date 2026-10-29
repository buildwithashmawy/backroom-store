import type { Metadata } from 'next';
import { PolicyPage } from '@/components/PolicyPage';
import { rentalDiscounts, rentalLimits } from '@/lib/catalog';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Rental terms' };

export default function RentalTermsPage() {
  return (
    <PolicyPage
      current="/rental-terms"
      title="Rental terms"
      intro="The agreement between you and BackRoom when you rent equipment. By booking a rental you accept these terms."
    >
      <h2>Booking and pricing</h2>
      <ul>
        <li>
          Rentals are priced per day. A day is counted for every calendar date from the start date to the return date,
          both included.
        </li>
        <li>
          Rentals of {rentalDiscounts[1].minDays} days or more get {rentalDiscounts[1].percent}% off, and{' '}
          {rentalDiscounts[0].minDays} days or more get {rentalDiscounts[0].percent}% off.
        </li>
        <li>
          Online bookings start at least {rentalLimits.minLeadDays} day ahead and last up to {rentalLimits.maxDays}{' '}
          days. Contact us for same-day or longer rentals.
        </li>
        <li>A booking is confirmed once the rental is paid in full online.</li>
      </ul>

      <h2>Identification and deposit</h2>
      <ul>
        <li>The renter must be 21 or older and show a valid Egyptian national ID or passport at handover.</li>
        <li>
          Each item has a refundable security deposit, shown on its page and at checkout. It is paid at handover in cash,
          card or bank transfer, and returned when the gear comes back complete and undamaged.
        </li>
        <li>Companies can rent against a signed company letter and commercial register instead of a cash deposit, by arrangement.</li>
      </ul>

      <h2>Handover and return</h2>
      <ul>
        <li>We test each item with you at handover and note its condition and serial number.</li>
        <li>Gear must be returned by 20:00 on the return date, complete with all cases, cables, batteries and accessories.</li>
        <li>
          Late returns are charged at the full daily rate for each extra day or part day, unless you extended the rental
          with us in advance.
        </li>
      </ul>

      <h2>Care, damage and loss</h2>
      <ul>
        <li>You are responsible for the gear from handover until it is returned to us.</li>
        <li>Use the gear as the manufacturer intends. Do not open, modify or repair it, and keep it away from water, sand and extreme heat unless it is rated for that.</li>
        <li>Report any fault or damage to us straight away. Do not keep using faulty gear.</li>
        <li>
          Repair costs for damage beyond normal wear are deducted from the deposit. If repairs cost more than the deposit,
          you pay the difference against the repair invoice.
        </li>
        <li>Lost or stolen gear is charged at its current replacement value. Theft must be reported to the police and to us within 24 hours.</li>
      </ul>

      <h2>Use</h2>
      <ul>
        <li>Gear may not be sub-rented, lent or taken outside Egypt without our written agreement.</li>
        <li>You may use the gear for personal and commercial productions.</li>
      </ul>

      <h2>Cancellations and refunds</h2>
      <p>
        Rental cancellations follow our refund and return policy: a full refund 48 hours or more before the start date,
        50% between 24 and 48 hours, and none after that.
      </p>

      <h2>Contact</h2>
      <p>
        {site.legalName}. {site.email}, {site.phone}.
      </p>
    </PolicyPage>
  );
}
