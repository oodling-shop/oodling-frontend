import { shopifyFetch } from './client'
import { PRODUCT_FRAGMENT, PRODUCT_DETAIL_FRAGMENT } from './fragments'
import type { ShopifyProduct, ShopifyProductDetail } from './types'

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

type ProductDetailResponse = {
  product: ShopifyProductDetail | null
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

type ProductTypesResponse = {
  productTypes: {
    edges: { node: string }[]
  }
}

export async function getProductTypes(first = 50): Promise<string[]> {
  const data = await shopifyFetch<ProductTypesResponse>({
    query: `
      query GetProductTypes($first: Int!) {
        productTypes(first: $first) {
          edges {
            node
          }
        }
      }
    `,
    variables: { first },
    next: { revalidate: 3600 },
  })
  return data.productTypes.edges.map((e) => e.node).filter(Boolean)
}

export async function getProduct(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<ProductDetailResponse>({
    query: `
      ${PRODUCT_DETAIL_FRAGMENT}
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductDetailFields
        }
      }
    `,
    variables: { handle },
    cache: 'no-store',
  })
  return data.product
}
