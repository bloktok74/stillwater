import { site } from "@/config/site";
import { attestations, isPaymentMethod, US_STATES, type CheckoutRequest, type Customer } from "@/lib/checkout";
import { emailConfigured, sendOrderEmails, type Order } from "@/lib/orderEmail";
import { priceCart } from "@/lib/pricing";

const fail = (error: string, status = 400) => Response.json({ error }, { status });

function str(v: unknown, max = 120) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Partial<CheckoutRequest>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const raw = (body.customer ?? {}) as Partial<Customer>;
  const customer: Customer = {
    name: str(raw.name),
    email: str(raw.email, 254).toLowerCase(),
    organization: str(raw.organization),
    address1: str(raw.address1),
    address2: str(raw.address2),
    city: str(raw.city),
    state: str(raw.state, 2).toUpperCase(),
    zip: str(raw.zip, 10),
  };

  if (!customer.name || !customer.address1 || !customer.city) return fail("Please complete your shipping details.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return fail("Please enter a valid email.");
  if (!US_STATES.includes(customer.state)) return fail("We ship within the United States only.");
  if (!/^\d{5}(-\d{4})?$/.test(customer.zip)) return fail("Please enter a valid ZIP code.");

  const checks = (body.attestations ?? {}) as Record<string, unknown>;
  if (!attestations.every((a) => checks[a.key] === true)) return fail("All research-use attestations are required.");

  // Re-price on the server: never trust client totals.
  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 50) : [];
  const cart = priceCart(lines.filter((l) => typeof l?.variantId === "string"));
  if (cart.lines.length === 0) return fail("Your cart has no purchasable items.");

  const paymentMethod = body.paymentMethod;
  if (!isPaymentMethod(paymentMethod)) return fail("Please choose Venmo or Zelle.");

  // On the live site, refuse orders rather than lose them if setup is incomplete.
  const live = process.env.NODE_ENV === "production";
  if (live && !site.payments[paymentMethod]) return fail("That payment method isn't available right now.");
  if (live && !emailConfigured()) return fail("Online ordering isn't open yet. Please check back soon.", 503);

  const order: Order = {
    id: `${site.orderPrefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
    placedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown",
    customer,
    paymentMethod,
    cart,
  };

  if (emailConfigured()) {
    try {
      await sendOrderEmails(order);
    } catch (err) {
      console.error("[order email failed]", order.id, err);
      return fail("We couldn't place your order. Please try again in a moment.", 502);
    }
  } else {
    console.info("[dev order: email not configured]", order.id, { totalCents: cart.totalCents, paymentMethod });
  }

  return Response.json({ orderId: order.id, totalCents: cart.totalCents, paymentMethod });
}
