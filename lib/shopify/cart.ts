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

async function getLanguage(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('shopify_locale')?.value ?? 'EN';
}

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($id: ID!, $language: LanguageCode) @inContext(language: $language) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($language: LanguageCode) @inContext(language: $language) {
    cartCreate {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode) @inContext(language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode) @inContext(language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode) @inContext(language: $language) {
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
    maxAge: 60 * 60 * 24 * 10,
    path: '/',
  });
}

async function deleteCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

/**
 * Shopify returns checkoutUrl using the store's primary domain (e.g. oodling.com).
 * In a headless setup the Next.js app owns that domain, so /cart/c/... hits Next.js
 * and 404s. We rewrite the hostname to the myshopify.com domain so Shopify handles
 * the checkout page correctly.
 */
function normalizeCheckoutUrl(cart: ShopifyCart): ShopifyCart {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!shopifyDomain || !cart.checkoutUrl) return cart;
  try {
    const url = new URL(cart.checkoutUrl);
    url.hostname = shopifyDomain;
    return { ...cart, checkoutUrl: url.toString() };
  } catch {
    return cart;
  }
}

export async function createCart(): Promise<ShopifyCart> {
  const language = await getLanguage();
  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: { language },
    cache: 'no-store',
  });
  const cart = normalizeCheckoutUrl(data.cartCreate.cart);
  await setCartId(cart.id);
  return cart;
}

export async function getCart(): Promise<ShopifyCart | null> {
  const [cartId, language] = await Promise.all([getCartId(), getLanguage()]);
  if (!cartId) return null;

  const data = await shopifyFetch<CartResponse>({
    query: CART_QUERY,
    variables: { id: cartId, language },
    cache: 'no-store',
  });

  if (!data.cart) {
    await deleteCartId();
    return await createCart();
  }

  return normalizeCheckoutUrl(data.cart);
}

export async function addToCart(
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  const language = await getLanguage();
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
      language,
    },
    cache: 'no-store',
  });
  return normalizeCheckoutUrl(data.cartLinesAdd.cart);
}

export async function updateCartItem(
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const [cartId, language] = await Promise.all([getCartId(), getLanguage()]);
  if (!cartId) throw new Error('No cart found');

  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
      language,
    },
    cache: 'no-store',
  });
  return normalizeCheckoutUrl(data.cartLinesUpdate.cart);
}

export async function removeCartItem(lineId: string): Promise<ShopifyCart> {
  const [cartId, language] = await Promise.all([getCartId(), getLanguage()]);
  if (!cartId) throw new Error('No cart found');

  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds: [lineId], language },
    cache: 'no-store',
  });
  return normalizeCheckoutUrl(data.cartLinesRemove.cart);
}
