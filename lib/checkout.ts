import type { CartLine } from "@/lib/pricing";

export type Customer = {
  name: string;
  email: string;
  organization: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

export const attestations = [
  { key: "age", label: "I am 21 years of age or older." },
  {
    key: "researchOnly",
    label: "I am purchasing these products solely for in-vitro laboratory research.",
  },
  {
    key: "noHumanUse",
    label: "I will not administer these products to humans or animals, and I understand they are not drugs or supplements.",
  },
  { key: "terms", label: "I have read and agree to the Terms of Sale and Research Use Disclaimer." },
] as const;

export type AttestationKey = (typeof attestations)[number]["key"];

export const paymentMethods = ["venmo", "zelle"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];
export const paymentLabels: Record<PaymentMethod, string> = { venmo: "Venmo", zelle: "Zelle" };

export function isPaymentMethod(v: unknown): v is PaymentMethod {
  return paymentMethods.includes(v as PaymentMethod);
}

export type CheckoutRequest = {
  customer: Customer;
  lines: CartLine[];
  attestations: Record<AttestationKey, boolean>;
  paymentMethod: PaymentMethod;
};

export const US_STATES =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(
    " ",
  );
