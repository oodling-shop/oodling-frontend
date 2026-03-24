import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { AccountDetailsForm } from './_components/account-details-form';

export default async function AccountDetailsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  return (
    <AccountDetailsForm
      token={token}
      defaultValues={{
        firstName: customer?.firstName ?? '',
        lastName: customer?.lastName ?? '',
        email: customer?.email ?? '',
      }}
    />
  );
}
