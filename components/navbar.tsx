'use client';

import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/helpers';
import { CaretDown, MagnifyingGlass, User, ShoppingBag } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { MobileMenu } from './mobile-menu';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/cart-provider';

// Megamenu data - organized by columns exactly as shown in Figma
// Megamenu data - organized by category
const MEGAMENUS: Record<string, {
  columns: { title: string; links: { name: string; href: string }[] }[];
  images: { title: string; image: string; href: string }[];
}> = {
  Home: {
    columns: [
      {
        title: 'COLLECTIONS',
        links: [
          { name: 'New Arrivals', href: '/products?sort=new-arrivals' },
          { name: 'Best Sellers', href: '/products?sort=best-sellers' },
          { name: 'Trending Now', href: '/products?tag=trending' },
          { name: 'Special Offers', href: '/products?tag=sale' },
          { name: 'Limited Edition', href: '/products?tag=limited' },
        ],
      },
      {
        title: 'DISCOVER',
        links: [
          { name: 'About Nayzak', href: '/about-us' },
          { name: 'Our Sustainability', href: '/sustainability' },
          { name: 'The Journal', href: '/journal' },
          { name: 'Store Locator', href: '/contact-us' },
          { name: 'Size Guide', href: '/faq' },
        ],
      },
      {
        title: 'SUPPORT',
        links: [
          { name: 'Shipping Info', href: '/faq' },
          { name: 'Returns & Exchanges', href: '/faq' },
          { name: 'Help Center', href: '/faq' },
          { name: 'Track Order', href: '/my-account' },
          { name: 'Careers', href: '/careers' },
        ],
      },
    ],
    images: [
      {
        title: 'Lookbook',
        image: '/images/megamenu/lookbook.png',
        href: '/journal',
      },
      {
        title: 'Pants',
        image: '/images/megamenu/pants.png',
        href: '/products?category=pants',
      },
    ],
  },
  Shop: {
    columns: [
      {
        title: 'APPAREL',
        links: [
          { name: 'All Clothing', href: '/products?category=all-clothing' },
          { name: 'Tops', href: '/products?category=tops' },
          { name: 'Bottoms', href: '/products?category=bottoms' },
          { name: 'Dresses', href: '/products?category=dresses' },
          { name: 'Outerwear', href: '/products?category=outerwear' },
        ],
      },
      {
        title: 'ACCESSORIES',
        links: [
          { name: 'Bags & Totes', href: '/products?category=bags' },
          { name: 'Belts & Small Goods', href: '/products?category=belts' },
          { name: 'Hats & Headwear', href: '/products?category=hats' },
          { name: 'Jewelry', href: '/products?category=jewelry' },
          { name: 'Scarves', href: '/products?category=scarves' },
        ],
      },
      {
        title: 'SHOES',
        links: [
          { name: 'All Shoes', href: '/products?category=shoes' },
          { name: 'Sneakers', href: '/products?category=sneakers' },
          { name: 'Boots', href: '/products?category=boots' },
          { name: 'Loafers', href: '/products?category=loafers' },
          { name: 'Sandals', href: '/products?category=sandals' },
        ],
      },
    ],
    images: [
      {
        title: 'Bags',
        image: '/images/megamenu/bags.png',
        href: '/products?category=bags',
      },
    ],
  },
  Product: {
    columns: [
      {
        title: 'PRODUCT TYPES',
        links: [
          { name: 'Simple Product', href: '/products/simple-product' },
          { name: 'Variable Product', href: '/products/variable-product' },
          { name: 'Digital Product', href: '/products/digital-product' },
          { name: 'Affiliate Product', href: '/products/affiliate-product' },
          { name: 'Grouped Product', href: '/products/grouped-product' },
        ],
      },
      {
        title: 'POPULAR ITEMS',
        links: [
          { name: 'Signature Bag', href: '/products/signature-bag' },
          { name: 'Canvas Tote', href: '/products/canvas-tote' },
          { name: 'Leather Wallet', href: '/products/leather-wallet' },
          { name: 'Modern Watch', href: '/products/modern-watch' },
          { name: 'Silk Scarf', href: '/products/silk-scarf' },
        ],
      },
      {
        title: 'COLLECTIONS',
        links: [
          { name: 'Essential Collection', href: '/products?tag=essentials' },
          { name: 'Modern Minimalist', href: '/products?tag=minimalist' },
          { name: 'Active Living', href: '/products?tag=active' },
          { name: 'Premium Craft', href: '/products?tag=premium' },
          { name: 'Sustainable', href: '/products?tag=sustainable' },
        ],
      },
    ],
    images: [
      {
        title: 'Pants',
        image: '/images/megamenu/pants.png',
        href: '/products?category=pants',
      },
    ],
  },
  Pages: {
    columns: [
      {
        title: 'ABOUT NAYZAK',
        links: [
          { name: 'Our Story', href: '/about-us' },
          { name: 'Sustainability', href: '/about-us' },
          { name: 'Journal', href: '/about-us' },
          { name: 'Careers', href: '/about-us' },
          { name: 'Press', href: '/about-us' },
        ],
      },
      {
        title: 'CUSTOMER CARE',
        links: [
          { name: 'Track Order', href: '/my-account' },
          { name: 'Help & FAQ', href: '/faq' },
          { name: 'Shipping Info', href: '/faq' },
          { name: 'Returns & Exchanges', href: '/faq' },
          { name: 'Size Guide', href: '/faq' },
        ],
      },
      {
        title: 'CONTACT',
        links: [
          { name: 'Store Locator', href: '/contact-us' },
          { name: 'Wholesale', href: '/contact-us' },
          { name: 'General Inquiries', href: '/contact-us' },
          { name: 'Collaborations', href: '/contact-us' },
        ],
      },
    ],
    images: [],
  },
};


export const Navbar = () => {
  const scrolled = useScroll();
  const [activeMegamenu, setActiveMegamenu] = useState<string | null>(null);
  const { cart } = useCart();
  const cartCount = cart?.totalQuantity ?? 0;

  // Close megamenu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegamenu(null);
      }
    };

    if (activeMegamenu) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [activeMegamenu]);

  const handleMouseEnter = (item: string) => {
    setActiveMegamenu(item);
  };


  const handleMouseLeave = () => {
    setActiveMegamenu(null);
  };

  const handleClick = (item: string) => {
    setActiveMegamenu(activeMegamenu === item ? null : item);
  };


  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        scrolled
          ? cn('bg-background/80 backdrop-blur-md border-b border-border pt-4', activeMegamenu ? 'pb-0' : 'pb-4')
          : cn('bg-transparent pt-6', activeMegamenu ? 'pb-0' : 'pb-6')
      )}
      onMouseLeave={handleMouseLeave}
    >
      <Container className="flex items-center justify-between gap-4">
        {/* Left: Hamburger Menu (Mobile) */}
        <MobileMenu />

        {/* Logo - Centered on mobile, left-aligned on desktop */}
        <Link href="/" className="flex-shrink-0 md:order-none order-2">
          <Image
            src="/images/logo.png"
            alt="Nayzak Logo"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Shop', 'Product', 'Pages'].map((item) => (
            <div
              key={item}
              className="group relative"
              onMouseEnter={() => handleMouseEnter(item)}
            >
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item);
                }}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  activeMegamenu === item
                    ? 'text-foreground'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                {item}
                <CaretDown
                  size={14}
                  weight="bold"
                  className={cn(
                    'transition-transform duration-200',
                    activeMegamenu === item ? 'rotate-180' : ''
                  )}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Right Icons - Order 3 on mobile to appear last */}
        <div className="flex items-center gap-4 md:gap-6 order-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-primary transition-colors h-auto w-auto p-0 hover:bg-transparent"
            aria-label="Search"
          >
            <MagnifyingGlass size={24} />
          </Button>

          <Link
            href="/cart"
            className="relative text-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background ring-2 ring-background">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/my-account"
            className="hidden md:block text-foreground hover:text-primary transition-colors"
            aria-label="Account"
          >
            <User size={24} />
          </Link>
        </div>
      </Container>

      {/* Megamenu - positioned relative to nav, spans full width */}
      {activeMegamenu && MEGAMENUS[activeMegamenu] && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setActiveMegamenu(null)}
          />

          {/* Megamenu panel */}
          <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-sm border-b border-gray-100">
            <Container>
              <div className="flex items-start gap-12 py-10">
                {/* Left side - links in 3 columns */}
                <div className="flex gap-16 flex-1">
                  {MEGAMENUS[activeMegamenu].columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-6">
                      <h3 className="text-sm font-bold text-black tracking-wider">{column.title}</h3>
                      <div className="flex flex-col gap-4">
                        {column.links.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            className="text-sm font-normal text-gray-500 hover:text-black transition-colors whitespace-nowrap"
                            onClick={() => setActiveMegamenu(null)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right side - images */}
                {MEGAMENUS[activeMegamenu].images.length > 0 && (
                  <div className="flex gap-4 shrink-0">
                    {MEGAMENUS[activeMegamenu].images.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="group/category flex flex-col"
                        onClick={() => setActiveMegamenu(null)}
                      >
                        {/* Image container */}
                        <div className="relative w-50 h-64 bg-gray-50 overflow-hidden">
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/category:scale-110"
                          />
                          {/* Label overlay at bottom */}
                          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm py-2 px-3 shadow-sm transform transition-transform group-hover/category:-translate-y-1">
                            <span className="text-sm font-semibold text-gray-900">{category.title}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </div>
        </>
      )}

    </nav>
  );
};
