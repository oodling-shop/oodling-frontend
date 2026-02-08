import { AccountSidebar } from "@/components/my-account/sidebar";
import { AccountHeader } from "@/components/my-account/account-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Nayzak",
  description: "Manage your account, orders, addresses, and details.",
};

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh]">
      <AccountHeader />
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <AccountSidebar />
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
