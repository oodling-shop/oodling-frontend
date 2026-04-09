"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { LogoutButton } from "./logout-button";

const menuItems = [
  { label: "Dashboard", href: "/my-account" },
  { label: "Orders", href: "/my-account/orders" },
  { label: "Addresses", href: "/my-account/addresses" },
  { label: "Account details", href: "/my-account/details" },
  { label: "Wishlist", href: "/my-account/wishlist" },
];

const STORAGE_KEY = "account_profile_image";

interface AccountSidebarProps {
  firstName: string;
  lastName: string;
}

export function AccountSidebar({ firstName, lastName }: AccountSidebarProps) {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProfileImage(stored);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem(STORAGE_KEY, dataUrl);
      setProfileImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("") || "?";

  return (
    <div className="flex flex-col space-y-6">
      {/* Profile row: avatar left, logout right (mobile) */}
      <div className="flex items-center justify-between md:justify-start">
        <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#171717] flex items-center justify-center">
              <span className="text-white text-lg md:text-2xl font-semibold">{initials}</span>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-[#171717] rounded-full border border-white shadow-sm hover:bg-black transition-colors"
            aria-label="Upload profile picture"
          >
            <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Logout — mobile only, top-right of profile row */}
        <LogoutButton
          showIcon={true}
          className="md:hidden flex items-center gap-1.5 text-sm font-medium text-[#141718] hover:opacity-70"
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col w-full">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base md:text-lg transition-colors py-3 block w-full border-b",
                isActive
                  ? "font-semibold text-black border-black"
                  : "text-[#6C7275] hover:text-black border-transparent"
              )}
            >
              {item.label}
            </Link>
          );
        })}

        {/* Logout — desktop only, inside nav */}
        <LogoutButton
          showIcon={false}
          className="hidden md:block text-lg text-left py-3 text-[#6C7275] hover:text-black border-b border-transparent"
        />
      </nav>
    </div>
  );
}
