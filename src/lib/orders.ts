import 'server-only';
import crypto from 'node:crypto';
import { connectDb } from './db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getProductsByIds } from './products';
import { priceLine, PricingError, totals, type CartLineInput, type PricedLine, type Totals } from './pricing';
import type { ShippingMethod } from './catalog';
import type { TransactionSummary } from './paymob';
import { sendOrderEmails } from './email';

/** Unpaid orders hold rental stock for this long, which covers a Paymob session. */
const PENDING_HOLD_MS = 30 * 60 * 1000;

export async function quoteCart(
  lines: CartLineInput[],
  method: ShippingMethod | null,
): Promise<{ lines: PricedLine[]; totals: Totals }> {
  if (lines.length === 0) throw new PricingError('Your cart is empty.');
  if (lines.length > 30) throw new PricingError('That is a lot of gear. Contact us for large orders.');
  const products = await getProductsByIds([...new Set(lines.map((l) => l.productId))]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const priced = lines.map((line) => {
    const product = byId.get(line.productId);
    if (!product) throw new PricingError('An item in your cart is no longer available. Please remove it.');
    return priceLine(product, line);
  });

  // The same product can sit in the cart more than once (two rental windows,
  // or buy and rent), so check stock across all lines of a product.
  for (const product of products) {
    const own = priced.filter((l) => l.productId === product.id);
    const bought = own.filter((l) => l.mode === 'buy').reduce((s, l) => s + l.quantity, 0);
    if (bought > product.stock) throw new PricingError(`Only ${product.stock} of ${product.name} left in stock.`);
    for (const rental of own.filter((l) => l.mode === 'rent')) {
      const booked = await unitsBooked(product.id, rental.startDate!, rental.endDate!);
      const sameCart = own
        .filter((l) => l !== rental && l.mode === 'rent' && overlaps(l, rental))
        .reduce((s, l) => s + l.quantity, 0);
      const free = product.rentalUnits - booked - sameCart;
      if (rental.quantity > free) {
        throw new PricingError(
          free > 0
            ? `Only ${free} ${product.name} free from ${rental.startDate} to ${rental.endDate}.`
            : `${product.name} is booked from ${rental.startDate} to ${rental.endDate}. Try other dates.`,
        );
      }
    }
  }

  return { lines: priced, totals: totals(priced, method) };
}

function overlaps(a: { startDate?: string; endDate?: string }, b: { startDate?: string; endDate?: string }) {
  return a.startDate! <= b.endDate! && b.startDate! <= a.endDate!;
}

/** Units of a product already rented (or held by an unpaid order) on any day in the window. */
export async function unitsBooked(productId: string, startDate: string, endDate: string): Promise<number> {
  await connectDb();
  const orders = await Order.find({
    $or: [
      { status: 'paid' },
      { status: 'pending_payment', createdAt: { $gt: new Date(Date.now() - PENDING_HOLD_MS) } },
    ],
    lines: { $elemMatch: { productId, mode: 'rent', startDate: { $lte: endDate }, endDate: { $gte: startDate } } },
  }).lean();
  // Peak usage on a single day, so back-to-back rentals do not double count.
  let peak = 0;
  for (let d = startDate; d <= endDate; d = nextDay(d)) {
    let used = 0;
    for (const o of orders) {
      for (const l of o.lines) {
        if (String(l.productId) === productId && l.mode === 'rent' && l.startDate! <= d && d <= l.endDate!) {
          used += l.quantity ?? 0;
        }
      }
    }
    peak = Math.max(peak, used);
  }
  return peak;
}

function nextDay(d: string) {
  return new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
}

export function newOrderNumber() {
  return `BR-${Date.now().toString(36).toUpperCase().slice(-5)}${crypto.randomInt(100, 999)}`;
}

export function newAccessToken() {
  return crypto.randomBytes(18).toString('base64url');
}

export async function findOrderForCustomer(id: string, token: string) {
  await connectDb();
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  const order = await Order.findById(id).lean();
  if (!order) return null;
  const a = Buffer.from(order.accessToken);
  const b = Buffer.from(token || '');
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? order : null;
}

/**
 * Records a Paymob transaction on its order. Safe to call more than once for
 * the same transaction (webhook and redirect both report it), and uses atomic
 * updates so the two can arrive at the same time.
 */
export async function applyTransaction(tx: TransactionSummary, source: 'webhook' | 'redirect') {
  await connectDb();
  const order =
    (tx.reference && /^[a-f0-9]{24}$/i.test(tx.reference) ? await Order.findById(tx.reference).lean() : null) ??
    (tx.paymobOrderId ? await Order.findOne({ 'payment.paymobOrderId': tx.paymobOrderId }).lean() : null);
  if (!order) return { ok: false as const, reason: 'order_not_found' };
  const _id = order._id;

  const expectedCents = Math.round((order.total ?? 0) * 100);
  const amountMatches = tx.amountCents === expectedCents && (!tx.currency || tx.currency === 'EGP');

  await Order.updateOne({ _id }, { $push: { 'payment.events': { source, at: new Date(), ...tx } } });

  if (tx.isRefunded || tx.isVoided) {
    await Order.updateOne({ _id, status: 'paid' }, { $set: { status: 'refunded' } });
  } else if (tx.success && !tx.pending && amountMatches) {
    const marked = await Order.updateOne(
      { _id, status: { $in: ['pending_payment', 'payment_failed'] } },
      {
        $set: {
          status: 'paid',
          'payment.paidAt': new Date(),
          'payment.transactionId': tx.transactionId,
          'payment.paymobOrderId': tx.paymobOrderId || order.payment?.paymobOrderId,
          'payment.sourceType': tx.sourceSubType || tx.sourceType,
          'payment.maskedPan': tx.maskedPan,
        },
      },
    );
    // Only the call that marked the order paid takes purchased items out of stock.
    if (marked.modifiedCount === 1) {
      for (const l of order.lines.filter((l) => l.mode === 'buy')) {
        await Product.updateOne({ _id: l.productId }, { $inc: { stock: -(l.quantity ?? 0) } });
      }
    }
  } else if (!tx.pending) {
    await Order.updateOne(
      { _id, status: 'pending_payment' },
      {
        $set: {
          status: 'payment_failed',
          'payment.message': amountMatches ? tx.message : 'Amount did not match the order total.',
        },
      },
    );
  }

  const updated = await Order.findById(_id).lean();
  if (updated?.status === 'paid') {
    // Claim the email first so only one of two concurrent callers sends it.
    const claim = await Order.updateOne({ _id, emailSentAt: null }, { $set: { emailSentAt: new Date() } });
    if (claim.modifiedCount === 1) {
      const sent = await sendOrderEmails(updated).catch((err) => {
        console.error('Order email failed', err);
        return false;
      });
      if (!sent) await Order.updateOne({ _id }, { $unset: { emailSentAt: 1 } });
    }
  }
  return { ok: true as const, status: updated?.status, orderId: String(_id) };
}
