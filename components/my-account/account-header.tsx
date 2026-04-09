"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/my-account": "My account",
  "/my-account/orders": "Orders",
  "/my-account/addresses": "Addresses",
  "/my-account/details": "Account details",
  "/my-account/wishlist": "Wishlist",
};

export function AccountHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "My account";

  return (
    <h1 className="hidden md:block text-4xl md:text-5xl font-medium text-center mb-16">
      {title}
    </h1>
  );
}
