import Image from "next/image";
import { VialArt } from "@/components/VialArt";
import type { Product } from "@/lib/catalog";

/** Real photo when `product.image` is set (file in /public/products), otherwise the rendered vial. */
export function ProductImage({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={`${product.name} vial`}
        width={600}
        height={800}
        priority={priority}
        sizes="(min-width: 768px) 400px, 50vw"
        className={`w-auto object-contain ${className}`}
      />
    );
  }
  return <VialArt product={product} className={className} />;
}
