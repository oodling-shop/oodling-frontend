const DEFAULT_SHOPIFY_DOMAIN = 'oodling.myshopify.com';

export const SHOPIFY_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN?.trim() || DEFAULT_SHOPIFY_DOMAIN;
