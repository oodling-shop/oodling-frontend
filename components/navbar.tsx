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
const homepageLinks = [
  // Column 1
  ['Homepage 01', 'Homepage 02', 'Homepage 03', 'Homepage 04', 'Homepage 05'],
  // Column 2
  ['Homepage 06', 'Homepage 07', 'Homepage 08', 'Homepage 09', 'Homepage 10'],
  // Column 3
  ['Homepage 06', 'Homepage 07', 'Homepage 08', 'Homepage 09', 'Homepage 10'],
];

// Category images for megamenu
// Note: Replace these with actual fashion photography images from Figma design
// - pants.jpg/png: Model wearing green pants/dress (portrait orientation)
// - bags.jpg/png: Model wearing/carrying brown leather bag (portrait orientation)
const categoryImages = [
  {
    title: 'Pants',
    image: '/images/megamenu/pants.png', // TODO: Add fashion model image from Figma
    href: '/products?category=pants',
  },
  {
    title: 'Bags',
    image: '/images/megamenu/bags.png', // TODO: Add fashion model image from Figma
    href: '/products?category=bags',
  },
];

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
    if (item === 'Home') {
      setActiveMegamenu(item);
    }
  };

  const handleMouseLeave = () => {
    setActiveMegamenu(null);
  };

  const handleClick = (item: string) => {
    if (item === 'Home') {
      setActiveMegamenu(activeMegamenu === item ? null : item);
    }
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

      {/* Megamenu for Home - positioned relative to nav, spans full width */}
      {activeMegamenu === 'Home' && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setActiveMegamenu(null)}
          />

          {/* Megamenu panel */}
          <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-sm">
            <Container>
              <div className="flex items-start gap-12 py-10">
                {/* Left side - Homepage links in 3 columns */}
                <div className="flex gap-16 flex-1">
                  {homepageLinks.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4">
                      {column.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={`/homepage-${String(colIndex === 0 ? linkIndex + 1 : colIndex * 5 + linkIndex + 1).padStart(2, '0')}`}
                          className="text-sm font-normal text-gray-800 hover:text-black transition-colors whitespace-nowrap"
                          onClick={() => setActiveMegamenu(null)}
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Right side - Category images */}
                <div className="flex gap-4 shrink-0">
                  {categoryImages.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className="group/category flex flex-col"
                      onClick={() => setActiveMegamenu(null)}
                    >
                      {/* Image container */}
                      <div className="relative w-50 h-65 bg-gray-100 overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/category:scale-105"
                        />
                        {/* Label overlay at bottom */}
                        <div className="absolute bottom-3 left-3 right-3 bg-white py-2 px-3">
                          <span className="text-sm font-medium text-gray-900">{category.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </>
      )}
    </nav>
  );
};
