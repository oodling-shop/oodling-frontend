"use client";

import { useTransition } from "react";
import type { ShopifyCustomer } from '@/lib/shopify/types';
import { logout } from "@/lib/shopify/customer";
import { useTranslations } from 'next-intl';

interface DashboardContentProps {
  customer: ShopifyCustomer | null;
}

function LogoutLink() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('account');

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="text-[#141718] font-semibold hover:underline decoration-2 disabled:opacity-50"
    >
      {isPending ? t('loggingOut') : t('logout')}
    </button>
  );
}

export function DashboardContent({ customer }: DashboardContentProps) {
  const t = useTranslations('account');
  const name = customer?.firstName ?? t('guest');

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-[#6C7275] text-lg leading-relaxed">
        {t.rich('hello', {
          name,
          bold: (chunks) => <span className="font-semibold text-black">{chunks}</span>,
        })}
        {' '}({t('notYou', { email: customer?.email ?? '' })} <LogoutLink />)
      </p>

      <p className="text-[#6C7275] text-lg leading-relaxed">
        {t('dashboardDescription')}
      </p>
    </div>
  );
}
