"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

const menuItems = [
  { label: "Dashboard", href: "/my-account" },
  { label: "Orders", href: "/my-account/orders" },
  { label: "Addresses", href: "/my-account/addresses" },
  { label: "Account details", href: "/my-account/details" },
  { label: "Wishlist", href: "/my-account/wishlist" },
  { label: "Logout", href: "/logout" },
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
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("") || "?";

  return (
    <div className="flex flex-col items-center md:items-start space-y-8">
      <div className="relative w-24 h-24">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[#171717] flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">{initials}</span>
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-1.5 bg-[#171717] rounded-full border border-white shadow-sm hover:bg-black transition-colors"
          aria-label="Upload profile picture"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
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
