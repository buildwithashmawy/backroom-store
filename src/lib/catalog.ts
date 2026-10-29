// Store rules that are not per product: categories, rental discounts,
// delivery zones. Kept in one place so checkout, policy pages and tests agree.

export const categories = [
  { slug: 'cameras', name: 'Cameras', blurb: 'Cinema and mirrorless bodies' },
  { slug: 'lenses', name: 'Lenses', blurb: 'Primes, zooms and cine glass' },
  { slug: 'lighting', name: 'Lighting', blurb: 'LED, COB and RGB fixtures' },
  { slug: 'audio', name: 'Audio', blurb: 'Mics, wireless and recorders' },
  { slug: 'grip', name: 'Grip & Support', blurb: 'Gimbals, tripods and stands' },
  { slug: 'monitors', name: 'Monitors', blurb: 'On-camera monitors and recorders' },
  { slug: 'accessories', name: 'Accessories', blurb: 'Power, media and essentials' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

/** Multi-day rental discounts, applied to the whole rental. */
export const rentalDiscounts = [
  { minDays: 7, percent: 20 },
  { minDays: 3, percent: 10 },
] as const;

export const rentalLimits = {
  /** Rentals start at least this many days from today. */
  minLeadDays: 1,
  maxDays: 30,
};

export type ShippingMethod = 'pickup' | 'cairo_giza' | 'other_governorates';

export const shippingMethods: Record<
  ShippingMethod,
  { label: string; description: string; fee: number; rentalFee: number; allowsRental: boolean }
> = {
  pickup: {
    label: 'Pick up from BackRoom Studio',
    description: 'Free. Ready the same or next working day.',
    fee: 0,
    rentalFee: 0,
    allowsRental: true,
  },
  cairo_giza: {
    label: 'Delivery in Cairo and Giza',
    description: '1 to 2 working days. Rentals include collection at the end.',
    fee: 150,
    rentalFee: 300,
    allowsRental: true,
  },
  other_governorates: {
    label: 'Delivery to other governorates',
    description: '3 to 5 working days. Purchases only.',
    fee: 250,
    rentalFee: 0,
    allowsRental: false,
  },
};

/** Purchases over this subtotal ship free (rental delivery is still charged). */
export const freeShippingThreshold = 20000;

export const governorates = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Gharbia',
  'Monufia', 'Beheira', 'Kafr El Sheikh', 'Damietta', 'Port Said', 'Ismailia',
  'Suez', 'Faiyum', 'Beni Suef', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor',
  'Aswan', 'Red Sea', 'Matrouh', 'New Valley', 'North Sinai', 'South Sinai',
];
