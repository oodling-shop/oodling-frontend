"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/my-account" },
  { label: "Orders", href: "/my-account/orders" },
  { label: "Addresses", href: "/my-account/addresses" },
  { label: "Account details", href: "/my-account/details" },
  { label: "Wishlist", href: "/my-account/wishlist" },
  { label: "Logout", href: "/logout" },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center md:items-start space-y-8">
      <div className="relative w-24 h-24">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
        <button className="absolute bottom-0 right-0 p-1.5 bg-[#171717] rounded-full border border-white shadow-sm hover:bg-black transition-colors">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      <nav className="flex flex-col items-center md:items-start space-y-6 w-full">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="w-full">
              <Link
                href={item.href}
                className={cn(
                  "text-lg transition-colors pb-2 block w-full",
                  isActive
                    ? "font-semibold text-black border-b border-black"
                    : "text-[#6C7275] hover:text-black border-b border-transparent"
                )}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
