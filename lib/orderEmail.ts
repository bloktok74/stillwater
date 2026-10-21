import { site } from "@/config/site";
import { attestations, paymentLabels, type Customer, type PaymentMethod } from "@/lib/checkout";
import { formatCents, type priceCart } from "@/lib/pricing";

// Orders are delivered by email through Resend (https://resend.com).
// Required env vars: RESEND_API_KEY, ORDER_FROM_EMAIL (a sender on your verified domain),
// ORDER_NOTIFY_EMAIL (where new orders go).

export type Order = {
  id: string;
  placedAt: string;
  ip: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
  cart: ReturnType<typeof priceCart>;
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_FROM_EMAIL && process.env.ORDER_NOTIFY_EMAIL);
}

async function send(to: string, subject: string, text: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.ORDER_FROM_EMAIL, to: [to], subject, text, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function itemLines(order: Order) {
  const { cart } = order;
  return [
    ...cart.lines.map((l) => `  ${l.qty} × ${l.product.name} (${l.variant.amount}) — ${formatCents(l.lineCents)}`),
    `  Shipping — ${cart.shippingCents === 0 ? "Free" : formatCents(cart.shippingCents)}`,
    `  TOTAL — ${formatCents(cart.totalCents)}`,
  ].join("\n");
}

function address(c: Customer) {
  return [c.name, c.organization, c.address1, c.address2, `${c.city}, ${c.state} ${c.zip}`].filter(Boolean).join("\n");
}

export function paymentInstruction(method: PaymentMethod, totalCents: number, orderId: string) {
  const handle = site.payments[method] ?? `[set ${method} in config/site.ts]`;
  return `Send ${formatCents(totalCents)} by ${paymentLabels[method]} to ${handle} and put your order number ${orderId} in the payment note.`;
}

export async function sendOrderEmails(order: Order) {
  const owner = process.env.ORDER_NOTIFY_EMAIL!;

  await send(
    owner,
    `New order ${order.id} — ${formatCents(order.cart.totalCents)} via ${paymentLabels[order.paymentMethod]}`,
    [
      `Order ${order.id}`,
      `Placed ${order.placedAt} from IP ${order.ip}`,
      `Payment: ${paymentLabels[order.paymentMethod]} (awaiting payment, check the note for ${order.id})`,
      "",
      "Items:",
      itemLines(order),
      "",
      "Ship to:",
      address(order.customer),
      `Email: ${order.customer.email}`,
      "",
      "Customer attested to:",
      ...attestations.map((a) => `  [x] ${a.label}`),
    ].join("\n"),
    order.customer.email,
  );

  await send(
    order.customer.email,
    `${site.name} order ${order.id}: payment instructions`,
    [
      `Thanks for your order, ${order.customer.name}.`,
      "",
      paymentInstruction(order.paymentMethod, order.cart.totalCents, order.id),
      `Orders not paid within ${site.paymentWindowHours} hours are cancelled. We ship once payment is received.`,
      "",
      "Your order:",
      itemLines(order),
      "",
      "Shipping to:",
      address(order.customer),
      "",
      "All products are sold for laboratory research use only. Not for human or veterinary use.",
      `Questions? Reply to this email or contact ${site.supportEmail}.`,
    ].join("\n"),
    site.supportEmail,
  );
}
