"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { RuoNotice } from "@/components/RuoNotice";
import { site } from "@/config/site";
import { attestations, paymentLabels, paymentMethods, US_STATES, type AttestationKey, type Customer, type PaymentMethod } from "@/lib/checkout";
import { formatCents, priceCart } from "@/lib/pricing";

const emptyCustomer: Customer = { name: "", email: "", organization: "", address1: "", address2: "", city: "", state: "", zip: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const cart = priceCart(lines);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [checks, setChecks] = useState<Record<AttestationKey, boolean>>({ age: false, researchOnly: false, noHumanUse: false, terms: false });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("venmo");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="container-x py-16" />;
  if (cart.lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <Link href="/shop" className="btn mt-6">
          Browse compounds
        </Link>
      </div>
    );
  }

  const allChecked = Object.values(checks).every(Boolean);
  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, lines, attestations: checks, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
      clear();
      const q = new URLSearchParams({ id: data.orderId, total: String(data.totalCents), method: data.paymentMethod });
      router.push(`/order/confirmed?${q}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-lg font-semibold">Contact & shipping</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={customer.name} onChange={set("name")} required autoComplete="name" />
              <Field label="Email" type="email" value={customer.email} onChange={set("email")} required autoComplete="email" />
              <Field label="Organization / lab (optional)" value={customer.organization} onChange={set("organization")} className="sm:col-span-2" autoComplete="organization" />
              <Field label="Address" value={customer.address1} onChange={set("address1")} required className="sm:col-span-2" autoComplete="address-line1" />
              <Field label="Apt, suite (optional)" value={customer.address2} onChange={set("address2")} className="sm:col-span-2" autoComplete="address-line2" />
              <Field label="City" value={customer.city} onChange={set("city")} required autoComplete="address-level2" />
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="font-medium">State</span>
                  <select className="field mt-1" value={customer.state} onChange={set("state")} required autoComplete="address-level1">
                    <option value="">–</option>
                    {US_STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <Field label="ZIP" value={customer.zip} onChange={set("zip")} required inputMode="numeric" pattern="\d{5}(-\d{4})?" autoComplete="postal-code" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Research use attestation</h2>
            <p className="mt-1 text-sm text-ink-soft">All four are required to place an order.</p>
            <div className="mt-4 space-y-3 rounded-xl border border-line p-4">
              {attestations.map((a) => (
                <label key={a.key} className="flex gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                    checked={checks[a.key]}
                    onChange={(e) => setChecks((c) => ({ ...c, [a.key]: e.target.checked }))}
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-ink-soft">
              After you place your order, we&apos;ll show you where to send payment and email you the details. Orders ship
              once payment is received, and unpaid orders are cancelled after {site.paymentWindowHours} hours.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <label
                  key={m}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${
                    paymentMethod === m ? "border-accent bg-accent-tint text-accent-strong" : "border-line hover:border-ink-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="h-4 w-4 accent-accent"
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  {paymentLabels[m]}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-6 rounded-xl border border-line bg-surface p-6">
          <ul className="space-y-2 text-sm">
            {cart.lines.map((l) => (
              <li key={l.variant.id} className="flex justify-between gap-4">
                <span>
                  {l.product.name} <span className="text-ink-soft">({l.variant.amount}) × {l.qty}</span>
                </span>
                <span>{formatCents(l.lineCents)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{cart.shippingCents === 0 ? "Free" : formatCents(cart.shippingCents)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCents(cart.totalCents)}</dd>
            </div>
          </dl>
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button className="btn w-full" disabled={!allChecked || submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
          <RuoNotice />
        </aside>
      </form>
    </div>
  );
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      <input className="field mt-1" {...props} />
    </label>
  );
}
