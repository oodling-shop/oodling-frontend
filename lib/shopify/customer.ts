'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { shopifyFetch, ShopifyError } from './client';
import { CUSTOMER_ADDRESS_FRAGMENT, ORDER_FRAGMENT } from './fragments';
import type {
  ShopifyCustomer,
  ShopifyCustomerAccessToken,
  ShopifyAddress,
  ShopifyOrder,
  ShopifyUserError,
} from './types';

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';

async function setTokenCookies(token: ShopifyCustomerAccessToken) {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
  cookieStore.set(TOKEN_COOKIE, token.accessToken, opts);
  cookieStore.set(EXPIRES_COOKIE, token.expiresAt, opts);
}

async function clearTokenCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(EXPIRES_COOKIE);
}

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

// --- Auth ---

export async function login(
  email: string,
  password: string
): Promise<{ error?: string }> {
  type R = {
    customerAccessTokenCreate: {
      customerAccessToken: ShopifyCustomerAccessToken | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input: { email, password } },
    cache: 'no-store',
  });

  const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  if (!customerAccessToken) {
    return { error: 'Login failed. Please try again.' };
  }

  await setTokenCookies(customerAccessToken);
  return {};
}

export async function logout(): Promise<void> {
  const token = await getTokenFromCookie();

  if (token) {
    try {
      await shopifyFetch({
        query: `
          mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
            customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
              deletedAccessToken
            }
          }
        `,
        variables: { customerAccessToken: token },
        cache: 'no-store',
      });
    } catch {
      // Ignore errors — clear cookies regardless
    }
  }

  await clearTokenCookies();
  redirect('/sign-in');
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ error?: string }> {
  type R = {
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id }
          customerUserErrors {
            field
            message
          }
        }
      }
    `,
    variables: { input: { firstName, lastName, email, password } },
    cache: 'no-store',
  });

  const { customer, customerUserErrors } = data.customerCreate;

  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  if (!customer) {
    return { error: 'Registration failed. Please try again.' };
  }

  return login(email, password);
}

// --- Password Recovery ---

export async function recoverPassword(email: string): Promise<{ error?: string }> {
  type R = {
    customerRecover: {
      customerUserErrors: ShopifyUserError[];
    };
  };
  try {
    const data = await shopifyFetch<R>({
      query: `
        mutation CustomerRecover($email: String!) {
          customerRecover(email: $email) {
            customerUserErrors {
              field
              message
            }
          }
        }
      `,
      variables: { email },
      cache: 'no-store',
    });

    if (data.customerRecover.customerUserErrors.length > 0) {
      return { error: data.customerRecover.customerUserErrors[0].message };
    }

    return {};
  } catch (err) {
    return { error: 'Failed to trigger password recovery. Please try again later.' };
  }
}

export async function resetPassword(
  id: string,
  resetToken: string,
  password: string
): Promise<{ error?: string }> {
  type R = {
    customerReset: {
      customer: { id: string } | null;
      customerAccessToken: ShopifyCustomerAccessToken | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  try {
    const data = await shopifyFetch<R>({
      query: `
        mutation CustomerReset($id: ID!, $input: CustomerResetInput!) {
          customerReset(id: $id, input: $input) {
            customer { id }
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        id,
        input: { resetToken, password },
      },
      cache: 'no-store',
    });

    const { customerAccessToken, customerUserErrors } = data.customerReset;

    if (customerUserErrors.length) {
      return { error: customerUserErrors[0].message };
    }

    if (!customerAccessToken) {
      return { error: 'Password reset failed. Please try again.' };
    }

    await setTokenCookies(customerAccessToken);
    return {};
  } catch (err) {
    console.error('Password reset error:', err);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function checkCustomerExists(email: string): Promise<boolean> {
  // Use Admin API to check if customer exists by email
  // This is safer than using Storefront API which doesn't disclose if email exists
  const { shopifyAdminFetch } = await import('./admin-client');

  type R = {
    customers: {
      edges: { node: { id: string } }[];
    };
  };

  try {
    const data = await shopifyAdminFetch<R>({
      query: `
        query GetCustomerByEmail($query: String!) {
          customers(first: 1, query: $query) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: { query: `email:${email}` },
    });

    return data.customers.edges.length > 0;
  } catch (err) {
    // If it's a ShopifyError with 401, we should probably let it bubble up or log it more severely
    console.error('Critical error checking customer existence:', err);
    
    // We re-throw if it's an authorization issue because the feature won't work without it
    if (err instanceof ShopifyError && err.message.includes('Unauthorized')) {
      throw err;
    }
    
    // For other errors, we return false but log them
    return false;
  }
}

export async function renewCustomerToken(token: string): Promise<void> {
  type R = {
    customerAccessTokenRenew: {
      customerAccessToken: ShopifyCustomerAccessToken | null;
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAccessTokenRenew($customerAccessToken: String!) {
        customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
          customerAccessToken {
            accessToken
            expiresAt
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
    cache: 'no-store',
  });

  const renewed = data.customerAccessTokenRenew.customerAccessToken;
  if (!renewed) {
    await clearTokenCookies();
    redirect('/sign-in');
  }

  await setTokenCookies(renewed);
}

// --- Customer Data ---

export async function getCustomer(token: string): Promise<ShopifyCustomer | null> {
  type R = { customer: ShopifyCustomer | null };

  const data = await shopifyFetch<R>({
    query: `
      ${CUSTOMER_ADDRESS_FRAGMENT}
      query GetCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          defaultAddress {
            ...AddressFields
          }
          addresses(first: 10) {
            edges {
              node {
                ...AddressFields
              }
            }
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
    token,
    cache: 'no-store',
  });

  return data.customer;
}

export async function updateCustomer(
  token: string,
  input: { firstName?: string; lastName?: string; email?: string; password?: string }
): Promise<{ error?: string }> {
  type R = {
    customerUpdate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, customer: input },
    token,
    cache: 'no-store',
  });

  const { customerUserErrors } = data.customerUpdate;
  if (customerUserErrors.length) {
    return { error: customerUserErrors[0].message };
  }

  return {};
}

export async function getOrders(token: string): Promise<ShopifyOrder[]> {
  type R = {
    customer: {
      orders: { edges: { node: ShopifyOrder }[] };
    } | null;
  };

  const data = await shopifyFetch<R>({
    query: `
      ${ORDER_FRAGMENT}
      query GetOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                ...OrderFields
              }
            }
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
    token,
    cache: 'no-store',
  });

  return data.customer?.orders.edges.map((e) => e.node) ?? [];
}

export async function getAddresses(token: string): Promise<ShopifyAddress[]> {
  type R = {
    customer: {
      addresses: { edges: { node: ShopifyAddress }[] };
    } | null;
  };

  const data = await shopifyFetch<R>({
    query: `
      ${CUSTOMER_ADDRESS_FRAGMENT}
      query GetAddresses($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          addresses(first: 10) {
            edges {
              node {
                ...AddressFields
              }
            }
          }
        }
      }
    `,
    variables: { customerAccessToken: token },
    token,
    cache: 'no-store',
  });

  return data.customer?.addresses.edges.map((e) => e.node) ?? [];
}

export async function createAddress(
  token: string,
  address: Omit<ShopifyAddress, 'id'>
): Promise<{ error?: string }> {
  type R = {
    customerAddressCreate: {
      customerAddress: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerAddress { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, address },
    token,
    cache: 'no-store',
  });

  const { customerUserErrors } = data.customerAddressCreate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function updateAddress(
  token: string,
  addressId: string,
  address: Partial<Omit<ShopifyAddress, 'id'>>
): Promise<{ error?: string }> {
  type R = {
    customerAddressUpdate: {
      customerAddress: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, id: addressId, address },
    token,
    cache: 'no-store',
  });

  const { customerUserErrors } = data.customerAddressUpdate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function deleteAddress(
  token: string,
  addressId: string
): Promise<{ error?: string }> {
  type R = {
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          deletedCustomerAddressId
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, id: addressId },
    token,
    cache: 'no-store',
  });

  const { customerUserErrors } = data.customerAddressDelete;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}

export async function setDefaultAddress(
  token: string,
  addressId: string
): Promise<{ error?: string }> {
  type R = {
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: ShopifyUserError[];
    };
  };

  const data = await shopifyFetch<R>({
    query: `
      mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customer { id }
          customerUserErrors { field message }
        }
      }
    `,
    variables: { customerAccessToken: token, addressId },
    token,
    cache: 'no-store',
  });

  const { customerUserErrors } = data.customerDefaultAddressUpdate;
  if (customerUserErrors.length) return { error: customerUserErrors[0].message };
  return {};
}
