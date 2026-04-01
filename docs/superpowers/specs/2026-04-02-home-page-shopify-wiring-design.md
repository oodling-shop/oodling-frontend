# Home Page Shopify Wiring — Design Spec

**Date:** 2026-04-02  
**Status:** Approved

## Overview

Wire the home page sections to pull real data from Shopify instead of hardcoded mock data. Uses server-side data fetching at the page level (Option A), passing data as props to each section component.

## Sections to Wire

| Section | Currently | After |
|---|---|---|
| ProductGrid (Best Sellers / New Arrivals / Sale tabs) | Mock constants | Shopify products |
| NewArrivals carousel | Mock constants | Shopify products (newest first) |
| Collections (Kopla, Lola, Folka) | Hardcoded local images | Shopify collections by handle |
| Categories (Pink Panther, etc.) | Hardcoded local images | Shopify collections by handle |

## New API Layer

**File:** `lib/shopify/collections.ts`

Add `getCollectionByHandle(handle: string)` — fetches a single Shopify collection's `title`, `handle`, and `image { url, altText }` via the Storefront API.

Add `ShopifyCollection` type to `lib/shopify/types.ts`.

## Data Fetching — `app/(main)/page.tsx`

Convert `Home` to an `async` server component. Fetch all data in parallel via `Promise.all`:

```ts
const [bestSellers, newArrivals, saleProducts, ...collections] = await Promise.all([
  getProducts({ first: 8, sortKey: 'BEST_SELLING' }),
  getProducts({ first: 8, sortKey: 'CREATED_AT', reverse: true }),
  getProducts({ first: 8, query: 'tag:sale' }),
  getCollectionByHandle('kopla'),
  getCollectionByHandle('lola'),
  getCollectionByHandle('folka'),
  getCollectionByHandle('pink-panther'),
  getCollectionByHandle('gold-crest'),
  getCollectionByHandle('hot-lips'),
  getCollectionByHandle('brown-sugar'),
  getCollectionByHandle('red-velvet'),
])
```

Pass results as props to the relevant components.

## Component Changes

### `ProductGrid`
- Accept props: `bestSellers`, `newArrivals`, `sale` (each `ShopifyProduct[]`)
- Keep `useState` for tab switching (client component)
- Render product cards from Shopify data: use `product.title`, `product.priceRange.minVariantPrice.amount`, `product.images.edges[0].node.url`
- Remove import of mock `PRODUCTS` constant
- Link product cards to `/products/{product.handle}`

### `NewArrivals`
- Accept prop: `products: ShopifyProduct[]`
- Render from Shopify data instead of mock `NEW_ARRIVALS`
- Keep existing carousel/scroll behaviour unchanged
- Remove import of mock `NEW_ARRIVALS` constant

### `Collections`
- Accept prop: `collections: ShopifyCollection[]`
- Render title, image (from Shopify), and link to `/shop/{handle}` dynamically
- Remove hardcoded Kopla/Lola/Folka JSX

### `Categories`
- Accept prop: `categories: ShopifyCollection[]`
- Render title, image (from Shopify), and link to `/categories/{handle}` dynamically
- Remove hardcoded `CATEGORIES` array

## Graceful Degradation

If a collection handle doesn't exist in Shopify (returns `null`), filter it out before passing to components. Components should handle empty arrays without crashing.

## Out of Scope

- FeaturedProduct section (remains hardcoded)
- Hero section (remains hardcoded)
- Newsletter / Features sections
- Pagination on ProductGrid tabs
- Creating collection/category pages in Shopify (links already exist)
