# Home Page Shopify Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded mock data on the home page (ProductGrid, NewArrivals, Collections, Categories) with real data fetched from the Shopify Storefront API.

**Architecture:** Convert `app/(main)/page.tsx` to an async server component that fetches all data in parallel via `Promise.all`, then passes unwrapped arrays as props down to each section component. Each section component keeps its `'use client'` directive and existing UI — only the data source changes.

**Tech Stack:** Next.js App Router, Shopify Storefront API (GraphQL), TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/shopify/client.ts` | Modify | Add `next` field to `ShopifyFetchOptions`, remove `cache` default |
| `lib/shopify/types.ts` | Modify | Add `ShopifyCollection` type |
| `lib/shopify/fragments.ts` | Modify | Add `COLLECTION_FRAGMENT` |
| `lib/shopify/collections.ts` | Create | Export `getCollectionByHandle(handle)` |
| `app/(main)/page.tsx` | Modify | Async server component — fetch all data, pass as props |
| `components/home/product-grid.tsx` | Modify | Accept `bestSellers`, `newArrivals`, `sale` props |
| `components/home/new-arrivals.tsx` | Modify | Accept `products` prop |
| `components/home/collections.tsx` | Modify | Accept `collections` prop |
| `components/home/categories.tsx` | Modify | Accept `categories` prop |

---

## Task 1: Extend `shopifyFetch` to support `next` revalidation

**Files:**
- Modify: `lib/shopify/client.ts`

**Why:** `getCollectionByHandle` will use `next: { revalidate: 3600 }` for hourly caching. Next.js runtime will silently ignore revalidation if `cache: 'no-store'` is also passed — they conflict. The fix is: add `next` to `ShopifyFetchOptions`, remove the `cache = 'no-store'` default, and conditionally spread `cache` in the `fetch()` call so it is only sent when explicitly provided.

`NextFetchRequestConfig` is a globally injected interface in Next.js projects (via `next/types/global.d.ts`) — do NOT import it, just reference it directly.

- [ ] **Step 1: Read the current file**

  Open `lib/shopify/client.ts` and confirm the `ShopifyFetchOptions` type (lines 3–8) and the `fetch()` call (around line 50–55).

- [ ] **Step 2: Apply changes to `lib/shopify/client.ts`**

  Replace the full file with:

  ```ts
  const SHOPIFY_API_VERSION = '2025-10'

  type ShopifyFetchOptions = {
    query: string
    variables?: Record<string, unknown>
    cache?: RequestCache
    next?: NextFetchRequestConfig
    token?: string
  }

  export class ShopifyError extends Error {
    constructor(
      message: string,
      public type: 'network' | 'graphql' | 'user',
      public userErrors?: { field: string[] | null; message: string }[]
    ) {
      super(message)
      this.name = 'ShopifyError'
    }
  }

  export async function shopifyFetch<T>({
    query,
    variables,
    cache,
    next,
    token,
  }: ShopifyFetchOptions): Promise<T> {
    const domain = process.env.SHOPIFY_STORE_DOMAIN
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !accessToken) {
      throw new ShopifyError(
        'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN',
        'network'
      )
    }

    const url = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    }

    if (token) {
      headers['X-Shopify-Customer-Access-Token'] = token
    }

    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        ...(cache ? { cache } : {}),
        next,
      })
    } catch (err) {
      throw new ShopifyError(`Network request failed: ${err}`, 'network')
    }

    if (!res.ok) {
      throw new ShopifyError(`HTTP ${res.status}: ${res.statusText}`, 'network')
    }

    const json = await res.json()

    if (json.errors?.length) {
      throw new ShopifyError(json.errors[0].message, 'graphql')
    }

    return json.data as T
  }
  ```

- [ ] **Step 3: Add `cache: 'no-store'` to all calls in `lib/shopify/cart.ts` and `lib/shopify/customer.ts`**

  These files have multiple `shopifyFetch` calls that omit `cache`. After removing the default, they would fall back to the browser/Node HTTP cache — wrong for cart state and customer sessions. Add `cache: 'no-store'` to every `shopifyFetch` call in both files that doesn't already have it.

  ```bash
  # Confirm which calls are missing cache:
  grep -n "shopifyFetch" lib/shopify/cart.ts lib/shopify/customer.ts
  ```

  For each call found, add `cache: 'no-store'` to its options object.

- [ ] **Step 4: Type-check**

  ```bash
  cd "d:/Projects/Freelance/oodling/oodling-fe" && pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add lib/shopify/client.ts
  git commit -m "feat: add next revalidation support to shopifyFetch"
  ```

---

## Task 2: Add `ShopifyCollection` type and collection fragment

**Files:**
- Modify: `lib/shopify/types.ts`
- Modify: `lib/shopify/fragments.ts`

- [ ] **Step 1: Add `ShopifyCollection` to types**

  In `lib/shopify/types.ts`, append:

  ```ts
  export type ShopifyCollection = {
    handle: string
    title: string
    image: { url: string; altText: string } | null
  }
  ```

- [ ] **Step 2: Add `COLLECTION_FRAGMENT` to fragments**

  In `lib/shopify/fragments.ts`, append:

  ```ts
  export const COLLECTION_FRAGMENT = `
    fragment CollectionFields on Collection {
      handle
      title
      image {
        url
        altText
      }
    }
  `
  ```

- [ ] **Step 3: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add lib/shopify/types.ts lib/shopify/fragments.ts
  git commit -m "feat: add ShopifyCollection type and collection fragment"
  ```

---

## Task 3: Create `getCollectionByHandle`

**Files:**
- Create: `lib/shopify/collections.ts`

**Note:** Do NOT pass `cache` here — passing `next: { revalidate: 3600 }` without `cache` lets Next.js handle caching via ISR. The `cache` field is conditionally spread in `shopifyFetch` (from Task 1), so omitting it is safe.

- [ ] **Step 1: Create `lib/shopify/collections.ts`**

  ```ts
  import { shopifyFetch } from './client'
  import { COLLECTION_FRAGMENT } from './fragments'
  import type { ShopifyCollection } from './types'

  type CollectionResponse = {
    collection: ShopifyCollection | null
  }

  export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
    const data = await shopifyFetch<CollectionResponse>({
      query: `
        ${COLLECTION_FRAGMENT}
        query GetCollection($handle: String!) {
          collection(handle: $handle) {
            ...CollectionFields
          }
        }
      `,
      variables: { handle },
      next: { revalidate: 3600 },
    })
    return data.collection
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add lib/shopify/collections.ts
  git commit -m "feat: add getCollectionByHandle with hourly revalidation"
  ```

---

## Task 4: Update `ProductGrid` to accept Shopify props

**Files:**
- Modify: `components/home/product-grid.tsx`

The component currently imports `PRODUCTS` from `@/constants` and renders that same array for all tabs. After this task, it accepts three pre-fetched arrays and switches between them based on the active tab.

- [ ] **Step 1: Read the current file**

  Open `components/home/product-grid.tsx` and confirm the current `PRODUCTS` import (line 9) and the grid render (line 101).

- [ ] **Step 2: Replace mock data with Shopify props**

  Replace the entire file content:

  ```tsx
  'use client';

  import React, { useState } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { Container } from '../container';
  import { cn } from '@/helpers/cn';
  import { Star } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import type { ShopifyProduct } from '@/lib/shopify/types';

  const TABS = ['Best Sellers', 'New Arrivals', 'Sale'] as const;

  type Tab = typeof TABS[number];

  type Props = {
    bestSellers: ShopifyProduct[]
    newArrivals: ShopifyProduct[]
    sale: ShopifyProduct[]
  }

  const ProductCard = ({ product }: { product: ShopifyProduct }) => {
    const image = product.images.edges[0]?.node
    const price = parseFloat(product.priceRange.minVariantPrice.amount)
    const currency = product.priceRange.minVariantPrice.currencyCode

    return (
      <Link href={`/products/${product.handle}`} className="group flex flex-col gap-3">
        <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-[12px] overflow-hidden flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3">
            {image && (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={cn(
                  "transition-colors duration-300",
                  i < 5 ? "fill-[#141718] text-[#141718]" : "text-neutral-300"
                )}
              />
            ))}
          </div>
          <h3 className="text-base font-semibold text-[#141718] leading-tight">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#141718]">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  export const ProductGrid = ({ bestSellers, newArrivals, sale }: Props) => {
    const [activeTab, setActiveTab] = useState<Tab>('Best Sellers');

    const tabProducts: Record<Tab, ShopifyProduct[]> = {
      'Best Sellers': bestSellers,
      'New Arrivals': newArrivals,
      'Sale': sale,
    }

    const products = tabProducts[activeTab]

    return (
      <section className="py-12 md:py-24 bg-white">
        <Container>
          <div className="flex justify-center mb-10 md:mb-16">
            <div className="flex items-center gap-8 md:gap-12 overflow-x-auto scrollbar-none py-2">
              {TABS.map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative pb-2 text-lg md:text-xl transition-colors duration-300 whitespace-nowrap h-auto px-0 hover:bg-transparent rounded-none",
                    activeTab === tab
                      ? "text-[#141718] font-semibold"
                      : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141718]" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 mb-12 md:mb-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-400 py-16">No products found.</p>
          )}

          <div className="flex justify-center">
            <Button className="bg-[#141718] text-white px-10 py-3.5 rounded-full font-semibold text-base transition-transform duration-300 hover:scale-105 active:scale-95 h-auto">
              Load More
            </Button>
          </div>
        </Container>
      </section>
    );
  };

  export default ProductGrid;
  ```

- [ ] **Step 3: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add components/home/product-grid.tsx
  git commit -m "feat: wire ProductGrid to accept Shopify product props"
  ```

---

## Task 5: Update `NewArrivals` to accept Shopify props

**Files:**
- Modify: `components/home/new-arrivals.tsx`

- [ ] **Step 1: Read the current file**

  Open `components/home/new-arrivals.tsx` and note the `NEW_ARRIVALS` import (line 6) and image rendering (lines 77–83).

- [ ] **Step 2: Replace mock data with Shopify props**

  - Remove `import { NEW_ARRIVALS as PRODUCTS } from '@/constants'`
  - Add `import type { ShopifyProduct } from '@/lib/shopify/types'`
  - Change the component signature to accept `products: ShopifyProduct[]`
  - In the render, replace `{PRODUCTS.map((product) => (` with `{products.map((product) => (`
  - Replace the `<Image>` block inside the carousel item with:

  ```tsx
  {product.images.edges[0]?.node && (
    <Image
      src={product.images.edges[0].node.url}
      alt={product.images.edges[0].node.altText || product.title}
      fill
      className="object-contain"
      priority
    />
  )}
  ```

  - Replace the pill button text `{product.name}` with `{product.title}`
  - `key={product.id}` stays the same — `id` is a string in `ShopifyProduct`

- [ ] **Step 3: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add components/home/new-arrivals.tsx
  git commit -m "feat: wire NewArrivals carousel to accept Shopify product props"
  ```

---

## Task 6: Update `Collections` to accept Shopify props

**Files:**
- Modify: `components/home/collections.tsx`

The current component has three hardcoded sections (Kopla left, Lola + Folka right). After this task it renders `collections[0]` in the large left column and `collections[1]`/`collections[2]` stacked in the right column — same asymmetric layout, driven by array index.

Two visual details from the right-column cards must be preserved:
- Text is constrained to `max-w-[50%]` so it doesn't overlap the image
- Images use `object-contain object-right` to anchor to the right side

These are handled via `textClassName` and `imageObjectClass` props on `CollectionCard`.

- [ ] **Step 1: Read the current file**

  Open `components/home/collections.tsx` and confirm the layout structure (left column lines 16–37, right column lines 39–86).

- [ ] **Step 2: Replace hardcoded sections with dynamic rendering**

  Replace the entire file content:

  ```tsx
  'use client';

  import React from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { ArrowRight } from 'lucide-react';
  import { Container } from '../container';
  import { cn } from '@/lib/utils';
  import type { ShopifyCollection } from '@/lib/shopify/types';

  type Props = {
    collections: ShopifyCollection[]
  }

  const CollectionCard = ({
    collection,
    className,
    textClassName,
    imageClassName,
    imageObjectClass = 'object-contain',
  }: {
    collection: ShopifyCollection
    className?: string
    textClassName?: string
    imageClassName?: string
    imageObjectClass?: string
  }) => (
    <div className={cn('relative bg-[#F3F5F7] p-8 md:p-12 flex flex-col justify-start overflow-hidden group', className)}>
      <div className={cn('relative z-10', textClassName)}>
        <h3 className="text-3xl md:text-[34px] font-medium text-neutral-900 mb-1">{collection.title}</h3>
        <Link
          href={`/shop/${collection.handle}`}
          className="inline-flex items-center gap-1 text-sm md:text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity group/link"
        >
          Shop Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
      {collection.image && (
        <div className={cn('absolute inset-0 flex items-center justify-center p-8 pt-20 md:pt-24', imageClassName)}>
          <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className={imageObjectClass}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )

  export const Collections = ({ collections }: Props) => {
    if (collections.length === 0) return null

    const [left, ...right] = collections

    return (
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left: first collection — large */}
            <CollectionCard
              collection={left}
              className="min-h-[450px] md:min-h-[664px]"
            />

            {/* Right: remaining collections stacked */}
            {right.length > 0 && (
              <div className="flex flex-col gap-4 md:gap-6">
                {right.map((col) => (
                  <CollectionCard
                    key={col.handle}
                    collection={col}
                    className="min-h-[300px] md:h-[320px] md:flex-1 justify-end"
                    textClassName="max-w-[50%]"
                    imageClassName="inset-y-0 right-0 w-full md:w-[70%] items-center justify-end p-4 md:p-8 pt-8"
                    imageObjectClass="object-contain object-right"
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  };

  export default Collections;
  ```

- [ ] **Step 3: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add components/home/collections.tsx
  git commit -m "feat: wire Collections section to accept Shopify collection props"
  ```

---

## Task 7: Update `Categories` to accept Shopify props

**Files:**
- Modify: `components/home/categories.tsx`

- [ ] **Step 1: Read the current file**

  Open `components/home/categories.tsx` and note the hardcoded `CATEGORIES` array (lines 8–29) and the render (lines 47–67).

- [ ] **Step 2: Replace hardcoded data with Shopify props**

  Replace the entire file content:

  ```tsx
  'use client';

  import React from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { Container } from '../container';
  import type { ShopifyCollection } from '@/lib/shopify/types';

  type Props = {
    categories: ShopifyCollection[]
  }

  export const Categories = ({ categories }: Props) => {
    if (categories.length === 0) return null

    return (
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900">
              Categories
            </h2>
            <Link
              href="/categories"
              className="text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-70 transition-opacity"
            >
              See all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
            {categories.map((category) => (
              <Link
                key={category.handle}
                href={`/categories/${category.handle}`}
                className="group flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative w-full aspect-square rounded-full bg-[#f6f6f6] flex items-center justify-center p-8 overflow-hidden">
                  <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    {category.image ? (
                      <Image
                        src={category.image.url}
                        alt={category.image.altText || category.title}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-base md:text-lg font-medium text-neutral-800 text-center">
                  {category.title}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    );
  };

  export default Categories;
  ```

- [ ] **Step 3: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add components/home/categories.tsx
  git commit -m "feat: wire Categories section to accept Shopify collection props"
  ```

---

## Task 8: Wire `page.tsx` — fetch all data and pass as props

**Files:**
- Modify: `app/(main)/page.tsx`

This is the final task. The page becomes an async server component that fetches everything in parallel and passes it down.

- [ ] **Step 1: Replace `page.tsx` content**

  ```tsx
  import Hero from '@/components/home/hero';
  import Categories from '@/components/home/categories';
  import Collections from '@/components/home/collections';
  import NewArrivals from '@/components/home/new-arrivals';
  import ProductGrid from '@/components/home/product-grid';
  import Features from '@/components/home/features';
  import Newsletter from '@/components/home/newsletter';
  import FeaturedProduct from '@/components/home/featured-product';
  import { getProducts } from '@/lib/shopify/products';
  import { getCollectionByHandle } from '@/lib/shopify/collections';
  import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';

  export default async function Home() {
    let bestSellers: ShopifyProduct[] = []
    let newArrivals: ShopifyProduct[] = []
    let saleProducts: ShopifyProduct[] = []
    let collectionItems: ShopifyCollection[] = []
    let categoryItems: ShopifyCollection[] = []

    try {
      const [
        bestSellerConn,
        newArrivalConn,
        saleConn,
        kopla,
        lola,
        folka,
        pinkPanther,
        goldCrest,
        hotLips,
        brownSugar,
        redVelvet,
      ] = await Promise.all([
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

      bestSellers = bestSellerConn.edges.map(e => e.node)
      newArrivals = newArrivalConn.edges.map(e => e.node)
      saleProducts = saleConn.edges.map(e => e.node)
      collectionItems = [kopla, lola, folka].filter((c): c is ShopifyCollection => c !== null)
      categoryItems = [pinkPanther, goldCrest, hotLips, brownSugar, redVelvet].filter((c): c is ShopifyCollection => c !== null)
    } catch (err) {
      console.error('Home page data fetch failed:', err)
    }

    return (
      <main className="min-h-screen">
        <Hero />
        <Categories categories={categoryItems} />
        <Collections collections={collectionItems} />
        <NewArrivals products={newArrivals} />
        <FeaturedProduct />
        <ProductGrid bestSellers={bestSellers} newArrivals={newArrivals} sale={saleProducts} />
        <Newsletter />
        <Features />
      </main>
    );
  }
  ```

  **Note:** `.filter(Boolean)` cannot narrow `(ShopifyCollection | null)[]` to `ShopifyCollection[]` in strict TypeScript. Use the explicit type guard `(c): c is ShopifyCollection => c !== null` instead, as shown above.

- [ ] **Step 2: Type-check**

  ```bash
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Start dev server and verify**

  ```bash
  pnpm dev
  ```

  Open `http://localhost:3000` and verify:
  - Categories section renders (or is hidden if no Shopify collections exist yet)
  - Collections section renders (or is hidden)
  - NewArrivals carousel renders Shopify products
  - ProductGrid renders Shopify products for each tab
  - Page doesn't crash if Shopify returns no data

- [ ] **Step 4: Commit**

  ```bash
  git add app/(main)/page.tsx
  git commit -m "feat: wire home page to fetch all sections from Shopify"
  ```

---

## Done

All home page sections now pull live data from Shopify. Add products and collections in the Shopify admin at `https://oodling-3.myshopify.com/admin` and they will appear on the home page within seconds (products) or up to 1 hour (collections, due to caching).
