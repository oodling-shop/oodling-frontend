import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { getCustomerPreferences } from '@/lib/notifications/preferences';
import { NotificationType } from '@/lib/notifications/types';
import { NotificationSettingsForm } from './_components/notification-settings-form';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Notifications | Oodling',
  description: 'Manage your notification preferences.',
};

const TOKEN_COOKIE = 'shopify_customer_token';

export default async function NotificationsPage() {
  const t = await getTranslations('footer.notifications');
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) return null;

  const customer = await getCustomer(token);
  if (!customer) return null;

  const preferences = await getCustomerPreferences(customer.id);

  const groups = [
    {
      title: t('groups.orderProcessing'),
      items: [
        { type: NotificationType.ORDER_CONFIRMATION, label: t('items.orderConfirmation.label'), description: t('items.orderConfirmation.description') },
        { type: NotificationType.DRAFT_ORDER_INVOICE, label: t('items.draftOrderInvoice.label'), description: t('items.draftOrderInvoice.description') },
        { type: NotificationType.SHIPPING_CONFIRMATION, label: t('items.shippingConfirmation.label'), description: t('items.shippingConfirmation.description') },
      ],
    },
    {
      title: t('groups.localPickup'),
      items: [
        { type: NotificationType.READY_FOR_LOCAL_PICKUP, label: t('items.readyForLocalPickup.label'), description: t('items.readyForLocalPickup.description') },
        { type: NotificationType.PICKED_UP_BY_CUSTOMER, label: t('items.pickedUpByCustomer.label'), description: t('items.pickedUpByCustomer.description') },
      ],
    },
    {
      title: t('groups.shippingUpdated'),
      items: [
        { type: NotificationType.SHIPPING_UPDATE, label: t('items.shippingUpdate.label'), description: t('items.shippingUpdate.description') },
        { type: NotificationType.OUT_FOR_DELIVERY, label: t('items.outForDelivery.label'), description: t('items.outForDelivery.description') },
        { type: NotificationType.DELIVERED, label: t('items.delivered.label'), description: t('items.delivered.description') },
      ],
    },
    {
      title: t('groups.accountsAndOutreach'),
      items: [
        { type: NotificationType.CUSTOMER_ACCOUNT_WELCOME, label: t('items.customerAccountWelcome.label'), description: t('items.customerAccountWelcome.description') },
        { type: NotificationType.CUSTOMER_ACCOUNT_PASSWORD_RESET, label: t('items.customerAccountPasswordReset.label'), description: t('items.customerAccountPasswordReset.description') },
        { type: NotificationType.CUSTOMER_EMAIL_CHANGE_CONFIRMATION, label: t('items.customerEmailChangeConfirmation.label'), description: t('items.customerEmailChangeConfirmation.description') },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('description')}</p>
      </div>

      <NotificationSettingsForm 
        customerId={customer.id} 
        initialPreferences={preferences.preferences} 
        groups={groups} 
        translations={{
          save: t('save'),
          saving: t('saving'),
          success: t('success'),
          error: t('error')
        }}
      />
    </div>
  );
}

