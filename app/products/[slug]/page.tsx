import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { RuoNotice } from "@/components/RuoNotice";
import { ProductImage } from "@/components/ProductImage";
import { site } from "@/config/site";
import { getProduct, products } from "@/lib/catalog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: `${product.summary} For laboratory research use only.` } : {};
}

export default async function ProductPage({ params }: Params) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const specs: [string, string | undefined][] = [
    ["Sequence", product.sequence],
    ["Molecular formula", product.formula],
    ["Molecular weight", product.molecularWeight],
    ["Form", product.form],
    ["Purity", "See batch certificate of analysis"],
    ["Storage", product.storage],
  ];

  return (
    <div className="container-x py-10">
      <nav className="text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-accent">
          Shop
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_40%,#ffffff,#e9eef2)] p-10">
          <ProductImage product={product} className="h-96" priority />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{product.category}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
          {product.aka && <p className="mt-1 text-sm text-ink-soft">Also known as {product.aka.join(", ")}</p>}
          <p className="mt-4 leading-relaxed text-ink-soft">{product.summary}</p>

          <div className="mt-6">
            <AddToCart variants={product.variants} />
          </div>

          <RuoNotice className="mt-8" />
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">Specifications</h2>
          <dl className="mt-4 divide-y divide-line rounded-xl border border-line">
            {specs
              .filter((s): s is [string, string] => Boolean(s[1]))
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="col-span-2 break-words font-mono">{v}</dd>
                </div>
              ))}
          </dl>
        </section>

        <div className="space-y-10">
          {product.composition && (
            <section>
              <h2 className="text-lg font-semibold">Composition per vial</h2>
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {product.composition.map((c) => (
                  <li key={c.name} className="flex justify-between px-4 py-3 text-sm">
                    <span>{c.name}</span>
                    <span className="font-mono">{c.amount}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold">Certificate of analysis</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Each lot is independently tested by HPLC and mass spectrometry. Email{" "}
              <a href={`mailto:${site.supportEmail}?subject=COA request: ${product.name}`} className="text-accent underline">
                {site.supportEmail}
              </a>{" "}
              with the lot number on your vial to receive its COA.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
