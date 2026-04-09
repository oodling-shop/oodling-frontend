import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountSidebar } from "@/components/my-account/sidebar";
import { AccountHeader } from "@/components/my-account/account-header";
import { renewCustomerToken, getCustomer } from '@/lib/shopify/customer';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Nayzak",
  description: "Manage your account, orders, addresses, and details.",
};

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export default async function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(EXPIRES_COOKIE)?.value;

  if (!token || !expiresAt) {
    redirect('/sign-in');
  }

  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();

  if (expiryTime <= now) {
    redirect('/sign-in');
  }

  // Renew if expiring within 2 hours
  if (expiryTime - now < TWO_HOURS_MS) {
    try {
      await renewCustomerToken(token);
    } catch {
      redirect('/sign-in');
    }
  }

  const customer = await getCustomer(token);

  return (
    <div className="container mx-auto px-4 pt-6 pb-16 md:py-20 min-h-[60vh]">
      <AccountHeader />
      <div className="flex flex-col md:flex-row gap-8 md:gap-24">
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <AccountSidebar
            firstName={customer?.firstName ?? ''}
            lastName={customer?.lastName ?? ''}
          />
        </aside>
        <main className="flex-1 pt-2 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
