import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { isPaymentMethod, paymentLabels } from "@/lib/checkout";
import { formatCents } from "@/lib/pricing";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

type Search = { id?: string; total?: string; method?: string };

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { id, total, method } = await searchParams;
  const orderId = id && /^[A-Z]{2}-[A-Z0-9-]{4,30}$/.test(id) ? id : null;
  const totalCents = Number(total);
  const valid = orderId && Number.isInteger(totalCents) && totalCents > 0 && isPaymentMethod(method);
  const handle = valid ? site.payments[method] : null;

  return (
    <div className="container-x max-w-xl py-20 text-center">
      <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-xl text-accent">✓</p>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Order received</h1>
      {orderId && (
        <p className="mt-3 text-ink-soft">
          Order number <span className="font-mono font-medium text-ink">{orderId}</span>
        </p>
      )}

      {valid && (
        <div className="mt-8 rounded-xl border border-line bg-surface p-6 text-left">
          <h2 className="font-semibold">Complete your payment</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Amount</dt>
              <dd className="font-semibold">{formatCents(totalCents)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Send by {paymentLabels[method]} to</dt>
              <dd className="break-all text-right font-mono font-semibold">{handle ?? `[set payments.${method} in config/site.ts]`}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Payment note</dt>
              <dd className="font-mono font-semibold">{orderId}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-ink-soft">
            Include your order number in the payment note so we can match it. Orders ship once payment is received. Unpaid
            orders are cancelled after {site.paymentWindowHours} hours. We&apos;ve also emailed you these instructions.
          </p>
        </div>
      )}

      <p className="mt-8 text-sm text-ink-soft">
        Questions? Email{" "}
        <a href={`mailto:${site.supportEmail}`} className="text-accent underline">
          {site.supportEmail}
        </a>
        .
      </p>
      <Link href="/shop" className="btn-outline mt-6">
        Continue browsing
      </Link>
    </div>
  );
}
