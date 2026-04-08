export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
          }
        }
      }
    }
  }
`

export const CART_LINE_FRAGMENT = `
  fragment CartLineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          ...ProductFields
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          ...CartLineFields
        }
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const CUSTOMER_ADDRESS_FRAGMENT = `
  fragment AddressFields on MailingAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    country
    zip
    phone
  }
`

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      amount
      currencyCode
    }
    lineItems(first: 10) {
      edges {
        node {
          title
          quantity
          variant {
            price {
              amount
            }
            image {
              url
            }
          }
        }
      }
    }
  }
`

export const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    handle
    title
    image {
      url
      altText
    }
  }
`

export const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetailFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      maxVariantPrice { amount currencyCode }
    }
    images(first: 4) {
      edges {
        node { url altText }
      }
    }
    options {
      name
      values
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount }
          selectedOptions { name value }
        }
      }
    }
  }
`
