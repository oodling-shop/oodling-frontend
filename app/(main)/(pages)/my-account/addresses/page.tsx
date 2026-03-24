import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { AddressList } from './_components/address-list';

export default async function AddressesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  const addresses = customer?.addresses.edges.map((e) => e.node) ?? [];
  const defaultAddressId = customer?.defaultAddress?.id ?? null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Addresses</h2>
      <AddressList
        addresses={addresses}
        defaultAddressId={defaultAddressId}
        token={token}
      />
    </div>
  );
}
