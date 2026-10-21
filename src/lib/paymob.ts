// Paymob (Egypt) integration through the Intention API and Unified Checkout.
// Docs: https://developers.paymob.com/egypt/intention-api
import crypto from 'node:crypto';

export type PaymobMode = 'live' | 'mock';

export function paymobConfig() {
  const mode: PaymobMode = process.env.PAYMOB_MODE === 'live' ? 'live' : 'mock';
  return {
    mode,
    apiBase: (process.env.PAYMOB_API_BASE || 'https://accept.paymob.com').replace(/\/$/, ''),
    secretKey: process.env.PAYMOB_SECRET_KEY || '',
    publicKey: process.env.PAYMOB_PUBLIC_KEY || '',
    // In mock mode a fixed local secret signs the simulated callbacks.
    hmacSecret: process.env.PAYMOB_HMAC_SECRET || (mode === 'mock' ? 'mock-hmac-secret' : ''),
    integrationIds: (process.env.PAYMOB_INTEGRATION_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number),
  };
}

export interface IntentionInput {
  amountCents: number;
  reference: string;
  items: { name: string; amountCents: number; description: string; quantity: number }[];
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    city: string;
    state: string;
  };
  notificationUrl: string;
  redirectionUrl: string;
}

export interface IntentionResult {
  intentionId: string;
  paymobOrderId: string | null;
  checkoutUrl: string;
}

export class PaymobError extends Error {}

/** Creates a payment intention and returns the Unified Checkout URL. */
export async function createIntention(input: IntentionInput, appUrl: string): Promise<IntentionResult> {
  const cfg = paymobConfig();

  if (cfg.mode === 'mock') {
    const id = `mock_${crypto.randomBytes(6).toString('hex')}`;
    return {
      intentionId: id,
      paymobOrderId: null,
      checkoutUrl: `${appUrl}/checkout/mock-pay?ref=${encodeURIComponent(input.reference)}`,
    };
  }

  if (!cfg.secretKey || !cfg.publicKey || cfg.integrationIds.length === 0) {
    throw new PaymobError('Paymob is not configured. Set PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY and PAYMOB_INTEGRATION_IDS.');
  }

  const na = (v: string) => (v && v.trim() ? v.trim() : 'NA');
  const body = {
    amount: input.amountCents,
    currency: 'EGP',
    payment_methods: cfg.integrationIds,
    items: input.items.map((i) => ({
      name: i.name.slice(0, 50),
      amount: i.amountCents,
      description: i.description.slice(0, 255),
      quantity: i.quantity,
    })),
    billing_data: {
      first_name: input.billing.firstName,
      last_name: input.billing.lastName,
      email: input.billing.email,
      phone_number: input.billing.phone,
      street: na(input.billing.street),
      building: na(input.billing.building),
      floor: na(input.billing.floor),
      apartment: na(input.billing.apartment),
      city: na(input.billing.city),
      state: na(input.billing.state),
      country: 'EG',
      postal_code: 'NA',
    },
    special_reference: input.reference,
    notification_url: input.notificationUrl,
    redirection_url: input.redirectionUrl,
  };

  const res = await fetch(`${cfg.apiBase}/v1/intention/`, {
    method: 'POST',
    headers: { Authorization: `Token ${cfg.secretKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok || typeof data.client_secret !== 'string') {
    console.error('Paymob intention failed', res.status, data);
    throw new PaymobError('The payment page could not be opened. Please try again in a minute.');
  }
  const query = new URLSearchParams({ publicKey: cfg.publicKey, clientSecret: data.client_secret });
  return {
    intentionId: String(data.id ?? ''),
    paymobOrderId: data.intention_order_id != null ? String(data.intention_order_id) : null,
    checkoutUrl: `${cfg.apiBase}/unifiedcheckout/?${query}`,
  };
}

// Fields Paymob concatenates, in this order, to sign a transaction.
const HMAC_FIELDS = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success',
] as const;

function pick(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
}

function stringify(v: unknown): string {
  if (v === undefined || v === null) return '';
  return String(v);
}

/** The flat values Paymob signs, read from a webhook `obj` payload. */
export function hmacValuesFromTransaction(obj: unknown): string[] {
  return HMAC_FIELDS.map((f) => stringify(pick(obj, f)));
}

/** The same values read from the redirection query string, where `order.id` arrives as `order`. */
export function hmacValuesFromQuery(q: URLSearchParams | Record<string, string | undefined>): string[] {
  const get = (k: string) => (q instanceof URLSearchParams ? q.get(k) : q[k]) ?? '';
  return HMAC_FIELDS.map((f) => (f === 'order.id' ? get('order') : get(f)));
}

export function signHmac(values: string[], secret: string): string {
  return crypto.createHmac('sha512', secret).update(values.join('')).digest('hex');
}

export function verifyHmac(values: string[], received: string | null | undefined, secret: string): boolean {
  if (!received || !secret) return false;
  const expected = Buffer.from(signHmac(values, secret), 'hex');
  const got = Buffer.from(received.toLowerCase(), 'hex');
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

/** The transaction fields the store keeps, from either a webhook or a redirect. */
export interface TransactionSummary {
  transactionId: string;
  paymobOrderId: string;
  reference: string;
  amountCents: number;
  currency: string;
  success: boolean;
  pending: boolean;
  isRefunded: boolean;
  isVoided: boolean;
  sourceType: string;
  sourceSubType: string;
  maskedPan: string;
  message: string;
}

const bool = (v: unknown) => v === true || v === 'true';

export function summarizeTransaction(obj: unknown): TransactionSummary {
  return {
    transactionId: stringify(pick(obj, 'id')),
    paymobOrderId: stringify(pick(obj, 'order.id')),
    reference: stringify(pick(obj, 'order.merchant_order_id') ?? pick(obj, 'special_reference')),
    amountCents: Number(pick(obj, 'amount_cents') ?? 0),
    currency: stringify(pick(obj, 'currency')),
    success: bool(pick(obj, 'success')),
    pending: bool(pick(obj, 'pending')),
    isRefunded: bool(pick(obj, 'is_refunded')),
    isVoided: bool(pick(obj, 'is_voided')),
    sourceType: stringify(pick(obj, 'source_data.type')),
    sourceSubType: stringify(pick(obj, 'source_data.sub_type')),
    maskedPan: stringify(pick(obj, 'source_data.pan')),
    message: stringify(pick(obj, 'data.message')),
  };
}

export function summarizeQuery(q: URLSearchParams): TransactionSummary {
  return {
    transactionId: q.get('id') ?? '',
    paymobOrderId: q.get('order') ?? '',
    reference: q.get('merchant_order_id') ?? '',
    amountCents: Number(q.get('amount_cents') ?? 0),
    currency: q.get('currency') ?? '',
    success: q.get('success') === 'true',
    pending: q.get('pending') === 'true',
    isRefunded: q.get('is_refunded') === 'true',
    isVoided: q.get('is_voided') === 'true',
    sourceType: q.get('source_data.type') ?? '',
    sourceSubType: q.get('source_data.sub_type') ?? '',
    maskedPan: q.get('source_data.pan') ?? '',
    message: q.get('data.message') ?? '',
  };
}
