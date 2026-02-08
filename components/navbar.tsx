'use client';

import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/helpers';
import { CaretDown, MagnifyingGlass, User, ShoppingBag } from '@phosphor-icons/react';

export const Navbar = () => {
  const scrolled = useScroll();

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border py-4'
          : 'bg-transparent py-6'
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Nayzak Logo"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Shop', 'Product', 'Pages'].map((item) => (
            <div key={item} className="group relative">
              <Link
                href="#"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item}
                <CaretDown
                  size={14}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="text-foreground hover:text-primary transition-colors"
            aria-label="Search"
          >
            <MagnifyingGlass size={24} />
          </button>

          <Link
            href="/account"
            className="text-foreground hover:text-primary transition-colors"
            aria-label="Account"
          >
            <User size={24} />
          </Link>

          <Link
            href="/cart"
            className="relative text-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={24} />
            <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background ring-2 ring-background">
              2
            </span>
          </Link>
        </div>
      </Container>
    </nav>
  );
};
