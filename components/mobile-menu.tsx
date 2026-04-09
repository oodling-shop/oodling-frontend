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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/helpers';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';

// Navigation items with sub-links (mirrors desktop megamenu)
const navItems: {
  label: string;
  hasDropdown: boolean;
  links?: { name: string; href: string }[];
}[] = [
  {
    label: 'Home',
    hasDropdown: true,
    links: [
      { name: 'New Arrivals', href: '/products?sort=new-arrivals' },
      { name: 'Best Sellers', href: '/products?sort=best-sellers' },
      { name: 'Trending Now', href: '/products?tag=trending' },
      { name: 'Special Offers', href: '/products?tag=sale' },
      { name: 'About Nayzak', href: '/about-us' },
      { name: 'Help Center', href: '/faq' },
    ],
  },
  {
    label: 'Shop',
    hasDropdown: true,
    links: [
      { name: 'All Clothing', href: '/products?category=all-clothing' },
      { name: 'Tops', href: '/products?category=tops' },
      { name: 'Bottoms', href: '/products?category=bottoms' },
      { name: 'Bags & Totes', href: '/products?category=bags' },
      { name: 'All Shoes', href: '/products?category=shoes' },
      { name: 'Jewelry', href: '/products?category=jewelry' },
    ],
  },
  {
    label: 'Product',
    hasDropdown: true,
    links: [
      { name: 'Simple Product', href: '/products/simple-product' },
      { name: 'Variable Product', href: '/products/variable-product' },
      { name: 'Digital Product', href: '/products/digital-product' },
      { name: 'Affiliate Product', href: '/products/affiliate-product' },
      { name: 'Grouped Product', href: '/products/grouped-product' },
    ],
  },
  {
    label: 'Pages',
    hasDropdown: true,
    links: [
      { name: 'Our Story', href: '/about-us' },
      { name: 'Help & FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/faq' },
      { name: 'Track Order', href: '/my-account' },
      { name: 'Contact Us', href: '/contact-us' },
    ],
  },
];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { cart } = useCart();
  const { isLoggedIn } = useAuth();
  const cartCount = cart?.totalQuantity ?? 0;

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:text-primary transition-colors focus:outline-none h-auto w-auto p-0 hover:bg-transparent"
          aria-label="Menu"
        >
          <List size={24} weight="regular" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[90%] sm:max-w-95.75 p-0 flex flex-col bg-white border-none shadow-premium h-full outline-none [&>button]:hidden"
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-foreground hover:text-primary transition-colors focus:outline-none h-auto w-auto p-0 hover:bg-transparent"
            aria-label="Close menu"
          >
            <X size={24} weight="regular" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none pb-10">
          <div className="px-6 space-y-7">
            {/* Search Bar */}
            <div className="relative mt-2">
              <Input
                type="text"
                placeholder="Search"
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg text-[15px] font-normal text-gray-900 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 transition-all shadow-none"
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
                  <Button
                    variant="ghost"
                    onClick={() => item.hasDropdown && toggleExpanded(item.label)}
                    className="w-full flex items-center justify-between py-4 text-left group h-auto px-0 hover:bg-transparent rounded-none"
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
                  </Button>
                  {item.hasDropdown && expandedItem === item.label && item.links && (
                    <div className="pb-3 space-y-1">
                      {item.links.map((link) => (
                        <Link
                          key={link.href + link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 pl-3 text-sm font-normal text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {isLoggedIn && (
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
                    {cartCount > 0 && (
                      <span className="flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-gray-950 text-white text-[11px] font-bold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Wishlist Section */}
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-base font-normal text-gray-400">Wishlist</span>
                  <Heart size={24} weight="regular" className="text-gray-900" />
                </Link>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 space-y-1">
              {/* Currency Selector */}
              <div className="flex items-center justify-between py-3">
                <span className="text-base font-normal text-gray-400">Currency</span>
                <Button variant="ghost" className="flex items-center gap-2 text-base font-semibold text-gray-900 h-auto p-0 hover:bg-transparent">
                  USD
                  <CaretDown size={14} weight="bold" />
                </Button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between py-3">
                <span className="text-base font-normal text-gray-400">Language</span>
                <Button variant="ghost" className="flex items-center gap-2 text-base font-semibold text-gray-900 h-auto p-0 hover:bg-transparent">
                  English
                  <CaretDown size={14} weight="bold" />
                </Button>
              </div>
            </div>

            {/* Auth Button */}
            <div className="pt-2">
              {isLoggedIn ? (
                <Link href="/my-account" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 bg-gray-950 text-white text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors active:scale-[0.98]">
                    My Account
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 bg-gray-950 text-white text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors active:scale-[0.98]">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-lg transition-colors active:scale-[0.98]">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
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

