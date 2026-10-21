import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { lowestPrice, type Product } from "@/lib/catalog";
import { formatCents } from "@/lib/pricing";

export function ProductCard({ product }: { product: Product }) {
  const from = lowestPrice(product);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex h-52 items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#ffffff,#e9eef2)]">
        <ProductImage product={product} className="h-44 transition group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{product.category}</p>
        <h3 className="mt-1 font-semibold">{product.name}</h3>
        <p className="mt-1 font-mono text-xs text-ink-soft">{product.variants.map((v) => v.amount).join(" · ")}</p>
        <p className="mt-auto pt-3 text-sm font-semibold">
          {from === null ? (
            <span className="font-normal text-ink-soft">Price coming soon</span>
          ) : product.variants.length > 1 ? (
            `From ${formatCents(from)}`
          ) : (
            formatCents(from)
          )}
        </p>
      </div>
    </Link>
  );
}
