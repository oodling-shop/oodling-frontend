'use server';

import { checkCustomerExists, recoverPassword } from './customer';
import { generateResetToken, hashToken } from '../auth-utils';
import { storeToken, verifyAndConsumeToken } from '../tokens';
import { logSecurityEvent } from '../logger';
import { isRateLimited } from '../rate-limit';
import { headers } from 'next/headers';

const RESET_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Handles the forgot password request using Shopify's native notification system.
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 0. Rate limiting (max 5 requests per 15 minutes per IP/email)
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`reset_req_${ip}`, 5, 15 * 60 * 1000) || isRateLimited(`reset_req_${email}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent('PASSWORD_RESET_RATE_LIMITED', { email, ip });
      return { success: false, error: 'Too many requests. Please try again in 15 minutes.' };
    }

    // 1. Trigger Shopify's native recovery email
    // This uses Shopify's internal notification system shown in your settings.
    const { error } = await recoverPassword(email);

    if (error) {
      // Still return success for non-existent emails to prevent enumeration, 
      // but log it if it's a real error.
      console.error('Shopify recovery trigger failed:', error);
    }

    logSecurityEvent('PASSWORD_RESET_NATIVE_TRIGGERED', { email });
    
    // We always return success to prevent email enumeration
    return { success: true };
  } catch (err) {
    console.error('Password reset request error:', err);
    logSecurityEvent('PASSWORD_RESET_REQUEST_FAILED', { email, error: String(err) });
    return { success: false, error: 'Failed to process request. Please try again later.' };
  }
}

/**
 * Handles the actual password reset.
 */
export async function performPasswordReset(token: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 0. Rate limiting
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`reset_perf_${ip}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent('PASSWORD_RESET_PERFORM_RATE_LIMITED', { ip });
      return { success: false, error: 'Too many attempts. Please try again in 15 minutes.' };
    }

    // 1. Verify token
    const email = await verifyAndConsumeToken(token);
    
    if (!email) {
      logSecurityEvent('PASSWORD_RESET_FAILED_INVALID_TOKEN', { token: hashToken(token) });
      return { success: false, error: 'Invalid or expired reset token.' };
    }

    // 2. Update password in Shopify via Admin API
    const { shopifyAdminFetch } = await import('./admin-client');
    
    // First, find the customer ID by email
    type CustomerSearchR = {
      customers: {
        edges: { node: { id: string } }[];
      };
    };

    const searchData = await shopifyAdminFetch<CustomerSearchR>({
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

    const customerId = searchData.customers.edges[0]?.node.id;

    if (!customerId) {
      logSecurityEvent('PASSWORD_RESET_FAILED_CUSTOMER_NOT_FOUND', { email });
      return { success: false, error: 'Account no longer exists.' };
    }

    // Update the password
    type CustomerUpdateR = {
      customerUpdate: {
        customer: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    };

    const updateData = await shopifyAdminFetch<CustomerUpdateR>({
      query: `
        mutation customerUpdate($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer { id }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          id: customerId,
          password: password,
        },
      },
    });

    if (updateData.customerUpdate.userErrors.length > 0) {
      const error = updateData.customerUpdate.userErrors[0].message;
      logSecurityEvent('PASSWORD_RESET_FAILED_SHOPIFY_ERROR', { email, error });
      return { success: false, error };
    }

    logSecurityEvent('PASSWORD_RESET_SUCCESS', { email });
    return { success: true };
  } catch (err) {
    console.error('Password reset performance error:', err);
    logSecurityEvent('PASSWORD_RESET_FAILED_SYSTEM_ERROR', { error: String(err) });
    return { success: false, error: 'Failed to reset password. Please try again later.' };
  }
}
