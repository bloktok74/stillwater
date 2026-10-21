import { site } from "@/config/site";
import { findVariant, type Product, type Variant } from "@/lib/catalog";

export type CartLine = { variantId: string; qty: number };

export type PricedLine = {
  product: Product;
  variant: Variant & { priceCents: number };
  qty: number;
  lineCents: number;
};

export function clampQty(qty: unknown) {
  const n = Math.floor(Number(qty));
  return Number.isFinite(n) ? Math.max(0, Math.min(site.maxQtyPerLine, n)) : 0;
}

/** Shared by the cart UI and the checkout API so the server never trusts client totals. */
export function priceCart(lines: CartLine[]) {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const hit = findVariant(line.variantId);
    const qty = clampQty(line.qty);
    if (!hit || hit.variant.priceCents === null || qty === 0) continue;
    const variant = { ...hit.variant, priceCents: hit.variant.priceCents };
    priced.push({ product: hit.product, variant, qty, lineCents: variant.priceCents * qty });
  }
  const subtotalCents = priced.reduce((sum, l) => sum + l.lineCents, 0);
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= site.freeShippingThresholdCents ? 0 : site.flatShippingCents;
  return { lines: priced, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
