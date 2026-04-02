# Product Detail Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the PDP to show a 2×2 image gallery, rich variant-aware product info panel, description tabs, and a related products carousel.

**Architecture:** Data layer changes are isolated to new types/fragment/function so the cart flow is unaffected. The page server component fetches product + related products and passes them down to focused client components (ProductInfo, ProductTabs, RelatedProducts) that each own a single slice of UI state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, lucide-react (icons), pnpm

**Spec:** `docs/superpowers/specs/2026-04-02-product-detail-page-redesign.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `lib/shopify/types.ts` | Add `ShopifyProductDetail` type |
| Modify | `lib/shopify/fragments.ts` | Add `PRODUCT_DETAIL_FRAGMENT` |
| Modify | `lib/shopify/products.ts` | Switch `getProduct` to new fragment + type |
| Modify | `app/(main)/(pages)/products/[slug]/_components/add-to-cart-button.tsx` | Accept `variantId: string \| null` and `quantity: number` |
| Create | `app/(main)/(pages)/products/[slug]/_components/product-image-gallery.tsx` | 2×2 image grid with badges |
| Create | `app/(main)/(pages)/products/[slug]/_components/related-product-card.tsx` | Card with compare-at price |
| Create | `app/(main)/(pages)/products/[slug]/_components/product-tabs.tsx` | Description/Info/Reviews/Questions tabs |
| Create | `app/(main)/(pages)/products/[slug]/_components/related-products.tsx` | Carousel with prev/next nav |
| Create | `app/(main)/(pages)/products/[slug]/_components/product-info.tsx` | Variant selectors, qty stepper, all right-panel state |
| Modify | `app/(main)/(pages)/products/[slug]/page.tsx` | Server component wiring all sections |

---

## Task 1: Add `ShopifyProductDetail` type

**Files:**
- Modify: `lib/shopify/types.ts`

- [ ] **Step 1: Add the type**

Open `lib/shopify/types.ts` and append after the closing `}` of `ShopifyProduct` (after line 20):

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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: zero errors related to `ShopifyProductDetail`.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/types.ts
git commit -m "feat: add ShopifyProductDetail type for PDP"
```

---

## Task 2: Add `PRODUCT_DETAIL_FRAGMENT` and update `getProduct`

**Files:**
- Modify: `lib/shopify/fragments.ts`
- Modify: `lib/shopify/products.ts`

- [ ] **Step 1: Add fragment to `fragments.ts`**

Append at the end of `lib/shopify/fragments.ts`:

```ts
export const PRODUCT_DETAIL_FRAGMENT = `
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
`
```

- [ ] **Step 2: Update `getProduct` in `products.ts`**

In `lib/shopify/products.ts`:

1. Add import at the top: `import { PRODUCT_FRAGMENT, PRODUCT_DETAIL_FRAGMENT } from './fragments'`  
   (replace the existing `import { PRODUCT_FRAGMENT }` line)

2. Add `ShopifyProductDetail` to the types import:  
   `import type { ShopifyProduct, ShopifyProductDetail } from './types'`

3. Replace the local `ProductResponse` type (currently `{ product: ShopifyProduct | null }`) with:

```ts
type ProductDetailResponse = {
  product: ShopifyProductDetail | null
}
```

4. Delete the existing `ProductResponse` type (currently lines 20-22 of `products.ts`):

```ts
// DELETE these lines:
type ProductResponse = {
  product: ShopifyProduct | null
}
```

5. Rewrite the `getProduct` function to use the new fragment and type:

```ts
export async function getProduct(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<ProductDetailResponse>({
    query: `
      ${PRODUCT_DETAIL_FRAGMENT}
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductDetailFields
        }
      }
    `,
    variables: { handle },
    cache: 'no-store',
  })
  return data.product
}
```

Note: the existing `getProducts` function and its `ProductsResponse` type are unchanged.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: zero errors. If `page.tsx` now throws type errors (it references `product.description` etc.), that is expected — it will be fixed in Task 9.

- [ ] **Step 4: Commit**

```bash
git add lib/shopify/fragments.ts lib/shopify/products.ts
git commit -m "feat: add PRODUCT_DETAIL_FRAGMENT and update getProduct"
```

---

## Task 3: Update `AddToCartButton`

**Files:**
- Modify: `app/(main)/(pages)/products/[slug]/_components/add-to-cart-button.tsx`

Current file accepts `variantId: string` and calls `addItem(variantId, 1)`.

- [ ] **Step 1: Rewrite the component**

Replace the entire file content with:

```tsx
'use client';

import { useTransition } from 'react';
import { useCart } from '@/providers/cart-provider';

interface AddToCartButtonProps {
  variantId: string | null;
  quantity?: number;
}

export function AddToCartButton({ variantId, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const isUnavailable = variantId === null;

  const handleAddToCart = () => {
    if (!variantId) return;
    startTransition(async () => {
      await addItem(variantId, quantity);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || isUnavailable}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : isUnavailable ? 'Unavailable' : 'Add to Cart'}
    </button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: zero errors in `add-to-cart-button.tsx`.

- [ ] **Step 3: Commit**

```bash
git add app/"(main)/(pages)/products/[slug]/_components/add-to-cart-button.tsx"
git commit -m "feat: update AddToCartButton to support null variantId and quantity prop"
```

---

## Task 4: Create `ProductImageGallery`

**Files:**
- Create: `app/(main)/(pages)/products/[slug]/_components/product-image-gallery.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Image from 'next/image';

interface ImageNode {
  url: string;
  altText: string;
}

interface ProductImageGalleryProps {
  images: ImageNode[];
  title: string;
  compareAtAmount?: string;
  currentAmount?: string;
}

export function ProductImageGallery({
  images,
  title,
  compareAtAmount,
  currentAmount,
}: ProductImageGalleryProps) {
  const showDiscount =
    compareAtAmount &&
    currentAmount &&
    parseFloat(compareAtAmount) > parseFloat(currentAmount);

  const discountPct = showDiscount
    ? Math.round(
        ((parseFloat(compareAtAmount!) - parseFloat(currentAmount!)) /
          parseFloat(compareAtAmount!)) *
          100
      )
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden rounded-sm"
        >
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={index === 0}
          />
          {index === 0 && (
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-white text-[#141718] text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
              {showDiscount && (
                <span className="bg-[#38CB89] text-white text-xs font-semibold px-2 py-1 rounded">
                  -{discountPct}%
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: zero errors in this file.

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/_components/product-image-gallery.tsx"
git commit -m "feat: add ProductImageGallery component with 2x2 grid and badges"
```

---

## Task 5: Create `RelatedProductCard`

**Files:**
- Create: `app/(main)/(pages)/products/[slug]/_components/related-product-card.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductCardProps {
  handle: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string };
}

export function RelatedProductCard({
  handle,
  title,
  imageUrl,
  imageAlt,
  price,
  compareAtPrice,
}: RelatedProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const showCompareAt =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const formattedCompareAt =
    showCompareAt && compareAtPrice
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: compareAtPrice.currencyCode,
        }).format(parseFloat(compareAtPrice.amount))
      : null;

  return (
    <Link href={`/products/${handle}`} className="group flex flex-col gap-3">
      <div className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[#141718]">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#141718]">{formattedPrice}</span>
          {formattedCompareAt && (
            <span className="text-sm text-[#6C7275] line-through">{formattedCompareAt}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/_components/related-product-card.tsx"
git commit -m "feat: add RelatedProductCard with compare-at price support"
```

---

## Task 6: Create `ProductTabs`

**Files:**
- Create: `app/(main)/(pages)/products/[slug]/_components/product-tabs.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useState } from 'react';

interface ProductTabsProps {
  descriptionHtml: string;
}

const TABS = ['Description', 'Additional Info', 'Reviews (23)', 'Questions'] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ descriptionHtml }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Description');

  return (
    <div className="border-t border-[#E8ECEF]">
      {/* Tab headers */}
      <div className="flex gap-8 border-b border-[#E8ECEF]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'py-4 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab
                ? 'text-[#141718] border-b-2 border-[#141718] -mb-px'
                : 'text-[#6C7275]',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {activeTab === 'Description' ? (
          <div
            className="text-[#6C7275] leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-[#141718] [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#141718]"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        ) : (
          <p className="text-[#6C7275]">Coming soon.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/_components/product-tabs.tsx"
git commit -m "feat: add ProductTabs component with description HTML rendering"
```

---

## Task 7: Create `RelatedProducts`

**Files:**
- Create: `app/(main)/(pages)/products/[slug]/_components/related-products.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RelatedProductCard } from './related-product-card';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface RelatedProductsProps {
  products: ShopifyProduct[];
}

const PAGE_SIZE = 4;

export function RelatedProducts({ products }: RelatedProductsProps) {
  const [startIndex, setStartIndex] = useState(0);

  if (products.length === 0) return null;

  const visible = products.slice(startIndex, startIndex + PAGE_SIZE);
  const canPrev = startIndex > 0;
  const canNext = startIndex + PAGE_SIZE < products.length;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#141718]">You might also like</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="w-10 h-10 rounded-full border border-[#E8ECEF] flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] disabled:opacity-30 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setStartIndex((i) => Math.min(products.length - PAGE_SIZE, i + 1))}
            disabled={!canNext}
            className="w-10 h-10 rounded-full border border-[#E8ECEF] flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] disabled:opacity-30 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visible.map((product) => (
          <RelatedProductCard
            key={product.id}
            handle={product.handle}
            title={product.title}
            imageUrl={product.images.edges[0]?.node.url}
            imageAlt={product.images.edges[0]?.node.altText}
            price={product.priceRange.minVariantPrice}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/_components/related-products.tsx"
git commit -m "feat: add RelatedProducts carousel component"
```

---

## Task 8: Create `ProductInfo`

**Files:**
- Create: `app/(main)/(pages)/products/[slug]/_components/product-info.tsx`

This is the main client component. It holds: selected variant state, quantity state, and renders all right-panel UI.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Heart, HelpCircle, Share2, Calendar, Truck } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import type { ShopifyProductDetail } from '@/lib/shopify/types';

interface ProductInfoProps {
  product: ShopifyProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const variants = useMemo(
    () => product.variants.edges.map((e) => e.node),
    [product.variants.edges]
  );
  const firstAvailable = useMemo(
    () => variants.find((v) => v.availableForSale) ?? variants[0],
    [variants]
  );

  // Build option map: { Color: ['Red', 'Blue'], Size: ['S', 'M', 'L'] }
  const optionMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const variant of variants) {
      for (const opt of variant.selectedOptions) {
        if (!map[opt.name]) map[opt.name] = [];
        if (!map[opt.name].includes(opt.value)) map[opt.name].push(opt.value);
      }
    }
    return map;
  }, [variants]);

  // Initial selection: first available variant's options
  const initialSelection = useMemo(() => {
    const sel: Record<string, string> = {};
    for (const opt of firstAvailable?.selectedOptions ?? []) {
      sel[opt.name] = opt.value;
    }
    return sel;
  }, [firstAvailable]);

  const [selection, setSelection] = useState<Record<string, string>>(initialSelection);
  const [quantity, setQuantity] = useState(1);

  // Find the variant matching all current selections
  const activeVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selection[opt.name] === opt.value)
    ) ?? null;
  }, [variants, selection]);

  const variantId = activeVariant?.id ?? null;

  // Prices
  const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtAmount = parseFloat(product.compareAtPriceRange.maxVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const showCompareAt = compareAtAmount > currentPrice;

  // SKU display
  const skuSource = variantId ?? firstAvailable?.id ?? '';
  const sku = skuSource.slice(-8).toUpperCase(); // TODO: use variant.sku once added to fragment

  // Short description
  const shortDesc = product.description.slice(0, 150);

  const hasOptions = Object.keys(optionMap).length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#6C7275]">
        <span>Home</span>
        <span>›</span>
        {/* TODO: wire middle segment to collection once collection query is added */}
        <span>Clothing</span>
        <span>›</span>
        <span className="text-[#141718]">{product.productType || product.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-[#141718] leading-tight">{product.title}</h1>

      {/* Short description */}
      {shortDesc && (
        <p className="text-sm text-[#6C7275] leading-relaxed">{shortDesc}</p>
      )}

      {/* Star rating — static placeholder */}
      <div className="flex items-center gap-2">
        <div className="flex text-[#FF8A00]">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-[#6C7275]">23 Reviews</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#141718]">{fmt(currentPrice)}</span>
        {showCompareAt && (
          <span className="text-lg text-[#6C7275] line-through">{fmt(compareAtAmount)}</span>
        )}
      </div>

      {/* Variant selectors */}
      {hasOptions &&
        Object.entries(optionMap).map(([optionName, values]) => (
          <div key={optionName} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#141718]">{optionName}</label>
            <div className="relative">
              <select
                value={selection[optionName] ?? ''}
                onChange={(e) =>
                  setSelection((prev) => ({ ...prev, [optionName]: e.target.value }))
                }
                className="w-full h-11 px-4 pr-10 border border-[#E8ECEF] rounded text-sm text-[#141718] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#141718]"
              >
                {values.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#141718]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        ))}

      {/* Size guide + stock indicator */}
      {firstAvailable?.availableForSale && (
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="flex items-center gap-1 text-[#141718] font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="10" rx="1" />
              <line x1="7" y1="7" x2="7" y2="17" />
              <line x1="12" y1="7" x2="12" y2="12" />
              <line x1="17" y1="7" x2="17" y2="17" />
            </svg>
            SIZE GUIDE
          </a>
          {/* TODO: wire to inventory count when admin API is available */}
          <span className="flex items-center gap-1 text-[#141718]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            ONLY 2 LEFT
          </span>
        </div>
      )}

      {/* Quantity stepper */}
      <div className="flex items-center border border-[#E8ECEF] rounded w-fit">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-11 h-11 flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-12 text-center text-sm font-medium text-[#141718]">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          className="w-11 h-11 flex items-center justify-center text-[#141718] hover:bg-[#F3F5F7] transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <AddToCartButton variantId={variantId} quantity={quantity} />

      {/* Action links */}
      <div className="flex items-center gap-6 text-sm text-[#141718]">
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Heart size={16} /> Wishlist
        </button>
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <HelpCircle size={16} /> Ask question
        </button>
        <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Share2 size={16} /> Share
        </button>
      </div>

      <hr className="border-[#E8ECEF]" />

      {/* Delivery + Shipping */}
      <div className="flex flex-col gap-3 text-sm">
        {/* TODO: wire to real delivery estimate */}
        <div className="flex items-center gap-3 text-[#141718]">
          <Calendar size={16} className="shrink-0" />
          <span><strong>Delivery:</strong> 10 – 12 Oct, 2023</span>
        </div>
        <div className="flex items-center gap-3 text-[#141718]">
          <Truck size={16} className="shrink-0" />
          <span><strong>Shipping:</strong> Free for orders above $100</span>
        </div>
      </div>

      <hr className="border-[#E8ECEF]" />

      {/* Meta info */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">SKU</dt>
        <dd className="text-[#141718]">{sku}</dd>
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">CATEGORY</dt>
        <dd className="text-[#141718]">{product.productType || '—'}</dd>
        <dt className="text-[#6C7275] uppercase tracking-wide text-xs">TAGS</dt>
        <dd className="text-[#141718]">{product.tags.length > 0 ? product.tags.join(', ') : '—'}</dd>
      </dl>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: zero errors in `product-info.tsx`.

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/_components/product-info.tsx"
git commit -m "feat: add ProductInfo client component with variant selection and qty stepper"
```

---

## Task 9: Rewrite `page.tsx` to wire all sections

**Files:**
- Modify: `app/(main)/(pages)/products/[slug]/page.tsx`

- [ ] **Step 1: Rewrite the page**

Replace the entire file content with:

```tsx
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { ProductImageGallery } from './_components/product-image-gallery';
import { ProductInfo } from './_components/product-info';
import { ProductTabs } from './_components/product-tabs';
import { RelatedProducts } from './_components/related-products';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const numericId = product.id.split('/').pop();
  const relatedProductsData = await getProducts({
    first: 8,
    query: `NOT id:${numericId}`,
  });
  const relatedProducts = relatedProductsData.edges.map((e) => e.node);

  const images = product.images.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image gallery */}
          <ProductImageGallery
            images={images}
            title={product.title}
            compareAtAmount={product.compareAtPriceRange.maxVariantPrice.amount}
            currentAmount={product.priceRange.minVariantPrice.amount}
          />

          {/* Right: Product info */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Tabs section */}
      <div className="max-w-6xl mx-auto px-4">
        <ProductTabs descriptionHtml={product.descriptionHtml} />
      </div>

      {/* Related products */}
      <div className="max-w-6xl mx-auto px-4">
        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles with zero errors**

```bash
pnpm tsc --noEmit
```

Expected: zero errors across all modified/created files.

- [ ] **Step 3: Run a production build to catch Next.js-specific issues**

```bash
pnpm build
```

Expected: build completes without errors. If there are RSC/client boundary errors, check that all `'use client'` components are correctly marked.

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/page.tsx"
git commit -m "feat: wire product detail page with gallery, tabs, and related products"
```

---

## Final Verification

- [ ] Run `pnpm dev` and navigate to a product page (e.g. `/products/<any-handle>`)
- [ ] Confirm the 2×2 image grid renders (or fewer cells if product has < 4 images)
- [ ] Confirm NEW and discount badges appear on the first image when compare-at > current price
- [ ] Confirm breadcrumbs show `Home > Clothing > [productType]`
- [ ] Confirm Color/Size dropdowns appear when the product has variants with those options
- [ ] Confirm selecting a non-existent variant combination disables the button and shows "Unavailable"
- [ ] Confirm Add to Cart adds the correct variant + quantity to the cart
- [ ] Confirm description tab renders `descriptionHtml` with prose styling
- [ ] Confirm Other tabs show "Coming soon."
- [ ] Confirm related products carousel shows 4 items and prev/next arrows work
- [ ] Confirm clicking a related product card navigates to that product's PDP
