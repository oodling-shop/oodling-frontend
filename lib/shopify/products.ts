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
