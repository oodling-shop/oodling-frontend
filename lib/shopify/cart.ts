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
