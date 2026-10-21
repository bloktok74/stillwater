"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findVariant } from "@/lib/catalog";
import { clampQty, type CartLine } from "@/lib/pricing";

const KEY = "sw-cart-v1";

type CartContext = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (variantId: string, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) {
        setLines(
          saved
            .filter((l) => typeof l?.variantId === "string" && findVariant(l.variantId))
            .map((l) => ({ variantId: l.variantId, qty: clampQty(l.qty) }))
            .filter((l) => l.qty > 0),
        );
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const setQty = useCallback((variantId: string, qty: number) => {
    const n = clampQty(qty);
    setLines((prev) =>
      n === 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, qty: n } : l)),
    );
  }, []);

  const add = useCallback((variantId: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      if (existing) return prev.map((l) => (l === existing ? { ...l, qty: clampQty(l.qty + qty) } : l));
      return [...prev, { variantId, qty: clampQty(qty) }];
    });
  }, []);

  const remove = useCallback((variantId: string) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, ready, count: lines.reduce((n, l) => n + l.qty, 0), add, setQty, remove, clear }),
    [lines, ready, add, setQty, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
