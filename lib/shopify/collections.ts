import { shopifyFetch } from './client'
import { COLLECTION_FRAGMENT } from './fragments'
import type { ShopifyCollection } from './types'

type CollectionResponse = {
  collection: ShopifyCollection | null
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<CollectionResponse>({
    query: `
      ${COLLECTION_FRAGMENT}
      query GetCollection($handle: String!) {
        collection(handle: $handle) {
          ...CollectionFields
        }
      }
    `,
    variables: { handle },
    next: { revalidate: 3600 },
  })
  return data.collection
}
