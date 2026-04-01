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
