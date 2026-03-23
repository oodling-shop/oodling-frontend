# Shopify Storefront API Integration — Design Spec

**Date:** 2026-03-24
**Project:** oodling-fe (Next.js 16, App Router, TypeScript, Tailwind CSS)
**Approach:** Raw GraphQL via Shopify Storefront API — no SDK dependency

---

## Overview

Replace all mock data and placeholder UI with a live Shopify Storefront API integration. The frontend remains a fully custom Next.js app; Shopify serves as the commerce backend. Checkout is delegated to Shopify's hosted checkout page.

**Shopify features in scope:**
- Products & Collections
- Cart (Shopify Cart API)
- Hosted Checkout (redirect to `cart.checkoutUrl`)
- Customer Authentication (sign in, sign up, logout)
- Customer Account (profile, addresses, orders)
- Wishlist (localStorage — Storefront API has no native wishlist)

---

## Environment Variables

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
```

**Important:** Neither variable uses `NEXT_PUBLIC_`. All Shopify requests are server-side only. These variables must never be referenced from client components.

---

## Setup Changes

### `next.config.ts` — image domains

Add `cdn.shopify.com` to `remotePatterns` so `next/image` can render Shopify product images:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.shopify.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' }, // existing
  ],
},
```

---

## Section 1: Core Module — `lib/shopify/`

All Shopify logic is isolated in `lib/shopify/`. Nothing Shopify-specific leaks into components. All files in this directory must have `'use server'` at the top — they run server-side only and several functions write cookies.

### File structure

```
lib/shopify/
├── client.ts       # shopifyFetch<T>() — typed fetch wrapper for GraphQL
├── types.ts        # TypeScript types for all Shopify API responses
├── fragments.ts    # Reusable GraphQL fragments
├── products.ts     # getProducts, getProduct
├── cart.ts         # createCart, getCart, addToCart, updateCartItem, removeCartItem
└── customer.ts     # login, logout, register, renewCustomerToken, getCustomer,
                    # updateCustomer, getOrders, getAddresses, createAddress,
                    # updateAddress, deleteAddress, setDefaultAddress
```

### `client.ts`

```ts
const SHOPIFY_API_VERSION = '2025-10'

async function shopifyFetch<T>({
  query,
  variables,
  cache,
  token,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  token?: string  // customer access token for authenticated queries
}): Promise<T>
```

- Reads `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from env
- Posts to `https://{domain}/api/${SHOPIFY_API_VERSION}/graphql.json`
- Sets `X-Shopify-Storefront-Access-Token` header on every request
- Optionally sets `X-Shopify-Customer-Access-Token` when `token` is provided
- Throws a typed error distinguishing: network failure, GraphQL `errors[]` array, and mutation `userErrors[]` array — these are three distinct Shopify error shapes
- Returns typed `data` payload

### `fragments.ts`

Define these named GraphQL fragments to avoid field duplication across queries:

- `PRODUCT_FRAGMENT` — id, handle, title, description, priceRange, images, variants
- `CART_LINE_FRAGMENT` — id, quantity, merchandise (product + variant), cost
- `CART_FRAGMENT` — id, checkoutUrl, totalQuantity, cost, lines (uses CART_LINE_FRAGMENT)
- `CUSTOMER_ADDRESS_FRAGMENT` — id, firstName, lastName, address1, address2, city, province, country, zip, phone
- `ORDER_FRAGMENT` — id, orderNumber, processedAt, financialStatus, fulfillmentStatus, totalPrice, lineItems

### `types.ts` — Key types

```ts
type ShopifyProduct = {
  id: string      // GID: "gid://shopify/Product/123"
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
        id: string  // GID: "gid://shopify/ProductVariant/123"
        title: string
        availableForSale: boolean
        price: { amount: string }
      }
    }[]
  }
}

// The existing types/index.ts Product interface (with id: number) is superseded
// by ShopifyProduct. The old Product interface is deleted in this sprint.
// All components that previously used Product now use ShopifyProduct.

type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: { amount: string; currencyCode: string } }
  lines: {
    edges: {
      node: {
        id: string  // GID: "gid://shopify/CartLine/abc123" — always a string, never a number
        quantity: number
        merchandise: { id: string; title: string; product: ShopifyProduct }
        cost: { totalAmount: { amount: string; currencyCode: string } }
      }
    }[]
  }
}

type ShopifyCustomerAccessToken = {
  accessToken: string
  expiresAt: string  // ISO 8601: "2026-03-25T10:00:00Z" — stored as-is in cookie
}

type ShopifyCustomer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  defaultAddress: ShopifyAddress | null
  addresses: { edges: { node: ShopifyAddress }[] }
}

type ShopifyOrder = {
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
        variant: { price: { amount: string }; image: { url: string } | null }
      }
    }[]
  }
}

type ShopifyAddress = {
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
```

---

## Section 2: Products & Collections

### Data fetching

- `getProducts({ first, after, sortKey, query })` — paginated product list
- `getProduct(handle)` — single product by slug/handle

Both called from Server Components — no client-side fetching for product data.

### Component type contract

The existing `types/index.ts` `Product` interface (where `id: number`) is **deleted** this sprint. `ShopifyProduct` from `lib/shopify/types.ts` replaces it everywhere.

`ProductCard` must be updated to accept `product: ShopifyProduct`. The shape change:
- `product.name` → `product.title`
- `product.image` → `product.images.edges[0].node.url`
- `product.price` → `product.priceRange.minVariantPrice.amount`
- `product.id` → `product.id` (now a GID string, not a number)
- Product URL → `/products/${product.handle}`

### Component split (App Router pattern)

`app/(main)/(pages)/products/page.tsx` currently has `'use client'` with `useState` for sidebar and view. Split into:

- **`ProductsPage`** (Server Component, async) — fetches products, passes to `<ProductsGrid>`
- **`ProductsGrid`** (Client Component, `'use client'`) — owns sidebar toggle and view state, receives `products: ShopifyProduct[]` as prop

### Page changes

| File | Change |
|---|---|
| `app/(main)/(pages)/products/page.tsx` | Async Server Component — calls `getProducts()` |
| `app/(main)/(pages)/products/loading.tsx` | New — skeleton UI |
| `app/(main)/(pages)/products/[slug]/page.tsx` | Async Server Component — calls `getProduct(params.slug)` |
| `app/(main)/(pages)/products/[slug]/loading.tsx` | New — skeleton UI |
| `constants/products.ts` | Delete `MOCK_PRODUCTS` only. `PRODUCTS` and `NEW_ARRIVALS` remain — they support home page components that are out of scope this sprint. |
| `app/(main)/(pages)/products/page.tsx` | **Fully rewritten** as async Server Component — the `MOCK_PRODUCTS` import is removed as part of this rewrite, not as a separate step. Do not delete `MOCK_PRODUCTS` from `constants/products.ts` without also completing the products page rewrite in the same pass. |
| `types/index.ts` | Delete `Product` interface — superseded by `ShopifyProduct` defined in `lib/shopify/types.ts` |

---

## Section 3: Cart

### Cart ID cookie

The Shopify cart ID is stored in an httpOnly cookie named `shopify_cart_id`.

**Expired/null cart recovery:** Shopify carts expire after 10 days of inactivity. `getCart` returns `null` for an expired cart — this is NOT a GraphQL error, it is `data.cart = null`. The `getCart` Server Action must:
1. Call `cart(id)` with stored ID
2. If `data.cart === null` → delete `shopify_cart_id` cookie → call `createCart()` → return fresh cart

`getCart` is always called server-side (in a Server Component or via a `'use server'` action). It must never be imported directly into a Client Component.

### Server Actions in `lib/shopify/cart.ts`

All functions in this file have `'use server'` at the top.

| Action | Shopify mutation/query |
|---|---|
| `createCart()` | `cartCreate` — stores returned `id` in cookie |
| `getCart()` | reads cookie → `cart(id)` query → null recovery |
| `addToCart(variantId, quantity)` | reads cookie → createCart if missing → `cartLinesAdd` |
| `updateCartItem(lineId, quantity)` | `cartLinesUpdate` |
| `removeCartItem(lineId)` | `cartLinesRemove` |

### Cart Context

`/providers/cart-provider.tsx` — client-side React context (`'use client'`):
- Holds `cart: ShopifyCart | null` and `isLoading: boolean`
- Exposes `addItem(variantId, quantity)`, `updateItem(lineId, quantity)`, `removeItem(lineId)`
- Each action calls the corresponding server action, then calls `getCart()` to refresh state
- **Mounted in `/app/(main)/layout.tsx`** — wraps all main app routes so Navbar and CartContent both have access

### Navbar cart badge

`components/navbar.tsx` — the hardcoded `2` cart badge must be replaced. The Navbar reads cart data via `useContext(CartContext)` (the CartContext provider is mounted in the parent layout, so the Navbar has access). Display `cart?.totalQuantity ?? 0`.

### Checkout — existing files deleted

The following are **deleted** in this sprint:
- `/app/(main)/(pages)/checkout/` (entire directory)
- `/components/checkout/` (entire directory)

Checkout is handled exclusively via:
```ts
// In CartContent "Checkout" button:
window.location.href = cart.checkoutUrl
```

The existing `CartSummary` `<Link href="/checkout">` is replaced with this redirect.

### Cart line item IDs

All cart line item IDs are GID strings. Replace `id: number` with `id: string` in `CartItem`, `CartContent`, and `OrderSummary`. All `id` comparisons must use string equality.

---

## Section 4: Customer Auth & My Account

### Cookie names and format

| Cookie | Value | Notes |
|---|---|---|
| `shopify_customer_token` | accessToken string | httpOnly |
| `shopify_customer_token_expires` | ISO 8601 datetime string (e.g. `"2026-03-25T10:00:00Z"`) | httpOnly; parsed in middleware with `new Date(value).getTime()` |

### Token renewal

Customer access tokens expire after **24 hours**. The `/my-account` layout Server Component checks expiry on every request:
- If `expiresAt` is within 2 hours: call `renewCustomerToken(token)` → update both cookies
- If `renewCustomerToken` fails: clear both cookies → `redirect('/sign-in')`
- `/app/(main)/(pages)/my-account/layout.tsx` must remain a **Server Component**

### Middleware (`/middleware.ts`)

File location: `/middleware.ts` at the project root (does not exist yet — create it).

```ts
// matcher — runs on all my-account routes and auth routes
export const config = {
  matcher: ['/my-account/:path*', '/sign-in', '/sign-up'],
}
```

Logic:
```ts
const token = request.cookies.get('shopify_customer_token')
const expiresAt = request.cookies.get('shopify_customer_token_expires')
const isExpired = !expiresAt || new Date(expiresAt.value).getTime() <= Date.now()

// On /my-account routes:
if (!token || isExpired) {
  // Clear stale cookies
  // Redirect to /sign-in
}

// On /sign-in or /sign-up:
if (token && !isExpired) {
  // Redirect to /my-account
}
```

### Server Actions in `lib/shopify/customer.ts`

All functions have `'use server'` at the top.

| Action | Shopify mutation/query | Notes |
|---|---|---|
| `login(email, password)` | `customerAccessTokenCreate` | Set both cookies |
| `logout()` | `customerAccessTokenDelete` | Clear both cookies |
| `register(firstName, lastName, email, password)` | `customerCreate` → then `login()` | |
| `renewCustomerToken(token)` | `customerAccessTokenRenew` | Update both cookies; on failure throw |
| `getCustomer(token)` | `customer` query | |
| `updateCustomer(token, data)` | `customerUpdate` | |
| `getOrders(token)` | `customer { orders }` | |
| `getAddresses(token)` | `customer { addresses(first: 10) }` | |
| `createAddress(token, address)` | `customerAddressCreate` | |
| `updateAddress(token, addressId, address)` | `customerAddressUpdate` | |
| `deleteAddress(token, addressId)` | `customerAddressDelete` | |
| `setDefaultAddress(token, addressId)` | `customerDefaultAddressUpdate` | |

### Auth page changes

**Sign-in** (`app/(auth)/sign-in/page.tsx`):
- Wire form `onSubmit` to `login(email, password)` server action
- UI unchanged

**Sign-up** (`app/(auth)/sign-up/page.tsx`):
- The existing "Your name" field becomes "First name"
- The existing "Username" field becomes "Last name" (Shopify has no username concept)
- Final form fields: First name, Last name, Email, Password
- Wire form `onSubmit` to `register({ firstName, lastName, email, password })`

### My Account pages

All My Account pages are async Server Components that read the token cookie server-side.

| Page | Data source | Notes |
|---|---|---|
| `/my-account` | `getCustomer(token)` | Name, email |
| `/my-account/orders` | `getOrders(token)` | Order list, status, items |
| `/my-account/addresses` | `getAddresses(token)` | See address UI below |
| `/my-account/details` | `getCustomer(token)` pre-fills form | `updateCustomer()` on save |
| `/my-account/wishlist` | `localStorage` | Client Component; persist product handles |

Add a single `/app/(main)/(pages)/my-account/loading.tsx` — Next.js layout inheritance means this covers all child routes via the shared layout shell. Per-route loading files are not needed unless a subpage has substantially different skeleton requirements.

### My Account — Details form

The existing "Display name" field is **removed**. Shopify's `customerUpdate` does not support a display name. The form maps to: `{ firstName, lastName, email, password }`.

### Addresses UI redesign

The existing two-card layout ("Billing Address" / "Shipping Address") is replaced with a **dynamic list**:
- Renders all addresses from `getAddresses()` as cards
- Each card has Edit and Delete actions
- One card shows "Default" badge, based on `customer.defaultAddress.id`
- "Set as default" button calls `setDefaultAddress()`
- "Add address" button opens inline form for `createAddress()`

---

## Error Handling

| Error type | Handling |
|---|---|
| Network failure in `shopifyFetch` | Throw — callers show generic error state |
| GraphQL `errors[]` in response | Throw with message — callers show error |
| Mutation `userErrors[]` in payload | Return to caller as typed error — show inline form error |
| Invalid credentials on login | Return `userErrors` → inline "Invalid email or password" message |
| Expired token | Middleware redirects before page renders |
| Cart null (expired) | `getCart` auto-recovers — creates new cart silently |
| Cart item out of stock | Inline error in `CartContent` |

---

## What Is NOT in Scope

- Custom payment UI (Shopify handles payment on hosted checkout)
- Shopify Admin API
- Discount codes
- Shopify Plus custom checkout
- Product search
- Collections/category navigation
- Home page components (`PRODUCTS`, `NEW_ARRIVALS`) — remain on mock data

---

## Dependencies to Add

No new npm dependencies. The integration uses native `fetch` only.
