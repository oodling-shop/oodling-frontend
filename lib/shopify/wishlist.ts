import { ShopifyError, shopifyFetch } from './client';
import { shopifyAdminFetch } from './admin-client';
import type { ShopifyProduct, ShopifyUserError } from './types';
import { PRODUCT_FRAGMENT } from './fragments';

const WISHLIST_NAMESPACE = 'custom';
const WISHLIST_KEY = 'wishlist';

type CustomerWishlistQueryResponse = {
  customer: {
    id: string;
    metafield: {
      value: string;
    } | null;
  } | null;
};

type ProductNodesResponse = {
  nodes: (ShopifyProduct | null)[];
};

type WishlistWriteAction = 'add' | 'remove' | 'toggle';

function normalizeWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
}

function parseWishlistValue(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    return normalizeWishlist(JSON.parse(value));
  } catch {
    return [];
  }
}

async function getCustomerWishlistRecord(token: string): Promise<{
  customerId: string;
  productIds: string[];
}> {
  const data = await shopifyFetch<CustomerWishlistQueryResponse>({
    query: `
      query GetCustomerWishlist($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          metafield(namespace: "${WISHLIST_NAMESPACE}", key: "${WISHLIST_KEY}") {
            value
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
    token,
    cache: 'no-store',
  });

  if (!data.customer) {
    throw new ShopifyError('Customer not found', 'user');
  }

  return {
    customerId: data.customer.id,
    productIds: parseWishlistValue(data.customer.metafield?.value),
  };
}

export async function getWishlistProductIds(token: string): Promise<string[]> {
  const { productIds } = await getCustomerWishlistRecord(token);
  return productIds;
}

export async function getWishlistProducts(
  productIds: string[],
  language = 'EN'
): Promise<ShopifyProduct[]> {
  if (productIds.length === 0) return [];

  const data = await shopifyFetch<ProductNodesResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetWishlistProducts($ids: [ID!]!, $language: LanguageCode)
      @inContext(language: $language) {
        nodes(ids: $ids) {
          ... on Product {
            ...ProductFields
          }
        }
      }
    `,
    variables: { ids: productIds, language },
    cache: 'no-store',
  });

  const productMap = new Map(
    data.nodes
      .filter((node): node is ShopifyProduct => Boolean(node))
      .map((product) => [product.id, product])
  );

  return productIds.map((id) => productMap.get(id)).filter((product): product is ShopifyProduct => Boolean(product));
}

type AdminMetafieldsSetResponse = {
  metafieldsSet: {
    metafields: { id: string }[];
    userErrors: ShopifyUserError[];
  };
};

export async function updateWishlist(
  token: string,
  productId: string,
  action: WishlistWriteAction = 'toggle'
): Promise<{ productIds: string[]; wishlisted: boolean }> {
  const { customerId, productIds: current } = await getCustomerWishlistRecord(token);
  const alreadyWishlisted = current.includes(productId);

  let next = current;
  if (action === 'add') {
    next = alreadyWishlisted ? current : [...current, productId];
  } else if (action === 'remove') {
    next = current.filter((id) => id !== productId);
  } else {
    next = alreadyWishlisted ? current.filter((id) => id !== productId) : [...current, productId];
  }

  const data = await shopifyAdminFetch<AdminMetafieldsSetResponse>({
    query: `
      mutation SetCustomerWishlist($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      metafields: [
        {
          ownerId: customerId,
          namespace: WISHLIST_NAMESPACE,
          key: WISHLIST_KEY,
          type: 'json',
          value: JSON.stringify(next),
        },
      ],
    },
  });

  if (data.metafieldsSet.userErrors.length > 0) {
    throw new ShopifyError(
      data.metafieldsSet.userErrors[0].message,
      'user',
      data.metafieldsSet.userErrors
    );
  }

  return {
    productIds: next,
    wishlisted: next.includes(productId),
  };
}
