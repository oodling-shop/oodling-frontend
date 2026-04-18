import { ShopifyError } from './client';

const SHOPIFY_ADMIN_API_VERSION = '2025-10';

type ShopifyAdminFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
};

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: ShopifyAdminFetchOptions): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !accessToken) {
    throw new ShopifyError(
      'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN',
      'network'
    );
  }

  const url = `https://${domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
  } catch (err) {
    throw new ShopifyError(`Admin network request failed: ${err}`, 'network');
  }

  if (!res.ok) {
    throw new ShopifyError(`Admin HTTP ${res.status}: ${res.statusText}`, 'network');
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new ShopifyError(json.errors[0].message, 'graphql');
  }

  return json.data as T;
}
