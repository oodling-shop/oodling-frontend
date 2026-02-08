'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  MagnifyingGlass,
  CaretDown,
  ShoppingBag,
  Heart,
  List,
  X,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  EnvelopeSimple,
} from '@phosphor-icons/react';
import { cn } from '@/helpers';

// Navigation items
const navItems = [
  { label: 'Home', hasDropdown: true },
  { label: 'Shop', hasDropdown: true },
  { label: 'Product', hasDropdown: true },
  { label: 'Pages', hasDropdown: true },
];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="md:hidden text-foreground hover:text-primary transition-colors focus:outline-none"
          aria-label="Menu"
        >
          <List size={24} weight="regular" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[90%] sm:max-w-[383px] p-0 flex flex-col bg-white border-none shadow-premium h-full outline-none [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Directory Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Access site navigation, search, and account settings.
        </SheetDescription>

        {/* Header: Logo and Close Button */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Nayzak Logo"
              width={120}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X size={24} weight="regular" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none pb-10">
          <div className="px-6 space-y-7">
            {/* Search Bar */}
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg text-[15px] font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
              />
              <MagnifyingGlass
                size={20}
                weight="regular"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
            </div>

            {/* Navigation Items */}
            <nav className="space-y-0">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => item.hasDropdown && toggleExpanded(item.label)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className="text-base font-medium text-gray-900 group-hover:text-black transition-colors">
                      {item.label}
                    </span>
                    {item.hasDropdown && (
                      <CaretDown
                        size={16}
                        weight="bold"
                        className={cn(
                          'text-gray-900 transition-transform duration-300',
                          expandedItem === item.label && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                </div>
              ))}
            </nav>

            <div className="space-y-0">
              {/* Cart Section */}
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-4"
              >
                <span className="text-base font-normal text-gray-400">Cart</span>
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} weight="regular" className="text-gray-900" />
                  <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-gray-950 text-white text-[11px] font-bold">
                    2
                  </span>
                </div>
              </Link>

              {/* Wishlist Section */}
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-4"
              >
                <span className="text-base font-normal text-gray-400">Wishlist</span>
                <div className="flex items-center gap-3">
                  <Heart size={24} weight="regular" className="text-gray-900" />
                  <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-gray-950 text-white text-[11px] font-bold">
                    6
                  </span>
                </div>
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1">
              {/* Currency Selector */}
              <div className="flex items-center justify-between py-3">
                <span className="text-base font-normal text-gray-400">Currency</span>
                <button className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  USD
                  <CaretDown size={14} weight="bold" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between py-3">
                <span className="text-base font-normal text-gray-400">Language</span>
                <button className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  English
                  <CaretDown size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button className="w-full h-12 bg-gray-950 text-white text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors active:scale-[0.98]">
                Sign in
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4">
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Facebook"
              >
                <FacebookLogo size={20} weight="fill" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo size={22} weight="bold" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Twitter"
              >
                <TwitterLogo size={20} weight="fill" />
              </Link>
              <div
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Email"
              >
                <EnvelopeSimple size={22} weight="bold" />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

