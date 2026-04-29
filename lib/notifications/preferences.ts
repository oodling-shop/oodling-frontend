import { shopifyAdminFetch } from '../shopify/admin-client';
import { NotificationType, UserNotificationSettings } from './types';

const METAFIELED_NAMESPACE = 'oodling';
const METAFIELD_KEY = 'notification_preferences';

export async function getCustomerPreferences(customerId: string): Promise<UserNotificationSettings> {
  const query = `
    query getCustomerPreferences($id: ID!) {
      customer(id: $id) {
        emailMarketingConsent {
          marketingState
          consentUpdatedAt
        }
        metafield(namespace: "${METAFIELED_NAMESPACE}", key: "${METAFIELD_KEY}") {
          value
        }
      }
    }
  `;

  try {
    const data = await shopifyAdminFetch<{ 
      customer: { 
        metafield: { value: string } | null;
        emailMarketingConsent: { marketingState: string } | null;
      } 
    }>({
      query,
      variables: { id: customerId },
    });

    let settings: UserNotificationSettings = {
      preferences: Object.values(NotificationType).map((type) => ({
        type,
        enabled: true,
      })),
    };

    if (data.customer?.metafield?.value) {
      settings = JSON.parse(data.customer.metafield.value);
    }

    // Sync with Shopify Marketing Consent
    const isSubscribed = data.customer?.emailMarketingConsent?.marketingState === 'SUBSCRIBED';
    // We can use this to override or default certain promotional categories
    
    return settings;
  } catch (error) {
    console.error('Error fetching customer preferences:', error);
  }

  return {
    preferences: Object.values(NotificationType).map((type) => ({
      type,
      enabled: true,
    })),
  };
}

export async function updateCustomerPreferences(
  customerId: string,
  settings: UserNotificationSettings
): Promise<boolean> {
  const mutation = `
    mutation updateCustomerPreferences($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          emailMarketingConsent {
            marketingState
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Determine if we should update marketing consent based on general preference
  // For this example, if they have ANY promotional type enabled, we might subscribe them,
  // or we could add a specific toggle for "Marketing Emails".
  const hasMarketingEnabled = settings.preferences.some(p => 
    p.type === NotificationType.CUSTOMER_ACCOUNT_WELCOME && p.enabled // Example mapping
  );

  try {
    const response = await shopifyAdminFetch<{
      customerUpdate: { userErrors: Array<{ message: string }> };
    }>({
      query: mutation,
      variables: {
        input: {
          id: customerId,
          emailMarketingConsent: {
            marketingState: hasMarketingEnabled ? 'SUBSCRIBED' : 'UNSUBSCRIBED'
          },
          metafields: [
            {
              namespace: METAFIELED_NAMESPACE,
              key: METAFIELD_KEY,
              value: JSON.stringify(settings),
              type: 'json',
            },
          ],
        },
      },
    });

    return response.customerUpdate.userErrors.length === 0;
  } catch (error) {
    console.error('Error updating customer preferences:', error);
    return false;
  }
}
