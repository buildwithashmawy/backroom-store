import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceLine, rentalDays, shippingFee, totals, PricingError, type PricedProduct } from '../src/lib/pricing';

const product: PricedProduct = {
  id: 'a'.repeat(24),
  slug: 'fx3',
  name: 'FX3',
  buyPrice: 200000,
  rentPricePerDay: 3500,
  deposit: 40000,
  stock: 2,
  rentalUnits: 3,
};
const today = '2026-10-21';

test('rental days count both ends', () => {
  assert.equal(rentalDays('2026-10-22', '2026-10-22'), 1);
  assert.equal(rentalDays('2026-10-22', '2026-10-24'), 3);
  assert.throws(() => rentalDays('2026-10-24', '2026-10-22'), PricingError);
});

test('multi-day discounts', () => {
  const two = priceLine(product, { productId: product.id, mode: 'rent', quantity: 1, startDate: '2026-10-22', endDate: '2026-10-23' }, today);
  assert.equal(two.lineTotal, 7000);
  const three = priceLine(product, { productId: product.id, mode: 'rent', quantity: 1, startDate: '2026-10-22', endDate: '2026-10-24' }, today);
  assert.equal(three.lineTotal, 9450);
  const week = priceLine(product, { productId: product.id, mode: 'rent', quantity: 2, startDate: '2026-10-22', endDate: '2026-10-28' }, today);
  assert.equal(week.lineTotal, 39200);
  assert.equal(week.deposit, 80000);
});

test('rentals must start tomorrow or later', () => {
  assert.throws(
    () => priceLine(product, { productId: product.id, mode: 'rent', quantity: 1, startDate: today, endDate: today }, today),
    /can start from 2026-10-22/,
  );
});

test('stock and mode limits', () => {
  assert.throws(() => priceLine(product, { productId: product.id, mode: 'buy', quantity: 3 }, today), /Only 2/);
  assert.throws(() => priceLine({ ...product, buyPrice: null }, { productId: product.id, mode: 'buy', quantity: 1 }, today), /rent only/);
});

test('shipping fees', () => {
  const buy = priceLine(product, { productId: product.id, mode: 'buy', quantity: 1 }, today);
  assert.equal(shippingFee('cairo_giza', [buy]), 0); // over the free threshold
  assert.equal(shippingFee('cairo_giza', [{ mode: 'buy', lineTotal: 1000 }]), 150);
  assert.equal(shippingFee('cairo_giza', [{ mode: 'rent', lineTotal: 1000 }]), 300);
  assert.equal(shippingFee('pickup', [{ mode: 'rent', lineTotal: 1000 }]), 0);
  assert.throws(() => shippingFee('other_governorates', [{ mode: 'rent', lineTotal: 1000 }]), PricingError);
  const t = totals([buy], 'other_governorates');
  assert.equal(t.total, 200000);
});
