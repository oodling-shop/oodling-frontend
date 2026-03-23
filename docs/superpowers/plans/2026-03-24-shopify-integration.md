# Shopify Storefront API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all mock data with live Shopify Storefront API data covering products, cart, hosted checkout, customer auth, and account management.

**Architecture:** Raw GraphQL via native `fetch` — no SDK. All Shopify calls happen server-side via Server Components and Server Actions. Cart ID and customer tokens are stored in httpOnly cookies. Checkout redirects to Shopify's hosted page.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, Shopify Storefront API 2025-10, native `fetch`

---

## File Map

**New files:**
- `lib/shopify/client.ts` — `shopifyFetch<T>()` typed wrapper
- `lib/shopify/types.ts` — all Shopify TypeScript types
- `lib/shopify/fragments.ts` — named GraphQL fragments
- `lib/shopify/products.ts` — `getProducts`, `getProduct`
- `lib/shopify/cart.ts` — cart Server Actions (`'use server'`)
- `lib/shopify/customer.ts` — customer Server Actions (`'use server'`)
- `providers/cart-provider.tsx` — React cart context (`'use client'`)
- `middleware.ts` — auth route protection
- `.env.local` — env vars (gitignored)
- `app/(main)/(pages)/products/loading.tsx` — products skeleton
- `app/(main)/(pages)/products/[slug]/loading.tsx` — product detail skeleton
- `app/(main)/(pages)/products/_components/products-grid.tsx` — client component for sidebar/view state
- `app/(main)/(pages)/my-account/loading.tsx` — my-account skeleton

**Modified files:**
- `next.config.ts` — add cdn.shopify.com to remotePatterns
- `app/(main)/layout.tsx` — wrap with CartProvider
- `app/(main)/(pages)/products/page.tsx` — rewrite as async Server Component
- `app/(main)/(pages)/products/[slug]/page.tsx` — rewrite as async Server Component
- `components/products/product-card.tsx` — accept ShopifyProduct type
- `components/cart/cart-item.tsx` — GID string IDs, Shopify data shape
- `components/cart/cart-content.tsx` — wire to CartContext
- `components/cart/cart-summary.tsx` — checkout redirect to checkoutUrl
- `components/navbar.tsx` — wire cart badge to CartContext
- `app/(auth)/sign-in/page.tsx` — wire to login server action
- `app/(auth)/sign-up/page.tsx` — update form fields, wire to register
- `app/(main)/(pages)/my-account/layout.tsx` — token renewal
- `app/(main)/(pages)/my-account/page.tsx` — real customer data
- `app/(main)/(pages)/my-account/orders/page.tsx` — real orders
- `app/(main)/(pages)/my-account/addresses/page.tsx` — dynamic address list
- `app/(main)/(pages)/my-account/details/page.tsx` — remove display name, wire save
- `app/(main)/(pages)/my-account/wishlist/page.tsx` — localStorage

**Deleted files:**
- `app/(main)/(pages)/checkout/` (entire directory)
- `components/checkout/` (entire directory)
- `MOCK_PRODUCTS` from `constants/products.ts`
- `Product` interface from `types/index.ts`

---

## Task 1: Project Setup

**Files:**
- Create: `.env.local`
- Modify: `next.config.ts`

- [ ] **Step 1: Create `.env.local` with placeholder values**

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

(Fill in real values from Shopify admin → Apps → Develop apps → your app → Storefront API credentials)

- [ ] **Step 2: Add cdn.shopify.com to `next.config.ts`**

Replace the `images` block:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.shopify.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
},
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add .env.local next.config.ts
git commit -m "chore: add shopify env vars and cdn image domain"
```

---

## Task 2: Core Shopify Types

**Files:**
- Create: `lib/shopify/types.ts`

- [ ] **Step 1: Create `lib/shopify/types.ts`**

```ts
export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string } }[] }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string }
      }
    }[]
  }
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: ShopifyProduct
  }
  cost: { totalAmount: { amount: string; currencyCode: string } }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: { amount: string; currencyCode: string } }
  lines: { edges: { node: ShopifyCartLine }[] }
}

export type ShopifyCustomerAccessToken = {
  accessToken: string
  expiresAt: string
}

export type ShopifyAddress = {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2: string | null
  city: string
  province: string
  country: string
  zip: string
  phone: string | null
}

export type ShopifyCustomer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  defaultAddress: ShopifyAddress | null
  addresses: { edges: { node: ShopifyAddress }[] }
}

export type ShopifyOrder = {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: { amount: string; currencyCode: string }
  lineItems: {
    edges: {
      node: {
        title: string
        quantity: number
        variant: {
          price: { amount: string }
          image: { url: string } | null
        } | null
      }
    }[]
  }
}

export type ShopifyUserError = {
  field: string[] | null
  message: string
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/types.ts
git commit -m "feat: add shopify typescript types"
```

---

## Task 3: Shopify Client + Fragments

**Files:**
- Create: `lib/shopify/client.ts`
- Create: `lib/shopify/fragments.ts`

- [ ] **Step 1: Create `lib/shopify/client.ts`**

```ts
const SHOPIFY_API_VERSION = '2025-10'

type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
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
  cache = 'no-store',
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
      cache,
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

- [ ] **Step 2: Create `lib/shopify/fragments.ts`**

```ts
export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
          }
        }
      }
    }
  }
`

export const CART_LINE_FRAGMENT = `
  fragment CartLineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          ...ProductFields
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          ...CartLineFields
        }
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const CUSTOMER_ADDRESS_FRAGMENT = `
  fragment AddressFields on MailingAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    country
    zip
    phone
  }
`

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      amount
      currencyCode
    }
    lineItems(first: 10) {
      edges {
        node {
          title
          quantity
          variant {
            price {
              amount
            }
            image {
              url
            }
          }
        }
      }
    }
  }
`
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add lib/shopify/client.ts lib/shopify/fragments.ts
git commit -m "feat: add shopify fetch client and graphql fragments"
```

---

## Task 4: Products API

**Files:**
- Create: `lib/shopify/products.ts`

- [ ] **Step 1: Create `lib/shopify/products.ts`**

```ts
import { shopifyFetch } from './client'
import { PRODUCT_FRAGMENT } from './fragments'
import type { ShopifyProduct } from './types'

type GetProductsOptions = {
  first?: number
  after?: string
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING'
  reverse?: boolean
  query?: string
}

type ProductsResponse = {
  products: {
    edges: { node: ShopifyProduct; cursor: string }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

type ProductResponse = {
  product: ShopifyProduct | null
}

export async function getProducts({
  first = 20,
  after,
  sortKey = 'CREATED_AT',
  reverse = false,
  query,
}: GetProductsOptions = {}) {
  const data = await shopifyFetch<ProductsResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProducts(
        $first: Int!
        $after: String
        $sortKey: ProductSortKeys
        $reverse: Boolean
        $query: String
      ) {
        products(
          first: $first
          after: $after
          sortKey: $sortKey
          reverse: $reverse
          query: $query
        ) {
          edges {
            cursor
            node {
              ...ProductFields
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: { first, after, sortKey, reverse, query },
    cache: 'no-store',
  })
  return data.products
}

export async function getProduct(handle: string) {
  const data = await shopifyFetch<ProductResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
        }
      }
    `,
    variables: { handle },
    cache: 'no-store',
  })
  return data.product
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/products.ts
git commit -m "feat: add shopify products api (getProducts, getProduct)"
```

---

## Task 5: Update ProductCard to ShopifyProduct

**Files:**
- Modify: `components/products/product-card.tsx`
- Modify: `types/index.ts` — remove `Product` interface

- [ ] **Step 1: Rewrite `components/products/product-card.tsx`**

```tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/helpers/cn';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductCardProps {
  product: ShopifyProduct;
  layout?: 'grid' | 'list';
}

export const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const href = `/products/${product.handle}`;
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  if (layout === 'list') {
    return (
      <Link href={href} className="group flex gap-8 py-6 border-b border-neutral-100 last:border-0 items-center">
        <div className="relative w-48 aspect-[3/4] overflow-hidden bg-[#F3F5F7] flex-shrink-0">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="192px"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-xl font-bold text-[#141718]">{product.title}</h3>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#141718]">{formattedPrice}</span>
          </div>
          {product.description && (
            <p className="text-neutral-500 line-clamp-2 max-w-xl text-sm">{product.description}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F5F7]">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-[#141718]">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#141718]">{formattedPrice}</span>
        </div>
      </div>
    </Link>
  );
};
```

- [ ] **Step 2: Rename `Product` to `MockProduct` in `types/index.ts`**

**Do NOT delete the Product interface** — it is still used by `constants/products.ts` (the `PRODUCTS` and `NEW_ARRIVALS` arrays) and `components/home/product-grid.tsx` (both out of scope this sprint).

Instead, rename it to `MockProduct` to avoid conflict with `ShopifyProduct`:

In `types/index.ts`, change:
```ts
export interface Product { ... }
```
to:
```ts
export interface MockProduct { ... }
```

Then update every import of `Product` from `@/types` that uses the old interface:
- `constants/products.ts` — change `Product[]` annotation to `MockProduct[]`, update import
- `components/home/product-grid.tsx` — update import from `Product` to `MockProduct`
- `components/home/new-arrivals.tsx` — check and update if it imports `Product`
- Any other files importing `Product` from `@/types` — update to `MockProduct`

The `ProductCard` component in this task already switched to `ShopifyProduct` so it no longer imports from `@/types`.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors (fix any remaining imports of the old `Product` type)

- [ ] **Step 4: Commit**

```bash
git add components/products/product-card.tsx types/index.ts
git commit -m "feat: update ProductCard to use ShopifyProduct type"
```

---

## Task 6: Rewrite Products Pages

**Files:**
- Create: `app/(main)/(pages)/products/_components/products-grid.tsx`
- Modify: `app/(main)/(pages)/products/page.tsx`
- Create: `app/(main)/(pages)/products/loading.tsx`
- Modify: `app/(main)/(pages)/products/[slug]/page.tsx`
- Create: `app/(main)/(pages)/products/[slug]/loading.tsx`
- Modify: `constants/products.ts` — remove MOCK_PRODUCTS

- [ ] **Step 1: Create `app/(main)/(pages)/products/_components/products-grid.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { FilterSidebar } from '@/components/products/filter-sidebar';
import { FilterBar } from '@/components/products/filter-bar';
import { ActiveFilters } from '@/components/products/active-filters';
import { ProductCard } from '@/components/products/product-card';
import { cn } from '@/helpers/cn';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductsGridProps {
  products: ShopifyProduct[];
  totalCount: number;
}

export function ProductsGrid({ products, totalCount }: ProductsGridProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState(4);

  return (
    <div className="flex items-start">
      {isSidebarOpen && (
        <FilterSidebar
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          inline
        />
      )}
      <div className="flex-1 w-full overflow-hidden">
        <div className="lg:max-w-full lg:px-12 mx-auto px-4">
          <FilterBar
            productCount={totalCount}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            currentView={view}
            onViewChange={setView}
          />
          <ActiveFilters />
          <div className={cn(
            'transition-all duration-300',
            view === 1 ? 'flex flex-col' : 'grid gap-x-6 gap-y-10',
            view === 2 ? 'grid-cols-2' :
            view === 3 ? 'grid-cols-2 md:grid-cols-3' :
            view === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
            view === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : ''
          )}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout={view === 1 ? 'list' : 'grid'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/(main)/(pages)/products/page.tsx`**

```tsx
import { getProducts } from '@/lib/shopify/products';
import { ProductsGrid } from './_components/products-grid';

export default async function ProductsPage() {
  const productsData = await getProducts({ first: 20 });
  const products = productsData.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <ProductsGrid products={products} totalCount={products.length} />
    </main>
  );
}
```

- [ ] **Step 3: Create `app/(main)/(pages)/products/loading.tsx`**

```tsx
export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <div className="lg:px-12 px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Rewrite `app/(main)/(pages)/products/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/shopify/products';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const image = product.images.edges[0]?.node;
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(parseFloat(product.priceRange.minVariantPrice.amount));

  const firstAvailableVariant = product.variants.edges.find(
    (e) => e.node.availableForSale
  )?.node;

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] bg-[#F3F5F7] overflow-hidden rounded-lg">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-contain p-6"
              priority
            />
          )}
        </div>
        <div className="flex flex-col gap-6 py-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#141718]">{product.title}</h1>
          <p className="text-2xl font-bold text-[#141718]">{price}</p>
          {product.description && (
            <p className="text-[#6C7275] leading-relaxed">{product.description}</p>
          )}
          {firstAvailableVariant && (
            <AddToCartButton variantId={firstAvailableVariant.id} />
          )}
          {!firstAvailableVariant && (
            <p className="text-red-500 font-medium">Out of stock</p>
          )}
        </div>
      </div>
    </main>
  );
}

// Inline placeholder — will be wired to cart in Task 9
function AddToCartButton({ variantId }: { variantId: string }) {
  return (
    <button
      data-variant-id={variantId}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98]"
    >
      Add to cart
    </button>
  );
}
```

- [ ] **Step 5: Create `app/(main)/(pages)/products/[slug]/loading.tsx`**

```tsx
export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-gray-100 rounded-lg" />
        <div className="flex flex-col gap-6 py-4">
          <div className="h-10 bg-gray-100 rounded w-3/4" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
          <div className="h-14 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Remove MOCK_PRODUCTS from `constants/products.ts`**

Open `constants/products.ts` and delete the `MOCK_PRODUCTS` export (and its type if it used the old `Product` interface). Leave `PRODUCTS` and `NEW_ARRIVALS` unchanged.

- [ ] **Step 7: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add "app/(main)/(pages)/products/" constants/products.ts
git commit -m "feat: rewrite products pages to fetch from Shopify"
```

---

## Task 7: Cart Server Actions

**Files:**
- Create: `lib/shopify/cart.ts`

- [ ] **Step 1: Create `lib/shopify/cart.ts`**

```ts
'use server';

import { cookies } from 'next/headers';
import { shopifyFetch } from './client';
import { CART_FRAGMENT } from './fragments';
import type { ShopifyCart } from './types';

const CART_COOKIE = 'shopify_cart_id';

type CartResponse = { cart: ShopifyCart | null };
type CartCreateResponse = { cartCreate: { cart: ShopifyCart } };
type CartLinesAddResponse = { cartLinesAdd: { cart: ShopifyCart } };
type CartLinesUpdateResponse = { cartLinesUpdate: { cart: ShopifyCart } };
type CartLinesRemoveResponse = { cartLinesRemove: { cart: ShopifyCart } };

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate {
    cartCreate {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
`;

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value;
}

async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 10, // 10 days
    path: '/',
  });
}

async function deleteCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
  });
  const cart = data.cartCreate.cart;
  await setCartId(cart.id);
  return cart;
}

export async function getCart(): Promise<ShopifyCart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  const data = await shopifyFetch<CartResponse>({
    query: CART_QUERY,
    variables: { id: cartId },
  });

  if (!data.cart) {
    await deleteCartId();
    return await createCart();
  }

  return data.cart;
}

export async function addToCart(
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  let cartId = await getCartId();
  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
  }

  const data = await shopifyFetch<CartLinesAddResponse>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartItem(
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error('No cart found');

  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return data.cartLinesUpdate.cart;
}

export async function removeCartItem(lineId: string): Promise<ShopifyCart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error('No cart found');

  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
  });
  return data.cartLinesRemove.cart;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/cart.ts
git commit -m "feat: add shopify cart server actions"
```

---

## Task 8: Cart Context Provider

**Files:**
- Create: `providers/cart-provider.tsx`
- Modify: `app/(main)/layout.tsx`

- [ ] **Step 1: Create `providers/cart-provider.tsx`**

```tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/lib/shopify/cart';
import type { ShopifyCart } from '@/lib/shopify/types';

interface CartContextValue {
  cart: ShopifyCart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(true);

  const isLoading = isPending || isFetching;

  const refreshCart = async () => {
    const updated = await getCart();
    setCart(updated);
  };

  useEffect(() => {
    getCart()
      .then(setCart)
      .finally(() => setIsFetching(false));
  }, []);

  const addItem = async (variantId: string, quantity = 1) => {
    startTransition(async () => {
      const updated = await addToCart(variantId, quantity);
      setCart(updated);
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    startTransition(async () => {
      const updated = await updateCartItem(lineId, quantity);
      setCart(updated);
    });
  };

  const removeItem = async (lineId: string) => {
    startTransition(async () => {
      const updated = await removeCartItem(lineId);
      setCart(updated);
    });
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
```

- [ ] **Step 2: Wrap main layout with CartProvider in `app/(main)/layout.tsx`**

```tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/providers/cart-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col">
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add providers/cart-provider.tsx "app/(main)/layout.tsx"
git commit -m "feat: add cart context provider and mount in main layout"
```

---

## Task 9: Wire Cart UI + Delete Checkout

**Files:**
- Modify: `components/cart/cart-item.tsx`
- Modify: `components/cart/cart-content.tsx`
- Modify: `components/cart/cart-summary.tsx`
- Delete: `app/(main)/(pages)/checkout/` (entire directory)
- Delete: `components/checkout/` (entire directory)

- [ ] **Step 1: Rewrite `components/cart/cart-item.tsx`**

```tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/helpers';
import type { ShopifyCartLine } from '@/lib/shopify/types';

interface CartItemProps {
  line: ShopifyCartLine;
  onUpdateQuantity: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
}

export const CartItem = ({ line, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { id, quantity, merchandise, cost } = line;
  const product = merchandise.product;
  const image = product.images.edges[0]?.node;
  const unitPrice = parseFloat(cost.totalAmount.amount) / quantity;
  const currency = cost.totalAmount.currencyCode;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-slate-100 gap-6 md:gap-0 items-center group animate-in fade-in duration-500">
      <div className="md:col-span-6 flex items-center gap-4 lg:gap-6">
        <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-slate-50 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-lg text-slate-900 group-hover:text-black transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500">{merchandise.title}</p>
          <button
            onClick={() => onRemove(id)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-all mt-2 w-fit"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-start md:justify-center">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            disabled={quantity <= 1}
            onClick={() => onUpdateQuantity(id, -1)}
            className="p-2.5 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold select-none">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(id, 1)}
            className="p-2.5 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="md:col-span-2 text-left md:text-right">
        <span className="md:hidden text-sm text-slate-400 mr-2 font-normal text-[12px] uppercase tracking-wider">Price</span>
        <span className="font-medium text-lg text-slate-900">{fmt(unitPrice)}</span>
      </div>

      <div className="md:col-span-2 text-right">
        <span className="md:hidden text-sm text-slate-400 mr-2 font-normal text-[12px] uppercase tracking-wider">Subtotal</span>
        <span className="font-semibold text-lg text-slate-900">{fmt(parseFloat(cost.totalAmount.amount))}</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Rewrite `components/cart/cart-content.tsx`**

```tsx
'use client';

import React from 'react';
import { Container } from '@/components/container';
import { CartGoal } from '@/components/cart/cart-goal';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { CouponSection } from '@/components/cart/coupon-section';
import { useCart } from '@/providers/cart-provider';

export const CartContent = () => {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const subtotalAmount = cart?.cost.totalAmount.amount ?? '0';
  const subtotal = parseFloat(subtotalAmount);
  const currency = cart?.cost.totalAmount.currencyCode ?? 'USD';

  const totalRequiredForFreeShipping = 200;
  const amountToFreeShipping = Math.max(0, totalRequiredForFreeShipping - subtotal);

  const handleUpdateQuantity = async (lineId: string, delta: number) => {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    const newQty = Math.max(1, line.quantity + delta);
    await updateItem(lineId, newQty);
  };

  const handleRemove = async (lineId: string) => {
    await removeItem(lineId);
  };

  return (
    <div className="py-12 md:py-24 bg-white overflow-x-hidden">
      <Container>
        <div className="flex flex-col items-center mb-12 md:mb-20 space-y-10">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-900 animate-in slide-in-from-top-4 duration-700">
            Cart
          </h1>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 w-full flex justify-center">
            <CartGoal
              amountRemaining={amountToFreeShipping}
              totalRequired={totalRequiredForFreeShipping}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {isLoading && lines.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Loading cart...</div>
            ) : lines.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-12 pb-6 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                <div className="flex flex-col">
                  {lines.map((line) => (
                    <CartItem
                      key={line.id}
                      line={line}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
                <CouponSection />
              </>
            ) : (
              <div className="py-20 text-center border-y border-slate-100 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <p className="text-4xl text-slate-300">🛒</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium text-slate-900">Your cart is empty</h3>
                  <p className="text-slate-500">Looks like you haven&#39;t added anything yet.</p>
                </div>
                <a
                  href="/products"
                  className="mt-4 px-8 py-3 bg-slate-950 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
            <CartSummary subtotal={subtotal} currency={currency} checkoutUrl={cart?.checkoutUrl} />
          </div>
        </div>
      </Container>
    </div>
  );
};
```

- [ ] **Step 3: Rewrite `components/cart/cart-summary.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

interface CartSummaryProps {
  subtotal: number;
  currency: string;
  checkoutUrl?: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'free', name: 'Free shipping', price: 0 },
  { id: 'express', name: 'Express shipping', price: 15 },
];

export const CartSummary = ({ subtotal, currency, checkoutUrl }: CartSummaryProps) => {
  const [selectedShipping, setSelectedShipping] = useState<string>('free');

  const shippingCost = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping)?.price ?? 0;
  const total = subtotal + shippingCost;

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-6 md:p-8 sticky top-24 bg-white shadow-sm">
      <h2 className="text-2xl font-medium mb-8 text-slate-900 border-b border-slate-100 pb-4">Cart summary</h2>

      <div className="space-y-3 mb-10">
        {SHIPPING_OPTIONS.map((option) => (
          <label
            key={option.id}
            onClick={() => setSelectedShipping(option.id)}
            className={cn(
              'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200',
              selectedShipping === option.id
                ? 'border-slate-950 bg-slate-50 shadow-sm'
                : 'border-slate-200 hover:border-slate-400'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                selectedShipping === option.id ? 'border-slate-950' : 'border-slate-300'
              )}>
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full bg-slate-950 transition-transform duration-200',
                  selectedShipping === option.id ? 'scale-100' : 'scale-0'
                )} />
              </div>
              <span className="text-sm font-medium text-slate-700">{option.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {option.price === 0 ? '$0.00' : `+${fmt(option.price)}`}
            </span>
          </label>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center text-slate-600">
          <span className="text-sm">Subtotal</span>
          <span className="font-semibold text-slate-900">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-slate-100">
          <span className="text-slate-900">Total</span>
          <span className="text-slate-900">{fmt(total)}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={!checkoutUrl}
        className="w-full mt-10 h-14 text-base font-bold bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Checkout
      </Button>

      <p className="text-center text-xs text-slate-400 mt-6 px-4">
        Secure checkout powered by Shopify.
      </p>
    </div>
  );
};
```

- [ ] **Step 4: Delete checkout route and components**

Run (paths must be quoted — they contain parentheses):
```bash
rm -rf "app/(main)/(pages)/checkout"
rm -rf "components/checkout"
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add components/cart/ "app/(main)/(pages)/checkout" providers/
git commit -m "feat: wire cart UI to Shopify cart context, delete checkout page"
```

---

## Task 10: Wire Navbar Cart Badge

**Files:**
- Modify: `components/navbar.tsx`

- [ ] **Step 1: Find the hardcoded `2` badge in `components/navbar.tsx`**

Open `components/navbar.tsx`. Find the cart badge — it renders the number `2`. Replace the hardcoded value with cart context:

Add at the top of the Navbar component (it already uses `'use client'`):
```tsx
import { useCart } from '@/providers/cart-provider';
```

Inside the component function, add:
```tsx
const { cart } = useCart();
const cartCount = cart?.totalQuantity ?? 0;
```

Replace the hardcoded `2` with `{cartCount}`. If `cartCount` is 0, optionally hide the badge entirely:
```tsx
{cartCount > 0 && (
  <span className="...existing classes...">
    {cartCount}
  </span>
)}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: wire navbar cart badge to cart context"
```

---

## Task 11: Customer Server Actions

**Files:**
- Create: `lib/shopify/customer.ts`

- [ ] **Step 1: Create `lib/shopify/customer.ts`**

```ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { shopifyFetch, ShopifyError } from './client';
import { CUSTOMER_ADDRESS_FRAGMENT, ORDER_FRAGMENT } from './fragments';
import type {
  ShopifyCustomer,
  ShopifyCustomerAccessToken,
  ShopifyAddress,
  ShopifyOrder,
  ShopifyUserError,
} from './types';

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';

async function setTokenCookies(token: ShopifyCustomerAccessToken) {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
  cookieStore.set(TOKEN_COOKIE, token.accessToken, opts);
  cookieStore.set(EXPIRES_COOKIE, token.expiresAt, opts);
}

async function clearTokenCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(EXPIRES_COOKIE);
}

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

// --- Auth ---

export async function login(
  email: string,
  password: string
): Promise<{ error?: string }> {
  type R = {
    customerAccessTokenCreate: {
      customerAccessToken: ShopifyCustomerAccessToken | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input: { email, password } },
  });

  const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  if (!customerAccessToken) {
    return { error: 'Login failed. Please try again.' };
  }

  await setTokenCookies(customerAccessToken);
  return {};
}

export async function logout(): Promise<void> {
  const token = await getTokenFromCookie();

  if (token) {
    try {
      await shopifyFetch({
        query: `
          mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
            customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
              deletedAccessToken
            }
          }
        `,
        variables: { customerAccessToken: token },
      });
    } catch {
      // Ignore errors — clear cookies regardless
    }
  }

  await clearTokenCookies();
  redirect('/sign-in');
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ error?: string }> {
  type R = {
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id }
          customerUserErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input: { firstName, lastName, email, password } },
  });

  const { customer, customerUserErrors } = data.customerCreate;

  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  if (!customer) {
    return { error: 'Registration failed. Please try again.' };
  }

  return login(email, password);
}

export async function renewCustomerToken(token: string): Promise<void> {
  type R = {
    customerAccessTokenRenew: {
      customerAccessToken: ShopifyCustomerAccessToken | null;
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAccessTokenRenew($customerAccessToken: String!) {
        customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
          customerAccessToken {
            accessToken
            expiresAt
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
  });

  const renewed = data.customerAccessTokenRenew.customerAccessToken;
  if (!renewed) {
    await clearTokenCookies();
    redirect('/sign-in');
  }

  await setTokenCookies(renewed);
}

// --- Customer Data ---

export async function getCustomer(token: string): Promise<ShopifyCustomer | null> {
  type R = { customer: ShopifyCustomer | null };

  const data = await shopifyFetch<R>({
    query: `
      ${CUSTOMER_ADDRESS_FRAGMENT}
      query GetCustomer {
        customer {
          id
          firstName
          lastName
          email
          phone
          defaultAddress {
            ...AddressFields
          }
          addresses(first: 10) {
            edges {
              node {
                ...AddressFields
              }
            }
          }
        }
      }
    `,
    token,
  });

  return data.customer;
}

export async function updateCustomer(
  token: string,
  input: { firstName?: string; lastName?: string; email?: string; password?: string }
): Promise<{ error?: string }> {
  type R = {
    customerUpdate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, customer: input },
    token,
  });

  const { customerUserErrors } = data.customerUpdate;
  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  return {};
}

export async function getOrders(token: string): Promise<ShopifyOrder[]> {
  type R = {
    customer: {
      orders: { edges: { node: ShopifyOrder }[] };
    } | null;
  };

  const data = await shopifyFetch<R>({
    query: `
      ${ORDER_FRAGMENT}
      query GetOrders {
        customer {
          orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                ...OrderFields
              }
            }
          }
        }
      }
    `,
    token,
  });

  return data.customer?.orders.edges.map((e) => e.node) ?? [];
}

export async function getAddresses(token: string): Promise<ShopifyAddress[]> {
  type R = {
    customer: {
      addresses: { edges: { node: ShopifyAddress }[] };
    } | null;
  };

  const data = await shopifyFetch<R>({
    query: `
      ${CUSTOMER_ADDRESS_FRAGMENT}
      query GetAddresses {
        customer {
          addresses(first: 10) {
            edges {
              node {
                ...AddressFields
              }
            }
          }
        }
      }
    `,
    token,
  });

  return data.customer?.addresses.edges.map((e) => e.node) ?? [];
}

export async function createAddress(
  token: string,
  address: Omit<ShopifyAddress, 'id'>
): Promise<{ error?: string }> {
  type R = {
    customerAddressCreate: {
      customerAddress: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerAddress { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, address },
    token,
  });

  const { customerUserErrors } = data.customerAddressCreate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function updateAddress(
  token: string,
  addressId: string,
  address: Partial<Omit<ShopifyAddress, 'id'>>
): Promise<{ error?: string }> {
  type R = {
    customerAddressUpdate: {
      customerAddress: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, id: addressId, address },
    token,
  });

  const { customerUserErrors } = data.customerAddressUpdate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function deleteAddress(
  token: string,
  addressId: string
): Promise<{ error?: string }> {
  type R = {
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          deletedCustomerAddressId
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, id: addressId },
    token,
  });

  const { customerUserErrors } = data.customerAddressDelete;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function setDefaultAddress(
  token: string,
  addressId: string
): Promise<{ error?: string }> {
  type R = {
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customer { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, addressId },
    token,
  });

  const { customerUserErrors } = data.customerDefaultAddressUpdate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/customer.ts
git commit -m "feat: add shopify customer server actions (auth, profile, addresses, orders)"
```

---

## Task 12: Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts` at project root**

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRES_COOKIE)?.value;

  const isExpired =
    !expiresAt || new Date(expiresAt).getTime() <= Date.now();

  const isAuthenticated = !!token && !isExpired;

  // Protect /my-account/* routes
  if (pathname.startsWith('/my-account')) {
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      // Clear stale cookies
      response.cookies.delete(TOKEN_COOKIE);
      response.cookies.delete(EXPIRES_COOKIE);
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/my-account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-account/:path*', '/sign-in', '/sign-up'],
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware protecting my-account routes"
```

---

## Task 13: Wire Sign-In Form

**Files:**
- Modify: `app/(auth)/sign-in/page.tsx`

- [ ] **Step 1: Wire sign-in form to `login` server action**

The sign-in page already has `'use client'`. Add state for error and loading, and wire the form:

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Asterisk, Eye, EyeSlash } from '@phosphor-icons/react';
import { login } from '@/lib/shopify/customer';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/my-account');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Left Side: Image Content */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#F3F3F3] md:block">
        <div className="absolute left-10 top-10 z-10 flex items-center gap-2">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center justify-center p-2">
              <Asterisk size={32} weight="bold" className="text-[#141718]" />
            </div>
          </Link>
        </div>
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=1974&auto=format&fit=crop"
            alt="Sign In Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-16 lg:px-24 xl:px-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
          className="mx-auto w-full max-w-[448px]"
        >
          <div className="mb-12 block md:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <Asterisk size={28} weight="bold" className="text-[#141718]" />
              <span className="text-xl font-bold tracking-tight text-[#141718]">NAYZAK</span>
            </Link>
          </div>

          <h1 className="mb-3 text-[40px] font-medium leading-[44px] tracking-tight text-[#141718]">
            Sign in
          </h1>
          <p className="mb-10 text-base text-[#6C7275]">
            Don&apos;t have an account yet?{' '}
            <Link href="/sign-up" className="font-semibold text-[#141718] hover:underline transition-colors leading-[26px]">
              Sign up
            </Link>
          </p>

          {error && (
            <p className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative border-b border-[#E8ECEF]">
              <Input
                name="email"
                type="email"
                placeholder="Your email address"
                required
                className="w-full bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#6C7275] focus:border-[#141718] border-none shadow-none h-auto px-0 rounded-none focus-visible:ring-0"
              />
            </div>

            <div className="relative border-b border-[#E8ECEF]">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="w-full bg-transparent py-4 text-base font-normal outline-none transition-all placeholder:text-[#6C7275] focus:border-[#141718] border-none shadow-none h-auto px-0 rounded-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6C7275] hover:text-[#141718] hover:bg-transparent h-auto w-auto p-0"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </Button>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex cursor-pointer items-center gap-3 group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className="h-5 w-5 rounded-sm border border-[#6C7275] transition-all peer-checked:bg-[#141718] peer-checked:border-[#141718] group-hover:border-[#141718]" />
                  <svg
                    className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-normal text-[#6C7275]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#141718] hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-[52px] w-full bg-[#141718] text-base font-semibold text-white hover:bg-[#141718]/90 rounded-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/sign-in/page.tsx"
git commit -m "feat: wire sign-in form to Shopify customer auth"
```

---

## Task 14: Wire Sign-Up Form

**Files:**
- Modify: `app/(auth)/sign-up/page.tsx`

- [ ] **Step 1: Read the current sign-up page to see existing field structure**

Open `app/(auth)/sign-up/page.tsx` and locate the "Your name" and "Username" fields.

- [ ] **Step 2: Update sign-up page**

Replace the form section:
- "Your name" field → `name="firstName"`, placeholder "First name"
- "Username" field → `name="lastName"`, placeholder "Last name"
- Add `name` attribute to email and password fields
- Add error state and wire `onSubmit` to `register` server action
- On success redirect to `/my-account`

Key changes in the form:
```tsx
'use client';
// ... existing imports ...
import { useRouter } from 'next/navigation';
import { register } from '@/lib/shopify/customer';

// Inside component:
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
const router = useRouter();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  const fd = new FormData(e.currentTarget);
  const result = await register(
    fd.get('firstName') as string,
    fd.get('lastName') as string,
    fd.get('email') as string,
    fd.get('password') as string,
  );
  if (result.error) {
    setError(result.error);
    setIsLoading(false);
  } else {
    router.push('/my-account');
    router.refresh();
  }
};
```

Update field names:
- `name="firstName"` with placeholder "First name"
- `name="lastName"` with placeholder "Last name"
- `name="email"` on the email field
- `name="password"` on the password field
- Show `{error && <p className="text-red-600 text-sm">{error}</p>}` above the button
- Button shows "Creating account..." when loading

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add "app/(auth)/sign-up/page.tsx"
git commit -m "feat: wire sign-up form to Shopify customer register"
```

---

## Task 15: My Account Layout — Token Renewal

**Files:**
- Modify: `app/(main)/(pages)/my-account/layout.tsx`
- Create: `app/(main)/(pages)/my-account/loading.tsx`

- [ ] **Step 1: Update `app/(main)/(pages)/my-account/layout.tsx`**

```tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountSidebar } from "@/components/my-account/sidebar";
import { AccountHeader } from "@/components/my-account/account-header";
import { renewCustomerToken } from '@/lib/shopify/customer';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Nayzak",
  description: "Manage your account, orders, addresses, and details.",
};

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export default async function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(EXPIRES_COOKIE)?.value;

  if (!token || !expiresAt) {
    redirect('/sign-in');
  }

  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();

  if (expiryTime <= now) {
    redirect('/sign-in');
  }

  // Renew if expiring within 2 hours
  if (expiryTime - now < TWO_HOURS_MS) {
    try {
      await renewCustomerToken(token);
    } catch {
      redirect('/sign-in');
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh]">
      <AccountHeader />
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <AccountSidebar />
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(main)/(pages)/my-account/loading.tsx`**

```tsx
export default function MyAccountLoading() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh] animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48 mb-12" />
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-[260px] space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/(pages)/my-account/layout.tsx" "app/(main)/(pages)/my-account/loading.tsx"
git commit -m "feat: add token renewal to my-account layout and loading skeleton"
```

---

## Task 16: My Account — Dashboard + Orders

**Files:**
- Modify: `app/(main)/(pages)/my-account/page.tsx`
- Modify: `app/(main)/(pages)/my-account/orders/page.tsx`
- Modify: `components/my-account/dashboard.tsx`

- [ ] **Step 1: Rewrite `app/(main)/(pages)/my-account/page.tsx`**

```tsx
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { DashboardContent } from "@/components/my-account/dashboard";

export default async function MyAccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  return <DashboardContent customer={customer} />;
}
```

- [ ] **Step 2: Update `components/my-account/dashboard.tsx`**

Open the file and update it to accept a `customer` prop instead of using hardcoded data. Find any hardcoded name/email references and replace them with `customer?.firstName`, `customer?.email`, etc.

Add the prop interface at the top:
```tsx
import type { ShopifyCustomer } from '@/lib/shopify/types';

interface DashboardContentProps {
  customer: ShopifyCustomer | null;
}
```

Update the component signature: `export function DashboardContent({ customer }: DashboardContentProps)`

Replace hardcoded name/email with `customer?.firstName ?? 'Guest'` and `customer?.email ?? ''`.

- [ ] **Step 3: Rewrite `app/(main)/(pages)/my-account/orders/page.tsx`**

```tsx
import { cookies } from 'next/headers';
import { getOrders } from '@/lib/shopify/customer';
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const orders = await getOrders(token);

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-[#6C7275]">
        <p className="text-lg">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[#E8ECEF]">
              <td className="py-6 pr-4 text-[#141718] font-semibold text-base">
                #{order.orderNumber}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {new Date(order.processedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base capitalize">
                {order.fulfillmentStatus.toLowerCase()}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: order.totalPrice.currencyCode,
                }).format(parseFloat(order.totalPrice.amount))}
              </td>
              <td className="py-6 pl-4 text-right">
                <Button className="bg-[#141718] text-white hover:bg-black px-8 h-10 rounded-[6px] font-medium text-sm transition-colors">
                  Track
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/(pages)/my-account/page.tsx" "app/(main)/(pages)/my-account/orders/page.tsx" "components/my-account/dashboard.tsx"
git commit -m "feat: wire my-account dashboard and orders to Shopify"
```

---

## Task 17: My Account — Addresses

**Files:**
- Modify: `app/(main)/(pages)/my-account/addresses/page.tsx`

- [ ] **Step 1: Rewrite `app/(main)/(pages)/my-account/addresses/page.tsx`**

```tsx
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { AddressList } from './_components/address-list';

export default async function AddressesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  const addresses = customer?.addresses.edges.map((e) => e.node) ?? [];
  const defaultAddressId = customer?.defaultAddress?.id ?? null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Addresses</h2>
      <AddressList
        addresses={addresses}
        defaultAddressId={defaultAddressId}
        token={token}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(main)/(pages)/my-account/addresses/_components/address-list.tsx`**

```tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { deleteAddress, setDefaultAddress } from '@/lib/shopify/customer';
import { useRouter } from 'next/navigation';
import type { ShopifyAddress } from '@/lib/shopify/types';

interface AddressListProps {
  addresses: ShopifyAddress[];
  defaultAddressId: string | null;
  token: string;
}

export function AddressList({ addresses, defaultAddressId, token }: AddressListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      await deleteAddress(token, addressId);
      router.refresh();
    });
  };

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      await setDefaultAddress(token, addressId);
      router.refresh();
    });
  };

  if (addresses.length === 0) {
    return (
      <p className="text-[#6C7275]">No saved addresses yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => {
        const isDefault = address.id === defaultAddressId;
        return (
          <div key={address.id} className="border border-[#E8ECEF] rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {address.firstName} {address.lastName}
                </h3>
                {isDefault && (
                  <span className="text-xs bg-[#141718] text-white px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="text-[#141718] space-y-1 text-sm">
              {address.phone && <p>{address.phone}</p>}
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>{address.city}, {address.province} {address.zip}</p>
              <p>{address.country}</p>
            </div>
            <div className="flex gap-3 pt-2">
              {!isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={isPending}
                  className="text-sm text-[#6C7275] hover:text-black transition-colors font-medium disabled:opacity-50"
                >
                  Set as default
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                disabled={isPending}
                className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/(pages)/my-account/addresses/"
git commit -m "feat: wire addresses page to Shopify, dynamic address list"
```

---

## Task 18: My Account — Details + Wishlist

**Files:**
- Modify: `app/(main)/(pages)/my-account/details/page.tsx`
- Modify: `app/(main)/(pages)/my-account/wishlist/page.tsx`

- [ ] **Step 1: Rewrite `app/(main)/(pages)/my-account/details/page.tsx`**

Convert to Server Component that prefetches customer data, then passes to a client form component:

```tsx
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { AccountDetailsForm } from './_components/account-details-form';

export default async function AccountDetailsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  return (
    <AccountDetailsForm
      token={token}
      defaultValues={{
        firstName: customer?.firstName ?? '',
        lastName: customer?.lastName ?? '',
        email: customer?.email ?? '',
      }}
    />
  );
}
```

- [ ] **Step 2: Create `app/(main)/(pages)/my-account/details/_components/account-details-form.tsx`**

```tsx
'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateCustomer } from '@/lib/shopify/customer';
import { useRouter } from 'next/navigation';

interface AccountDetailsFormProps {
  token: string;
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function AccountDetailsForm({ token, defaultValues }: AccountDetailsFormProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const fd = new FormData(e.currentTarget);
    const input: Record<string, string> = {};

    const firstName = fd.get('firstName') as string;
    const lastName = fd.get('lastName') as string;
    const email = fd.get('email') as string;
    const newPassword = fd.get('newPassword') as string;

    if (firstName) input.firstName = firstName;
    if (lastName) input.lastName = lastName;
    if (email) input.email = email;
    if (newPassword) input.password = newPassword;

    startTransition(async () => {
      const result = await updateCustomer(token, input);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-[720px]">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">Changes saved successfully.</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">First name *</label>
            <Input name="firstName" placeholder="First name" defaultValue={defaultValues.firstName}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Last name *</label>
            <Input name="lastName" placeholder="Last name" defaultValue={defaultValues.lastName}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Email address *</label>
            <Input name="email" type="email" placeholder="Email address" defaultValue={defaultValues.email}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
        </div>

        <div className="pt-10 space-y-6">
          <h3 className="text-xl font-semibold text-[#141718]">Password change</h3>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">New password</label>
            <Input name="newPassword" placeholder="New password" type="password"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Repeat new password</label>
            <Input name="confirmPassword" placeholder="Repeat new password" type="password"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#141718] text-white hover:bg-[#141718]/90 px-10 py-3 h-auto text-base font-semibold rounded-[6px] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Wire wishlist to localStorage in `app/(main)/(pages)/my-account/wishlist/page.tsx`**

The wishlist uses localStorage. Update the page to load product handles from `localStorage` key `'wishlist'` on mount. Remove hardcoded `wishlistItems` array. Since localStorage requires the browser, keep `'use client'` and use `useEffect` to load:

```tsx
'use client';

import { useEffect, useState } from 'react';
// ... existing imports ...

export default function WishlistPage() {
  const [wishlistHandles, setWishlistHandles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) setWishlistHandles(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  if (wishlistHandles.length === 0) {
    return (
      <div className="py-12 text-center text-[#6C7275]">
        <p className="text-lg">Your wishlist is empty.</p>
        <a href="/products" className="mt-4 inline-block text-[#141718] font-semibold hover:underline">
          Browse products
        </a>
      </div>
    );
  }

  // For now render handles — full product data fetch can be wired in a follow-up
  return (
    <div className="w-full">
      <p className="text-[#6C7275] mb-6">{wishlistHandles.length} saved item(s)</p>
      <div className="flex flex-col gap-4">
        {wishlistHandles.map((handle) => (
          <a
            key={handle}
            href={`/products/${handle}`}
            className="py-4 border-b border-[#E8ECEF] text-[#141718] font-medium hover:underline"
          >
            {handle}
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/(pages)/my-account/details/" "app/(main)/(pages)/my-account/wishlist/page.tsx"
git commit -m "feat: wire account details form and wishlist to Shopify/localStorage"
```

---

## Task 19: Add-to-Cart on Product Detail Page

**Files:**
- Modify: `app/(main)/(pages)/products/[slug]/page.tsx`

- [ ] **Step 1: Create client Add-to-Cart button component**

Create `app/(main)/(pages)/products/[slug]/_components/add-to-cart-button.tsx`:

```tsx
'use client';

import { useTransition } from 'react';
import { useCart } from '@/providers/cart-provider';

interface AddToCartButtonProps {
  variantId: string;
}

export function AddToCartButton({ variantId }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      await addItem(variantId, 1);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
```

- [ ] **Step 2: Update `app/(main)/(pages)/products/[slug]/page.tsx`**

Add this import at the top of the file:
```tsx
import { AddToCartButton } from './_components/add-to-cart-button';
```

Then delete the entire local placeholder function at the bottom of the file — find and remove these exact lines:
```tsx
// Inline placeholder — will be wired to cart in Task 9
function AddToCartButton({ variantId }: { variantId: string }) {
  return (
    <button
      data-variant-id={variantId}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98]"
    >
      Add to cart
    </button>
  );
}
```

The `<AddToCartButton variantId={firstAvailableVariant.id} />` JSX in the page body stays unchanged — it now resolves to the imported component instead of the local one.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Full build check**

Run: `npm run build`
Expected: successful build with no errors

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/(pages)/products/[slug]/"
git commit -m "feat: wire add-to-cart button on product detail page"
```

---

## Final Verification

- [ ] **Verify dev server starts**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` with no errors in console

- [ ] **Smoke test checklist**
  - Products page loads with real Shopify products (or error if env vars not set)
  - Product detail page loads at `/products/[handle]`
  - Add to cart works, cart badge updates in navbar
  - Cart page shows real line items with correct prices
  - Checkout button redirects to Shopify checkout URL
  - Sign-in with valid Shopify customer credentials redirects to `/my-account`
  - `/my-account` shows real customer name
  - `/my-account/orders` shows real orders (or empty state)
  - `/my-account/addresses` shows dynamic address list
  - `/my-account/details` save updates customer profile
  - Sign-out clears session and redirects to `/sign-in`
  - Unauthenticated access to `/my-account` redirects to `/sign-in`

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete Shopify Storefront API integration"
```
