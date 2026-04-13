import { shopifyFetch } from './client'
import { COLLECTION_FRAGMENT } from './fragments'
import type { ShopifyCollection } from './types'

type CollectionResponse = {
  collection: ShopifyCollection | null
}

type CollectionsResponse = {
  collections: {
    edges: { node: ShopifyCollection }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export async function getCollectionByHandle(
  handle: string,
  language = 'EN'
): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<CollectionResponse>({
    query: `
      ${COLLECTION_FRAGMENT}
      query GetCollection($handle: String!, $language: LanguageCode) @inContext(language: $language) {
        collection(handle: $handle) {
          ...CollectionFields
        }
      }
    `,
    variables: { handle, language },
    next: { revalidate: 3600 },
  })
  return data.collection
}

export async function getAllCollections(
  first = 50,
  language = 'EN'
): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>({
    query: `
      ${COLLECTION_FRAGMENT}
      query GetCollections($first: Int!, $language: LanguageCode) @inContext(language: $language) {
        collections(first: $first) {
          edges {
            node {
              ...CollectionFields
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: { first, language },
    next: { revalidate: 3600 },
  })
  return data.collections.edges.map((e) => e.node)
}
