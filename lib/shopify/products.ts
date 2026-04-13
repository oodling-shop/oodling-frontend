import { shopifyFetch } from './client'
import { PRODUCT_FRAGMENT, PRODUCT_DETAIL_FRAGMENT } from './fragments'
import type { ShopifyProduct, ShopifyProductDetail } from './types'

export type ProductSortKey = 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING'

const VALID_SORT_KEYS: ProductSortKey[] = ['TITLE', 'PRICE', 'CREATED_AT', 'BEST_SELLING']

export function parseSortParams(params: {
  sortKey?: string
  reverse?: string
}): { sortKey: ProductSortKey; reverse: boolean } {
  const sortKey = VALID_SORT_KEYS.includes(params.sortKey as ProductSortKey)
    ? (params.sortKey as ProductSortKey)
    : 'CREATED_AT'
  return { sortKey, reverse: params.reverse === 'true' }
}

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

export async function getProducts(
  {
    first = 20,
    after,
    sortKey = 'CREATED_AT',
    reverse = false,
    query,
  }: GetProductsOptions = {},
  language = 'EN'
) {
  const data = await shopifyFetch<ProductsResponse>({
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProducts(
        $first: Int!
        $after: String
        $sortKey: ProductSortKeys
        $reverse: Boolean
        $query: String
        $language: LanguageCode
      ) @inContext(language: $language) {
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
    variables: { first, after, sortKey, reverse, query, language },
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

export async function getProduct(
  handle: string,
  language = 'EN'
): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<ProductDetailResponse>({
    query: `
      ${PRODUCT_DETAIL_FRAGMENT}
      query GetProduct($handle: String!, $language: LanguageCode) @inContext(language: $language) {
        product(handle: $handle) {
          ...ProductDetailFields
        }
      }
    `,
    variables: { handle, language },
    cache: 'no-store',
  })
  return data.product
}
