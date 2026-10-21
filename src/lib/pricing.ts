// Pure pricing rules. The server re-runs these on every checkout, so prices
// shown in the browser are never trusted.
import {
  freeShippingThreshold,
  rentalDiscounts,
  rentalLimits,
  shippingMethods,
  type ShippingMethod,
} from './catalog';

export type Mode = 'buy' | 'rent';

export interface PricedProduct {
  id: string;
  slug: string;
  name: string;
  buyPrice: number | null;
  rentPricePerDay: number | null;
  deposit: number;
  stock: number;
  rentalUnits: number;
}

export interface CartLineInput {
  productId: string;
  mode: Mode;
  quantity: number;
  startDate?: string;
  endDate?: string;
}

export interface PricedLine {
  productId: string;
  slug: string;
  name: string;
  mode: Mode;
  quantity: number;
  startDate?: string;
  endDate?: string;
  days?: number;
  unitPrice: number;
  discountPercent: number;
  lineTotal: number;
  deposit: number;
}

export class PricingError extends Error {}

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDate(value: string): number {
  if (!ISO_DATE.test(value)) throw new PricingError('Dates must look like 2026-10-21.');
  const t = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(t)) throw new PricingError('That date does not exist.');
  return t;
}

export function todayInCairo(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(now);
}

export function addDays(date: string, days: number): string {
  return new Date(parseDate(date) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Rental length in days, counting both the start and the end date. */
export function rentalDays(startDate: string, endDate: string): number {
  const days = Math.round((parseDate(endDate) - parseDate(startDate)) / DAY_MS) + 1;
  if (days < 1) throw new PricingError('The return date must be on or after the start date.');
  return days;
}

export function rentalDiscountPercent(days: number): number {
  return rentalDiscounts.find((d) => days >= d.minDays)?.percent ?? 0;
}

export function validateRentalWindow(startDate: string, endDate: string, today = todayInCairo()) {
  const days = rentalDays(startDate, endDate);
  const earliest = addDays(today, rentalLimits.minLeadDays);
  if (parseDate(startDate) < parseDate(earliest)) {
    throw new PricingError(`Rentals can start from ${earliest}.`);
  }
  if (days > rentalLimits.maxDays) {
    throw new PricingError(`Rentals can be up to ${rentalLimits.maxDays} days. Contact us for longer hires.`);
  }
  return days;
}

export function priceLine(product: PricedProduct, line: CartLineInput, today?: string): PricedLine {
  const quantity = Math.floor(line.quantity);
  if (!(quantity >= 1 && quantity <= 10)) throw new PricingError('Quantity must be between 1 and 10.');

  if (line.mode === 'buy') {
    if (product.buyPrice == null) throw new PricingError(`${product.name} is available to rent only.`);
    if (quantity > product.stock) {
      throw new PricingError(
        product.stock > 0 ? `Only ${product.stock} of ${product.name} left in stock.` : `${product.name} is out of stock.`,
      );
    }
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      mode: 'buy',
      quantity,
      unitPrice: product.buyPrice,
      discountPercent: 0,
      lineTotal: product.buyPrice * quantity,
      deposit: 0,
    };
  }

  if (product.rentPricePerDay == null) throw new PricingError(`${product.name} is for sale only.`);
  if (!line.startDate || !line.endDate) throw new PricingError(`Pick rental dates for ${product.name}.`);
  if (quantity > product.rentalUnits) {
    throw new PricingError(`We have ${product.rentalUnits} ${product.name} available to rent.`);
  }
  const days = validateRentalWindow(line.startDate, line.endDate, today);
  const discountPercent = rentalDiscountPercent(days);
  const gross = product.rentPricePerDay * days * quantity;
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    mode: 'rent',
    quantity,
    startDate: line.startDate,
    endDate: line.endDate,
    days,
    unitPrice: product.rentPricePerDay,
    discountPercent,
    lineTotal: Math.round(gross * (1 - discountPercent / 100)),
    deposit: product.deposit * quantity,
  };
}

export interface Totals {
  subtotal: number;
  purchaseSubtotal: number;
  rentalSubtotal: number;
  shipping: number;
  total: number;
  deposit: number;
}

export function shippingFee(method: ShippingMethod, lines: Pick<PricedLine, 'mode' | 'lineTotal'>[]): number {
  const m = shippingMethods[method];
  const hasRental = lines.some((l) => l.mode === 'rent');
  const hasPurchase = lines.some((l) => l.mode === 'buy');
  if (hasRental && !m.allowsRental) {
    throw new PricingError('Rentals can be delivered in Cairo and Giza or picked up from the studio.');
  }
  const purchaseSubtotal = lines.filter((l) => l.mode === 'buy').reduce((s, l) => s + l.lineTotal, 0);
  let fee = 0;
  if (hasPurchase && purchaseSubtotal < freeShippingThreshold) fee += m.fee;
  if (hasRental) fee = Math.max(fee, m.rentalFee);
  return fee;
}

export function totals(lines: PricedLine[], method: ShippingMethod | null): Totals {
  const purchaseSubtotal = lines.filter((l) => l.mode === 'buy').reduce((s, l) => s + l.lineTotal, 0);
  const rentalSubtotal = lines.filter((l) => l.mode === 'rent').reduce((s, l) => s + l.lineTotal, 0);
  const shipping = method ? shippingFee(method, lines) : 0;
  const subtotal = purchaseSubtotal + rentalSubtotal;
  return {
    subtotal,
    purchaseSubtotal,
    rentalSubtotal,
    shipping,
    total: subtotal + shipping,
    deposit: lines.reduce((s, l) => s + l.deposit, 0),
  };
}

export function formatEGP(amount: number): string {
  return `EGP ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
