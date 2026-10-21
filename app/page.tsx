import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { site } from "@/config/site";
import { getProduct, products } from "@/lib/catalog";

const featured = ["bpc-157", "tb-500", "ghk-cu", "wolverine-blend"].map((s) => getProduct(s)!).filter(Boolean);

const pillars = [
  { title: "HPLC & mass spec", body: "Every batch is tested for purity and identity by an independent laboratory before release." },
  { title: "Batch-level COAs", body: "Certificates of analysis are matched to the lot number printed on each vial." },
  { title: "Lyophilized & sealed", body: "Freeze-dried for stability and sealed under inert conditions." },
  { title: "Ships from the U.S.", body: "Discreet, protective packaging with tracking on every order." },
];

const faqs = [
  {
    q: "Do you provide dosing or usage information?",
    a: "No. Our products are for in-vitro laboratory research only, and we do not provide dosing, administration or medical guidance of any kind.",
  },
  {
    q: "Who can buy from you?",
    a: `Researchers aged ${site.minAge} or older who are purchasing for lawful laboratory research. We may ask for verification before shipping.`,
  },
  { q: "Where do you ship?", a: `We currently ship within the ${site.shipsTo} only.` },
  { q: "Can I see a certificate of analysis?", a: `Yes. Email ${site.supportEmail} with the product and lot number and we'll send its COA.` },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Research peptides</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Purity you can verify, batch by batch.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              {site.name} supplies lyophilized peptides to laboratories, with third-party analysis and a certificate of
              analysis for every lot.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn">
                Browse {products.length} compounds
              </Link>
              <Link href="#quality" className="btn-outline">
                Our testing
              </Link>
            </div>
          </div>
          <div className="flex justify-center gap-4" aria-hidden="true">
            <ProductImage product={featured[0]} className="h-40 -rotate-6 sm:h-56" priority />
            <ProductImage product={featured[1]} className="h-52 sm:h-72" priority />
            <ProductImage product={featured[2]} className="h-40 rotate-6 sm:h-56" priority />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popular compounds</h2>
          <Link href="/shop" className="text-sm font-semibold text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section id="quality" className="scroll-mt-20 border-y border-line bg-ink text-white">
        <div className="container-x py-16">
          <h2 className="text-2xl font-semibold tracking-tight">How we verify every batch</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <div key={p.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="font-mono text-sm text-[#5fc6cf]">0{i + 1}</p>
                <h3 className="mt-2 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 md:grid-cols-3">
        <h2 className="text-2xl font-semibold tracking-tight">Common questions</h2>
        <dl className="space-y-6 md:col-span-2">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-line pb-6">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
