const SHOPIFY_API_VERSION = '2025-10'

export type StorefrontFetchOptions<V = Record<string, unknown>> = {
  query: string
  variables?: V
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

export class StorefrontError extends Error {
  constructor(
    message: string,
    public type: 'network' | 'graphql',
    public errors?: { message: string }[]
  ) {
    super(message)
    this.name = 'StorefrontError'
  }
}

/**
 * Reusable Shopify Storefront API fetch utility.
 * All GraphQL calls to the Storefront API should go through this function.
 *
 * Requires:
 *  SHOPIFY_STORE_DOMAIN — e.g. "mystore.myshopify.com"
 *  SHOPIFY_STOREFRONT_ACCESS_TOKEN — public storefront access token
 */
export async function storefrontFetch<TData, TVariables = Record<string, unknown>>(
  { query, variables, cache, next }: StorefrontFetchOptions<TVariables>
): Promise<TData> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !accessToken) {
    throw new StorefrontError(
      'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables',
      'network'
    )
  }

  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
      ...(cache ? { cache } : {}),
      ...(next ? { next } : {}),
    })
  } catch (err) {
    throw new StorefrontError(`Network request failed: ${err}`, 'network')
  }

  if (!res.ok) {
    throw new StorefrontError(`HTTP ${res.status}: ${res.statusText}`, 'network')
  }

  const json = await res.json()

  if (json.errors?.length) {
    throw new StorefrontError(json.errors[0].message, 'graphql', json.errors)
  }

  return json.data as TData
}
