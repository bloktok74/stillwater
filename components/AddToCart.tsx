"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Variant } from "@/lib/catalog";
import { formatCents } from "@/lib/pricing";

export function AddToCart({ variants }: { variants: Variant[] }) {
  const { add } = useCart();
  const [selectedId, setSelectedId] = useState((variants.find((v) => v.priceCents !== null) ?? variants[0]).id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const selected = variants.find((v) => v.id === selectedId)!;
  const priced = selected.priceCents !== null;

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold">Amount per vial</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setSelectedId(v.id);
                setAdded(false);
              }}
              aria-pressed={v.id === selectedId}
              className={`rounded-md border px-4 py-2 font-mono text-sm transition ${
                v.id === selectedId ? "border-accent bg-accent-tint text-accent-strong" : "border-line hover:border-ink-soft"
              }`}
            >
              {v.amount}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="mt-5 text-2xl font-semibold">
        {priced ? formatCents(selected.priceCents!) : <span className="text-base font-normal text-ink-soft">Price coming soon</span>}
      </p>

      <div className="mt-4 flex gap-3">
        <label className="sr-only" htmlFor="qty">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={20}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          className="field w-20 text-center"
          disabled={!priced}
        />
        <button
          className="btn flex-1"
          disabled={!priced}
          onClick={() => {
            add(selected.id, qty);
            setAdded(true);
          }}
        >
          Add to cart
        </button>
      </div>
      {added && (
        <p className="mt-3 text-sm text-accent-strong" role="status">
          Added to cart.{" "}
          <Link href="/cart" className="font-semibold underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
