import { retailPrices } from "@/config/prices";

export type Category = "Peptides" | "Blends" | "Reagents & supplies";

export type Variant = {
  id: string;
  /** Amount per vial, e.g. "10 mg". Never call this a dose. */
  amount: string;
  priceCents: number | null;
};

export type Product = {
  slug: string;
  name: string;
  aka?: string[];
  category: Category;
  summary: string;
  /** For blends: components and amount per vial. */
  composition?: { name: string; amount: string }[];
  sequence?: string;
  formula?: string;
  molecularWeight?: string;
  form: string;
  storage: string;
  /** Shorter name printed on the rendered vial when the full name is too long. */
  vialName?: string;
  /** Product photo under /public, e.g. "/products/bpc-157.png". Falls back to the rendered vial. */
  image?: string;
  variants: Variant[];
};

type ProductInput = Omit<Product, "variants" | "form" | "storage"> &
  Partial<Pick<Product, "form" | "storage">> & { amounts: string[] };

const LYO = "Lyophilized powder";
const LYO_STORAGE = "Store at −20 °C, protected from light and moisture.";

function variantId(slug: string, amount: string) {
  return `${slug}-${amount.toLowerCase().replace(/\s+/g, "").replace(/\//g, "-")}`;
}

function toCents(dollars: number | null | undefined) {
  return typeof dollars === "number" && dollars > 0 ? Math.round(dollars * 100) : null;
}

// Specs (sequence/formula/MW) are only filled where well established. Verify every
// field against your supplier's certificate of analysis before going live.
const input: ProductInput[] = [
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "Peptides",
    summary: "Modified fragment (residues 177–191) of human growth hormone with an added N-terminal tyrosine.",
    amounts: ["5 mg"],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    aka: ["Body Protection Compound-157"],
    category: "Peptides",
    summary: "Synthetic 15-residue peptide derived from a sequence of a human gastric protein, widely examined in preclinical literature.",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    formula: "C62H98N16O22",
    molecularWeight: "1419.5 g/mol",
    amounts: ["10 mg"],
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (no DAC)",
    aka: ["Modified GRF (1-29)"],
    category: "Peptides",
    summary: "Tetrasubstituted 29-residue analog of growth hormone–releasing hormone, without the drug affinity complex.",
    amounts: ["10 mg"],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 (no DAC) + Ipamorelin",
    vialName: "CJC-1295 + Ipamorelin",
    category: "Blends",
    summary: "Two-component research blend supplied in a single vial.",
    composition: [
      { name: "CJC-1295 (no DAC)", amount: "10 mg" },
      { name: "Ipamorelin", amount: "10 mg" },
    ],
    amounts: ["10 mg / 10 mg"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    aka: ["Copper tripeptide-1"],
    category: "Peptides",
    summary: "Copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine.",
    sequence: "Gly-His-Lys · Cu²⁺",
    amounts: ["50 mg", "100 mg"],
  },
  {
    slug: "glow-blend",
    name: "GLOW Blend",
    category: "Blends",
    summary: "Three-component research blend supplied in a single vial.",
    // TODO: confirm component order/amounts with supplier ("10-50-10 mg").
    composition: [
      { name: "BPC-157", amount: "10 mg" },
      { name: "GHK-Cu", amount: "50 mg" },
      { name: "TB-500", amount: "10 mg" },
    ],
    amounts: ["70 mg"],
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    category: "Peptides",
    summary: "C-terminal decapeptide of kisspeptin, an endogenous ligand of the KISS1 receptor.",
    amounts: ["10 mg"],
  },
  {
    slug: "klow-blend",
    name: "KLOW Blend",
    category: "Blends",
    summary: "Four-component research blend supplied in a single vial.",
    // TODO: confirm component order/amounts with supplier ("10-50-10-10 mg").
    composition: [
      { name: "BPC-157", amount: "10 mg" },
      { name: "GHK-Cu", amount: "50 mg" },
      { name: "TB-500", amount: "10 mg" },
      { name: "KPV", amount: "10 mg" },
    ],
    amounts: ["80 mg"],
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Peptides",
    summary: "C-terminal tripeptide (Lys-Pro-Val) of alpha-melanocyte-stimulating hormone.",
    sequence: "Lys-Pro-Val",
    amounts: ["10 mg"],
  },
  {
    slug: "melanotan-2",
    name: "Melanotan II",
    aka: ["MT-2"],
    category: "Peptides",
    summary: "Synthetic cyclic analog of alpha-melanocyte-stimulating hormone.",
    amounts: ["10 mg"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Peptides",
    summary: "16-residue peptide encoded in the mitochondrial 12S rRNA region.",
    amounts: ["10 mg"],
  },
  {
    slug: "pt-141",
    name: "PT-141",
    aka: ["Bremelanotide"],
    category: "Peptides",
    summary: "Cyclic heptapeptide melanocortin receptor agonist.",
    amounts: ["10 mg"],
  },
  {
    slug: "nad",
    name: "NAD+",
    aka: ["Nicotinamide adenine dinucleotide"],
    category: "Reagents & supplies",
    summary: "Oxidized form of the coenzyme nicotinamide adenine dinucleotide.",
    amounts: ["500 mg", "1000 mg"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "Peptides",
    summary: "Synthetic triple GIP / GLP-1 / glucagon receptor agonist peptide.",
    amounts: ["10 mg", "20 mg", "30 mg", "60 mg"],
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Peptides",
    summary: "Synthetic heptapeptide analog of the endogenous peptide tuftsin.",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    amounts: ["10 mg"],
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Peptides",
    summary: "Synthetic heptapeptide analog of ACTH (4-10).",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    amounts: ["10 mg"],
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    aka: ["GRF (1-29)"],
    category: "Peptides",
    summary: "29-residue N-terminal fragment of growth hormone–releasing hormone.",
    amounts: ["10 mg"],
  },
  {
    slug: "ss-31",
    name: "SS-31",
    aka: ["Elamipretide"],
    category: "Peptides",
    summary: "Mitochondria-targeted aromatic-cationic tetrapeptide.",
    amounts: ["10 mg"],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    aka: ["Thymosin beta-4 fragment"],
    category: "Peptides",
    summary: "Synthetic peptide corresponding to the actin-binding region of thymosin beta-4.",
    amounts: ["10 mg"],
  },
  {
    slug: "tesamorelin-ipamorelin",
    name: "Tesamorelin + Ipamorelin",
    category: "Blends",
    summary: "Two-component research blend supplied in a single vial.",
    composition: [
      { name: "Tesamorelin", amount: "10 mg" },
      { name: "Ipamorelin", amount: "5 mg" },
    ],
    amounts: ["10 mg / 5 mg"],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Peptides",
    summary: "Synthetic 44-residue analog of growth hormone–releasing hormone.",
    amounts: ["10 mg", "20 mg"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "Peptides",
    summary: "Synthetic dual GIP / GLP-1 receptor agonist peptide.",
    amounts: ["10 mg", "30 mg", "60 mg"],
  },
  {
    slug: "wolverine-blend",
    name: "Wolverine Blend",
    category: "Blends",
    summary: "Two-component research blend supplied in a single vial.",
    composition: [
      { name: "BPC-157", amount: "10 mg" },
      { name: "TB-500", amount: "10 mg" },
    ],
    amounts: ["20 mg"],
  },
  {
    slug: "bac-water",
    name: "Bacteriostatic Water",
    category: "Reagents & supplies",
    summary: "Sterile water with 0.9% benzyl alcohol, supplied as a laboratory reagent.",
    form: "Liquid, multi-use vial",
    storage: "Store at 20–25 °C. Discard 28 days after first puncture.",
    amounts: ["10 mL"],
  },
];

export const products: Product[] = input.map(({ amounts, ...p }) => ({
  ...p,
  form: p.form ?? LYO,
  storage: p.storage ?? LYO_STORAGE,
  variants: amounts.map((amount) => {
    const id = variantId(p.slug, amount);
    return { id, amount, priceCents: toCents(retailPrices[id]) };
  }),
}));

export const categories: Category[] = ["Peptides", "Blends", "Reagents & supplies"];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

const variantIndex = new Map(
  products.flatMap((product) => product.variants.map((variant) => [variant.id, { product, variant }] as const)),
);

export function findVariant(id: string) {
  return variantIndex.get(id);
}

export function lowestPrice(p: Product) {
  const prices = p.variants.map((v) => v.priceCents).filter((c): c is number => c !== null);
  return prices.length ? Math.min(...prices) : null;
}
