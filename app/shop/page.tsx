import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-semibold tracking-tight">All compounds</h1>
      <p className="mt-2 text-ink-soft">Lyophilized research peptides, blends and laboratory reagents.</p>
      <ShopGrid />
    </div>
  );
}
