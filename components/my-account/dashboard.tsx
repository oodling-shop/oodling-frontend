"use client";

import { useTransition } from "react";
import type { ShopifyCustomer } from '@/lib/shopify/types';
import { logout } from "@/lib/shopify/customer";

interface DashboardContentProps {
  customer: ShopifyCustomer | null;
}

function LogoutLink() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="text-[#141718] font-semibold hover:underline decoration-2 disabled:opacity-50"
    >
      {isPending ? "Logging out…" : "Log out"}
    </button>
  );
}

export function DashboardContent({ customer }: DashboardContentProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-[#6C7275] text-lg leading-relaxed">
        Hello <span className="font-semibold text-black">{customer?.firstName ?? 'Guest'}</span> (not {customer?.email ?? ''}? <LogoutLink />)
      </p>

      <p className="text-[#6C7275] text-lg leading-relaxed">
        From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
      </p>
    </div>
  );
}
