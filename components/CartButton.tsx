"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="relative flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 hover:border-ink-soft">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </svg>
      <span>Cart</span>
      {ready && count > 0 && (
        <span className="ml-0.5 rounded-full bg-accent px-1.5 text-xs font-semibold text-white">{count}</span>
      )}
    </Link>
  );
}
