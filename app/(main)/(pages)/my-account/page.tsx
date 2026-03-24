import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/customer';
import { DashboardContent } from "@/components/my-account/dashboard";

export default async function MyAccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const customer = await getCustomer(token);

  return <DashboardContent customer={customer} />;
}
