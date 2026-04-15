export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string } }[] }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string }
      }
    }[]
  }
}

export type ShopifyProductWithMetafields = {
  id: string
  handle: string
  title: string
  description: string
  metafields: ({ key: string; value: string; namespace: string } | null)[] | null
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string } }[] }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string }
      }
    }[]
  }
}

export type ShopifyProductDetail = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  compareAtPriceRange: {
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string } }[] }
  options: { name: string; values: string[] }[]
  variants: {
    edges: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string }
        selectedOptions: { name: string; value: string }[]
      }
    }[]
  }
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: ShopifyProduct
  }
  cost: { totalAmount: { amount: string; currencyCode: string } }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: { amount: string; currencyCode: string } }
  lines: { edges: { node: ShopifyCartLine }[] }
}

export type ShopifyCustomerAccessToken = {
  accessToken: string
  expiresAt: string
}

export type ShopifyAddress = {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2: string | null
  city: string
  province: string
  country: string
  zip: string
  phone: string | null
}

export type ShopifyCustomer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  defaultAddress: ShopifyAddress | null
  addresses: { edges: { node: ShopifyAddress }[] }
}

export type ShopifyOrder = {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: { amount: string; currencyCode: string }
  lineItems: {
    edges: {
      node: {
        title: string
        quantity: number
        variant: {
          price: { amount: string }
          image: { url: string } | null
        } | null
      }
    }[]
  }
}

export type ShopifyUserError = {
  field: string[] | null
  message: string
}

export type ShopifyCollection = {
  handle: string
  title: string
  image: { url: string; altText: string } | null
}
