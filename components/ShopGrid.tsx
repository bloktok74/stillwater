"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, type Category } from "@/lib/catalog";

export function ShopGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || [p.name, ...(p.aka ?? [])].some((n) => n.toLowerCase().includes(q))),
    );
  }, [query, category]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === c ? "border-ink bg-ink text-white" : "border-line hover:border-ink-soft"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search compounds"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field sm:w-64"
          aria-label="Search compounds"
        />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {shown.length === 0 && <p className="mt-10 text-center text-ink-soft">No compounds match “{query}”.</p>}
    </>
  );
}
