import 'server-only';
import { Resend } from 'resend';
import { formatEGP } from './pricing';
import { site } from './site';
import { shippingMethods, type ShippingMethod } from './catalog';

function client() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const from = () => process.env.EMAIL_FROM || `${site.storeName} <onboarding@resend.dev>`;

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

interface EmailOrder {
  _id: unknown;
  number: string;
  accessToken: string;
  customer?: { firstName?: string | null; email?: string | null } | null;
  lines: { name?: string | null; mode: string; quantity?: number | null; startDate?: string | null; endDate?: string | null; lineTotal?: number | null }[];
  shipping?: { method?: string | null } | null;
  subtotal?: number | null;
  shippingFee?: number | null;
  total?: number | null;
  deposit?: number | null;
}

/** Sends the order confirmation. Returns false when email is not configured. */
export async function sendOrderEmails(order: EmailOrder): Promise<boolean> {
  const resend = client();
  if (!resend || !order.customer?.email) return false;
  const link = `${process.env.APP_URL}/orders/${order._id}?t=${order.accessToken}`;
  const rows = order.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0">${esc(l.name)} × ${l.quantity}${
          l.mode === 'rent' ? `<br><span style="color:#999">Rental ${esc(l.startDate)} to ${esc(l.endDate)}</span>` : ''
        }</td><td style="padding:6px 0;text-align:right">${formatEGP(l.lineTotal ?? 0)}</td></tr>`,
    )
    .join('');
  const method = shippingMethods[order.shipping?.method as ShippingMethod]?.label ?? '';
  const html = `<div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#fff;padding:32px">
  <h1 style="font-size:22px;margin:0 0 8px">Thanks, ${esc(order.customer.firstName)}. Your order is confirmed.</h1>
  <p style="color:#B3B3B3;margin:0 0 24px">Order ${esc(order.number)}. ${esc(method)}.</p>
  <table style="width:100%;border-collapse:collapse;color:#fff">${rows}
  <tr><td style="padding:6px 0;border-top:1px solid #333">Delivery</td><td style="padding:6px 0;border-top:1px solid #333;text-align:right">${formatEGP(order.shippingFee ?? 0)}</td></tr>
  <tr><td style="padding:6px 0;font-weight:bold">Total paid</td><td style="padding:6px 0;text-align:right;font-weight:bold">${formatEGP(order.total ?? 0)}</td></tr></table>
  ${order.deposit ? `<p style="color:#B3B3B3">A refundable security deposit of ${formatEGP(order.deposit)} is due at handover, with a valid national ID or passport.</p>` : ''}
  <p><a href="${link}" style="color:#57B4E5">View your order</a></p>
  <p style="color:#999;font-size:12px">${esc(site.legalName)} · ${esc(site.phone)} · ${esc(site.email)}</p></div>`;

  await resend.emails.send({ from: from(), to: order.customer.email, subject: `Order ${order.number} confirmed`, html });
  const notify = process.env.STORE_NOTIFY_EMAIL;
  if (notify) {
    await resend.emails.send({ from: from(), to: notify, subject: `New paid order ${order.number}`, html });
  }
  return true;
}

export async function sendContactEmail(msg: { name: string; email: string; phone?: string; topic?: string; message: string }) {
  const resend = client();
  const to = process.env.STORE_NOTIFY_EMAIL;
  if (!resend || !to) return false;
  await resend.emails.send({
    from: from(),
    to,
    replyTo: msg.email,
    subject: `Store contact: ${msg.topic || 'General'} from ${msg.name}`,
    html: `<p><b>${esc(msg.name)}</b> (${esc(msg.email)}${msg.phone ? `, ${esc(msg.phone)}` : ''})</p><p>${esc(msg.message).replace(/\n/g, '<br>')}</p>`,
  });
  return true;
}
