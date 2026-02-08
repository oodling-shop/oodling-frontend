export const CATEGORIES = [
  "Home & Decor",
  "Clothing",
  "Accessories",
  "Outdoor",
] as const;

export type Category = (typeof CATEGORIES)[number];
