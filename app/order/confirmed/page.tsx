import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <div className="container-x max-w-xl py-24 text-center">
      <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-xl text-accent">✓</p>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Order received</h1>
      {id && (
        <p className="mt-3 text-ink-soft">
          Order number <span className="font-mono font-medium text-ink">{id}</span>
        </p>
      )}
      <p className="mx-auto mt-6 rounded-lg border border-dashed border-line p-4 text-sm text-ink-soft">
        Demo mode: payment isn&apos;t connected yet, so nothing was charged and this order won&apos;t ship.
      </p>
      <p className="mt-6 text-sm text-ink-soft">
        Questions? Email{" "}
        <a href={`mailto:${site.supportEmail}`} className="text-accent underline">
          {site.supportEmail}
        </a>
        .
      </p>
      <Link href="/shop" className="btn-outline mt-8">
        Continue browsing
      </Link>
    </div>
  );
}
