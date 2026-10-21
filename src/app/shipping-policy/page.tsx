import type { Metadata } from 'next';
import { PolicyPage } from '@/components/PolicyPage';
import { freeShippingThreshold, shippingMethods } from '@/lib/catalog';
import { formatEGP } from '@/lib/pricing';
import { fullAddress, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Delivery and shipping' };

export default function ShippingPolicyPage() {
  const { pickup, cairo_giza, other_governorates } = shippingMethods;
  return (
    <PolicyPage
      current="/shipping-policy"
      title="Delivery and shipping"
      intro="Where we deliver, how long it takes and what it costs."
    >
      <h2>Delivery options</h2>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-line-subtle text-sm">
        <table className="w-full">
          <thead className="bg-surface text-left text-fg">
            <tr>
              <th className="px-4 py-3 font-semibold">Option</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Purchases</th>
              <th className="px-4 py-3 font-semibold">Rentals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            <tr>
              <td className="px-4 py-3">Studio pickup</td>
              <td className="px-4 py-3">Same or next working day</td>
              <td className="px-4 py-3">Free</td>
              <td className="px-4 py-3">Free</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Cairo and Giza</td>
              <td className="px-4 py-3">1 to 2 working days</td>
              <td className="px-4 py-3">{formatEGP(cairo_giza.fee)}</td>
              <td className="px-4 py-3">{formatEGP(cairo_giza.rentalFee)}, delivery and collection</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Other governorates</td>
              <td className="px-4 py-3">3 to 5 working days</td>
              <td className="px-4 py-3">{formatEGP(other_governorates.fee)}</td>
              <td className="px-4 py-3">Not available</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Purchases over <strong>{formatEGP(freeShippingThreshold)}</strong> ship free. Fees are shown at checkout before
        you pay. {pickup.description}
      </p>

      <h2>Purchases</h2>
      <ul>
        <li>Orders paid before 15:00 on a working day are prepared the same day.</li>
        <li>We deliver through our own team in Cairo and Giza, and through licensed couriers elsewhere in Egypt.</li>
        <li>We call you before delivery. Please check the package in front of the courier and refuse it if it is damaged.</li>
        <li>If a delivery fails twice because nobody is available, we return the order to the studio and contact you.</li>
      </ul>

      <h2>Rentals</h2>
      <ul>
        <li>Rental gear is delivered on the morning of the start date, or the evening before by arrangement.</li>
        <li>We collect it on the evening of the return date. The fee covers both trips.</li>
        <li>The person receiving the gear must show the national ID or passport of the person who booked.</li>
        <li>We test every item with you at handover so both sides agree on its condition.</li>
      </ul>

      <h2>Studio pickup</h2>
      <p>
        {fullAddress}. {site.hours}. Bring your order number and ID.
      </p>
    </PolicyPage>
  );
}
