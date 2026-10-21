import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hmacValuesFromQuery, hmacValuesFromTransaction, signHmac, summarizeTransaction, verifyHmac } from '../src/lib/paymob';

const obj = {
  id: 192036465,
  pending: false,
  amount_cents: 945000,
  success: true,
  is_auth: false,
  is_capture: false,
  is_standalone_payment: true,
  is_voided: false,
  is_refunded: false,
  is_3d_secure: true,
  integration_id: 4097558,
  has_parent_transaction: false,
  order: { id: 217503754, merchant_order_id: '6532f0b7c2a1b0e4d5f6a7b8' },
  created_at: '2024-06-13T11:33:44.592345',
  currency: 'EGP',
  source_data: { pan: '2346', type: 'card', sub_type: 'MasterCard' },
  error_occured: false,
  owner: 302852,
};

test('webhook values follow Paymob field order', () => {
  assert.equal(
    hmacValuesFromTransaction(obj).join(''),
    '9450002024-06-13T11:33:44.592345EGPfalsefalse1920364654097558truefalsefalsefalsetruefalse217503754302852false2346MasterCardcardtrue',
  );
});

test('webhook and redirect produce the same signature', () => {
  const secret = 'test-secret';
  const sig = signHmac(hmacValuesFromTransaction(obj), secret);
  const q = new URLSearchParams({
    amount_cents: '945000', created_at: obj.created_at, currency: 'EGP', error_occured: 'false',
    has_parent_transaction: 'false', id: '192036465', integration_id: '4097558', is_3d_secure: 'true',
    is_auth: 'false', is_capture: 'false', is_refunded: 'false', is_standalone_payment: 'true',
    is_voided: 'false', order: '217503754', owner: '302852', pending: 'false',
    'source_data.pan': '2346', 'source_data.sub_type': 'MasterCard', 'source_data.type': 'card', success: 'true',
  });
  assert.ok(verifyHmac(hmacValuesFromQuery(q), sig, secret));
  q.set('amount_cents', '100');
  assert.ok(!verifyHmac(hmacValuesFromQuery(q), sig, secret));
  assert.ok(!verifyHmac(hmacValuesFromTransaction(obj), sig, 'other-secret'));
  assert.ok(!verifyHmac(hmacValuesFromTransaction(obj), 'zz', secret));
});

test('summary reads the merchant reference', () => {
  const s = summarizeTransaction(obj);
  assert.equal(s.reference, '6532f0b7c2a1b0e4d5f6a7b8');
  assert.equal(s.amountCents, 945000);
  assert.equal(s.success, true);
});
