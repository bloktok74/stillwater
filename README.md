# Stillwater Peptides storefront

Next.js 16 + Tailwind v4 store for research-use-only (RUO) peptides.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + type check
```

## Where things live

| What | File |
| --- | --- |
| Brand name, support email, shipping rates, min age | `config/site.ts` |
| **Retail prices** (one entry per vial size) | `config/prices.ts` |
| Products, amounts, specs, blend compositions | `lib/catalog.ts` |
| Policy text (terms, RUO disclaimer, privacy, shipping, returns) | `lib/legal.ts` |
| Checkout attestations | `lib/checkout.ts` |
| Checkout API (validation, server-side re-pricing) | `app/api/checkout/route.ts` |

Prices start as `null`. A variant with no price shows "Price coming soon" and can't be added to the cart.
Everything in `config/prices.ts` is sent to the browser, so never put supplier costs there.

## Before launch

- [x] Domain reserved: stillwaterpeptides.com.
- [ ] Run a USPTO trademark search for "Stillwater" in Classes 1 and 5 (lab chemicals and pharmaceuticals).
- [ ] Create the support@stillwaterpeptides.com mailbox (set in `config/site.ts`).
- [ ] Fill in `config/prices.ts`.
- [ ] Check every spec and blend composition in `lib/catalog.ts` against your supplier's COAs (the GLOW/KLOW blends are marked TODO).
- [ ] Make the home page's quality claims true (independent HPLC/MS testing, lot-matched COAs) or edit them. Unbacked claims are an FTC problem.
- [ ] Have an attorney review `lib/legal.ts` and fill in the `[PLACEHOLDERS]`.
- [ ] Set your Venmo and Zelle handles in `config/site.ts` (`payments`). A method left `null` is refused on the live site.
- [ ] Set up order emails: create a Resend account, verify the domain, and set the variables from `.env.example` in your host. Until these are set, the live site refuses orders instead of losing them.
- [ ] Use a Venmo Business profile and a business bank account for Zelle, and review both providers' terms for this product category.
- [ ] Replace the placeholder vial art with real product photos.

## Compliance rules the site follows (keep it this way)

- No dosing, protocols, reconstitution-for-use, or health/benefit claims anywhere, including support replies and social posts.
- Sizes are labeled "Amount per vial", never "dosage".
- The 21+ / researcher gate is shown on first visit, and all four checkout attestations are required (enforced on the server too).
- High-risk listings are included at the owner's request: tirzepatide and retatrutide (FDA/DOJ enforcement against RUO sellers; Eli Lilly litigation), Melanotan II and PT-141 (FDA warnings), and bacteriostatic water (regulators cite it as evidence of intended human use). Get legal sign-off on these specifically.
