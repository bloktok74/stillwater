"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { site } from "@/config/site";
import { formatCents, priceCart } from "@/lib/pricing";

export default function CartPage() {
  const { lines, ready, setQty, remove } = useCart();
  const cart = priceCart(lines);

  if (!ready) return <div className="container-x py-16" />;

  if (cart.lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/shop" className="btn mt-6">
          Browse compounds
        </Link>
      </div>
    );
  }

  const toFree = site.freeShippingThresholdCents - cart.subtotalCents;

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <ul className="divide-y divide-line rounded-xl border border-line lg:col-span-2">
          {cart.lines.map((l) => (
            <li key={l.variant.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/products/${l.product.slug}`} className="font-semibold hover:text-accent">
                  {l.product.name}
                </Link>
                <p className="font-mono text-sm text-ink-soft">
                  {l.variant.amount} · {formatCents(l.variant.priceCents)}
                </p>
              </div>
              <input
                type="number"
                min={1}
                max={site.maxQtyPerLine}
                value={l.qty}
                onChange={(e) => setQty(l.variant.id, Number(e.target.value) || 1)}
                className="field w-20 text-center"
                aria-label={`Quantity of ${l.product.name}`}
              />
              <p className="w-24 text-right font-semibold">{formatCents(l.lineCents)}</p>
              <button onClick={() => remove(l.variant.id)} className="text-sm text-ink-soft underline hover:text-ink">
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-line bg-surface p-6">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCents(cart.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{cart.shippingCents === 0 ? "Free" : formatCents(cart.shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCents(cart.totalCents)}</dd>
            </div>
          </dl>
          {toFree > 0 && <p className="mt-3 text-xs text-ink-soft">Add {formatCents(toFree)} more for free shipping.</p>}
          <Link href="/checkout" className="btn mt-6 w-full">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
