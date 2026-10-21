import { site } from "@/config/site";

// DRAFT policy text. Have an attorney licensed in your state review every document
// before launch. Bracketed [PLACEHOLDERS] must be filled in.
export type LegalDoc = { title: string; sections: { heading: string; body: string[] }[] };

const UPDATED = "[EFFECTIVE DATE]";

export const legalDocs: Record<string, LegalDoc> = {
  "research-use": {
    title: "Research Use Disclaimer",
    sections: [
      {
        heading: "Products are for in-vitro research only",
        body: [
          `Every product sold by ${site.name} is intended solely for in-vitro laboratory research and analytical use by qualified professionals. "In-vitro" means outside a living organism, such as in test tubes or cell cultures.`,
          "Our products are not drugs, foods, dietary supplements, cosmetics or medical devices. They have not been evaluated or approved by the U.S. Food and Drug Administration and are not intended to diagnose, treat, cure, mitigate or prevent any disease.",
        ],
      },
      {
        heading: "Not for human or veterinary use",
        body: [
          "Products must not be administered to humans or animals by any route, including injection, ingestion, inhalation or topical application.",
          "We do not provide, and our staff will not discuss, dosing, reconstitution for administration, protocols or any personal-use information. Requests of this kind will be declined, and any associated order cancelled and refunded.",
        ],
      },
      {
        heading: "Buyer responsibility",
        body: [
          `By purchasing, you represent that you are at least ${site.minAge} years old, that you are acquiring products for lawful research, and that you have the training and facilities to handle research chemicals safely.`,
          "You are responsible for complying with all federal, state and local laws applicable to your purchase, possession and use of these products.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Sale",
    sections: [
      {
        heading: "Eligibility",
        body: [
          `You must be at least ${site.minAge} years old to buy from ${site.name}. We currently ship only within the ${site.shipsTo}.`,
          "We may request verification of identity, age or research affiliation before shipping any order.",
        ],
      },
      {
        heading: "Research use restriction",
        body: [
          "All sales are subject to our Research Use Disclaimer, which forms part of these terms. Misrepresenting your intended use is a material breach of these terms.",
        ],
      },
      {
        heading: "Orders and pricing",
        body: [
          "Placing an order is an offer to buy. We may accept, decline or cancel any order at our discretion, including after payment, in which case we will issue a full refund.",
          "Prices are in U.S. dollars and may change without notice. Price or product errors may be corrected even after an order has been placed.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          `To the fullest extent permitted by law, ${site.name}'s total liability for any claim relating to a product is limited to the amount paid for that product. We are not liable for any damages arising from misuse of a product or from use contrary to these terms.`,
        ],
      },
      {
        heading: "Indemnification",
        body: [
          `You agree to indemnify and hold harmless ${site.name}, its owners and its staff from any claims, losses or expenses arising from your handling, use or misuse of products, or from your breach of these terms.`,
        ],
      },
      {
        heading: "Governing law",
        body: ["These terms are governed by the laws of the State of [STATE], without regard to its conflict-of-law rules."],
      },
      { heading: "Effective date", body: [`These terms are effective as of ${UPDATED}.`] },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      {
        heading: "Where we ship",
        body: [`We ship to addresses within the ${site.shipsTo} only. We do not ship to P.O. boxes for orders requiring a signature.`],
      },
      {
        heading: "Processing and delivery",
        body: [
          // TODO: confirm the time zone for the 6 PM cutoff.
          "Orders placed before 6 PM ET on a business day ship the same day. Delivery typically takes 1–3 business days. Orders placed after the cutoff, or on weekends and holidays, ship the next business day.",
          `Standard shipping is a flat $${(site.flatShippingCents / 100).toFixed(2)}. Orders over $${(site.freeShippingThresholdCents / 100).toFixed(0)} ship free.`,
        ],
      },
      {
        heading: "Packaging",
        body: ["Lyophilized products are stable at ambient temperature in transit and are shipped in protective packaging. Store them as directed on arrival."],
      },
      {
        heading: "Lost or damaged parcels",
        body: [`Contact ${site.supportEmail} within 7 days of the expected delivery date if a parcel is lost or arrives damaged.`],
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    sections: [
      {
        heading: "Returns",
        body: ["Because product integrity can't be verified once a product leaves our control, we don't accept returns of products that have been opened or whose seal is broken."],
      },
      {
        heading: "Damaged or incorrect items",
        body: [
          `If an item arrives damaged or isn't what you ordered, email ${site.supportEmail} within 7 days of delivery with your order number and photos. We will replace the item or refund it.`,
        ],
      },
      {
        heading: "Refunds",
        body: ["Approved refunds are issued to the original payment method within [X] business days."],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you order, we collect your name, email, shipping address, organization (if provided) and order details. Payments are handled by our payment processor; we do not store full card numbers.",
          "Your browser stores your cart and your research-use confirmation locally. We do not use this local storage to track you across other sites.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your information to process and ship orders, verify eligibility, provide support and meet legal obligations. We do not sell your personal information.",
        ],
      },
      {
        heading: "Retention and your rights",
        body: [
          `We keep order records for [X] years for tax and compliance purposes. To request access to or deletion of your data, contact ${site.supportEmail}.`,
        ],
      },
      { heading: "Effective date", body: [`This policy is effective as of ${UPDATED}.`] },
    ],
  },
};
