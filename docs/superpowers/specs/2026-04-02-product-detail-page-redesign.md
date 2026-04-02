# Product Detail Page Redesign

**Date:** 2026-04-02  
**Status:** Approved

## Overview

Redesign the product detail page (`app/(main)/(pages)/products/[slug]/page.tsx`) to match the reference design: a 2×2 image gallery, rich product info panel, description tabs, and a related products carousel.

## Current State

- Single product image (left) + title, price, description, add-to-cart (right)
- No variant selectors, no gallery, no tabs, no related products
- Missing `compareAtPriceRange`, `tags`, `productType`, `descriptionHtml`, `selectedOptions` in the Shopify fragment

---

## Section 1 — Product Hero

### Left: Image Gallery (2×2 grid)
- Render up to 4 images from `product.images.edges` in a 2-column CSS grid
- Each cell is a fixed `aspect-[3/4]` container with a light grey background (`#F3F5F7`)
- If fewer than 4 images exist: only render cells for available images; the grid will naturally collapse (no empty placeholder cells)
- Badges: "NEW" (white, top-left of first image) and discount % (green) — render discount badge only when compare-at price > current price

### Right: Product Info Panel
- **Breadcrumbs:** `Home > Clothing > [productType]` — "Clothing" is hardcoded as a middle segment placeholder; add a `{/* TODO: wire middle segment to collection once collection query is added */}` comment
- **Title:** `product.title`, large bold
- **Short description:** first sentence of `product.description` (plain text, show first 150 chars)
- **Star rating:** static 5-star display + static "23 Reviews" — placeholder until a review system is integrated
- **Price:** current price from `priceRange.minVariantPrice`; show strikethrough compare-at price from `compareAtPriceRange.maxVariantPrice` only when `parseFloat(compareAtPrice.amount) > parseFloat(currentPrice.amount)`
- **Variant selectors (client state):** Color and Size `<select>` dropdowns styled with a chevron; options come from grouping `selectedOptions` on variants: for each variant node, `selectedOptions` is `{ name: string; value: string }[]`. Build a map `{ [optionName: string]: string[] }` of unique values per option name. Selecting a variant: find the variant whose `selectedOptions` match all current selections and use its `id` for add-to-cart. If no variant matches the current selection combination (e.g. "Red / XL" doesn't exist), the active `variantId` state should be set to `null` and the Add to Cart button must be disabled with text "Unavailable"
- **Size guide + stock indicator:** "SIZE GUIDE" link (no-op `href="#"`) + "ONLY 2 LEFT" text — static placeholder; add `{/* TODO: wire to inventory count when admin API is available */}` comment; only show when `firstAvailableVariant.availableForSale === true`
- **Quantity stepper:** client-side `−` / number / `+` control, min 1, max 10
- **Add to Cart:** full-width black button; update `AddToCartButton` with two prop changes: (1) add `quantity: number` prop (default `1`); (2) widen `variantId` from `string` to `string | null` — when `variantId` is `null` the button renders `disabled` with text "Unavailable". `product-info.tsx` passes `null` when no variant matches the current selection. The `cart-provider.tsx` `addItem(variantId, quantity?)` already supports dynamic quantity — no provider changes needed
- **Action links:** Wishlist / Ask question / Share — `<button>` elements, UI only, `onClick` no-ops
- **Delivery info:** static "Delivery: 10 – 12 Oct, 2023" with calendar icon; add `{/* TODO: wire to real delivery estimate */}` comment
- **Shipping info:** static "Shipping: Free for orders above $100" with truck icon
- **Meta info:**
  - SKU: last 8 characters of the currently selected variant's `id` (use active `variantId` state in `product-info.tsx`; fall back to `firstAvailableVariant.id` when `variantId` is `null`). Format: `id.slice(-8).toUpperCase()`. Add `{/* TODO: use variant.sku field once added to fragment */}` comment
  - CATEGORY: `product.productType` (fallback "—" if empty)
  - TAGS: `product.tags.join(', ')` (fallback "—" if empty)

---

## Section 2 — Description Tabs

Below the hero, full-width tabs section:

- Tabs: **Description** | **Additional Info** | **Reviews (23)** | **Questions**
- Active tab: black text + 2px black bottom border; inactive: `#6C7275` grey text
- **Description tab:** renders `product.descriptionHtml` via `dangerouslySetInnerHTML`; wrap in a `<div>` with Tailwind arbitrary-variant syntax for prose styling (project does NOT have `@tailwindcss/typography` — do NOT use `prose-*` class names, they will produce no output without the plugin). Use: `[&_p]:mb-4 [&_h2]:font-bold [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:font-semibold` on the wrapper div
- Other tabs: empty placeholder `<p className="text-[#6C7275]">Coming soon.</p>`
- Client component for tab switching state

---

## Section 3 — Related Products Carousel

- Heading: "You might also like" (left-aligned, bold) + ← → circular icon buttons (right-aligned)
- Server fetch: `getProducts({ first: 8, query: \`NOT id:${product.id.split('/').pop()}\` })` at page level — Shopify's Storefront API query filter expects a plain numeric ID, not the full base64 GID (`gid://shopify/Product/123`), so `.split('/').pop()` extracts the numeric portion; pass result as prop to client carousel component
- Display 4 cards at a time; prev/next arrows shift the visible window by 1 (client-side `startIndex` state, clamped to valid range)
- Cards link to `/products/[handle]`
- Use a local `RelatedProductCard` component (new file in `_components/`) — do NOT modify the shared `ProductCard` component at `components/products/product-card.tsx`, as it is used across the products grid and does not currently support compare-at price. The local card should render: image (aspect-[3/4], bg grey), product title, current price + strikethrough compare-at price (if available)

---

## Data Layer Changes

### Fragment strategy — create `PRODUCT_DETAIL_FRAGMENT` (do NOT extend `PRODUCT_FRAGMENT`)

`PRODUCT_FRAGMENT` is reused inside `CART_LINE_FRAGMENT` → `CART_FRAGMENT`, meaning any fields added to it are fetched on every cart product on every cart request. Fields like `descriptionHtml`, `compareAtPriceRange`, `selectedOptions`, and `tags` are only needed on the PDP and would bloat cart payloads unnecessarily.

**Action:** Create a new `PRODUCT_DETAIL_FRAGMENT` in `lib/shopify/fragments.ts` that extends the base set of fields with PDP-specific ones. Use this fragment only in `getProduct` in `lib/shopify/products.ts`. `PRODUCT_FRAGMENT` remains unchanged.

`PRODUCT_DETAIL_FRAGMENT` should include all existing `ProductFields` fields plus:
```graphql
fragment ProductDetailFields on Product {
  id
  handle
  title
  description
  descriptionHtml
  productType
  tags
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    maxVariantPrice { amount currencyCode }
  }
  images(first: 4) {
    edges {
      node { url altText }
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount }
        selectedOptions { name value }
      }
    }
  }
}
```

Update `getProduct` in `lib/shopify/products.ts` to use `PRODUCT_DETAIL_FRAGMENT` instead of `PRODUCT_FRAGMENT`. Also update the local `ProductResponse` intermediate type in `products.ts` to `{ product: ShopifyProductDetail | null }`. The exported return type of `getProduct` becomes `ShopifyProductDetail | null`.

### `lib/shopify/types.ts` — add `ShopifyProductDetail` type

Add a new exported type (do not modify `ShopifyProduct`):
```ts
export type ShopifyProductDetail = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  compareAtPriceRange: {
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string } }[] }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string }
        selectedOptions: { name: string; value: string }[]
      }
    }[]
  }
}
```

Update `getProduct`'s return type annotation to `ShopifyProductDetail | null`.

---

## Component Structure

```
app/(main)/(pages)/products/[slug]/
  page.tsx                          — server component; fetches product + related products
  _components/
    add-to-cart-button.tsx          — extend: add quantity: number prop (default 1)
    product-image-gallery.tsx       — new; 2×2 grid, handles 1–4 images gracefully
    product-info.tsx                — new client component; holds variant selection + qty state
    product-tabs.tsx                — new client component; tab switching
    related-products.tsx            — new client component; carousel nav state
    related-product-card.tsx        — new; local card with compare-at price support
```

---

## Constraints & Decisions

- Star rating and review count are static placeholders — no review integration in scope
- Stock "Only 2 left" text is static — `inventoryQuantity` requires admin API, not Storefront API
- Delivery / shipping info is static copy with TODO comments
- Wishlist and "Ask question" are UI-only with no backend
- Breadcrumbs use `productType` for the last crumb; middle "Clothing" segment is hardcoded with a TODO comment
- `descriptionHtml` is rendered with `dangerouslySetInnerHTML` — content originates from Shopify (trusted source); prose-like styles applied via Tailwind arbitrary variants
- `@tailwindcss/typography` is NOT installed; do not add it
- Shared `ProductCard` is NOT modified; a local `RelatedProductCard` is created instead to avoid regressions in the products grid
- `cart-provider.tsx` already supports `addItem(variantId, quantity?)` — no provider changes needed
- `PRODUCT_FRAGMENT` is NOT modified to avoid cart payload bloat; a new `PRODUCT_DETAIL_FRAGMENT` and `ShopifyProductDetail` type are introduced for the PDP only
- SKU display uses `variantId.slice(-8).toUpperCase()` — this is a display approximation from the base64 GID, not the actual Shopify SKU field; add a `{/* TODO: use variant.sku once added to fragment */}` comment
