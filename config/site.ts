// Brand + store settings. Change the name here and it updates everywhere.
export const site = {
  name: "Stillwater Peptides",
  shortName: "Stillwater",
  nameSuffix: "Peptides",
  orderPrefix: "SW",
  domain: "stillwaterpeptides.com",
  tagline: "Analytically verified peptides for laboratory research",
  // TODO: set up this mailbox (or change it) before launch.
  supportEmail: "support@stillwaterpeptides.com",
  minAge: 21,
  shipsTo: "United States",
  flatShippingCents: 1500,
  freeShippingThresholdCents: 20000,
  maxQtyPerLine: 20,
  // Shown to customers after they place an order. null = method not offered on the live site.
  payments: {
    venmo: null as string | null, // Venmo Business handle, e.g. "@your-handle"
    zelle: null as string | null, // email or phone registered with Zelle
  },
  paymentWindowHours: 48,
};
