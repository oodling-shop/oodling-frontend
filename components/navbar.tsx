'use client';

import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/helpers';
import { CaretDown, MagnifyingGlass, User, ShoppingBag } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';
import { MobileMenu } from './mobile-menu';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import { SearchPopup } from './search-popup';
import { useTranslations } from 'next-intl';

type MegamenuColumn = { title: string; links: { name: string; href: string }[] };
type MegamenuData = {
  columns: MegamenuColumn[];
  images: { titleKey: string; image: string; href: string }[];
};

const MEGAMENUS: Record<string, MegamenuData> = {
  home: {
    columns: [
      {
        title: 'collections',
        links: [
          { name: 'newArrivals', href: '/products?sort=new-arrivals' },
          { name: 'bestSellers', href: '/products?sort=best-sellers' },
          { name: 'trendingNow', href: '/products?tag=trending' },
          { name: 'specialOffers', href: '/products?tag=sale' },
          { name: 'limitedEdition', href: '/products?tag=limited' },
        ],
      },
      {
        title: 'discover',
        links: [
          { name: 'aboutNayzak', href: '/about-us' },
          { name: 'ourSustainability', href: '/sustainability' },
          { name: 'theJournal', href: '/journal' },
          { name: 'storeLocator', href: '/contact-us' },
          { name: 'sizeGuide', href: '/faq' },
        ],
      },
      {
        title: 'support',
        links: [
          { name: 'shippingInfo', href: '/faq' },
          { name: 'returnsExchanges', href: '/faq' },
          { name: 'helpCenter', href: '/faq' },
          { name: 'trackOrder', href: '/my-account' },
          { name: 'careers', href: '/careers' },
        ],
      },
    ],
    images: [
      { titleKey: 'lookbook', image: '/images/megamenu/lookbook.png', href: '/journal' },
      { titleKey: 'pants', image: '/images/megamenu/pants.png', href: '/products?category=pants' },
    ],
  },
  shop: {
    columns: [
      {
        title: 'apparel',
        links: [
          { name: 'allClothing', href: '/products?category=all-clothing' },
          { name: 'tops', href: '/products?category=tops' },
          { name: 'bottoms', href: '/products?category=bottoms' },
          { name: 'dresses', href: '/products?category=dresses' },
          { name: 'outerwear', href: '/products?category=outerwear' },
        ],
      },
      {
        title: 'accessories',
        links: [
          { name: 'bagsTotes', href: '/products?category=bags' },
          { name: 'beltsGoods', href: '/products?category=belts' },
          { name: 'hatsHeadwear', href: '/products?category=hats' },
          { name: 'jewelry', href: '/products?category=jewelry' },
          { name: 'scarves', href: '/products?category=scarves' },
        ],
      },
      {
        title: 'shoes',
        links: [
          { name: 'allShoes', href: '/products?category=shoes' },
          { name: 'sneakers', href: '/products?category=sneakers' },
          { name: 'boots', href: '/products?category=boots' },
          { name: 'loafers', href: '/products?category=loafers' },
          { name: 'sandals', href: '/products?category=sandals' },
        ],
      },
    ],
    images: [
      { titleKey: 'bags', image: '/images/megamenu/bags.png', href: '/products?category=bags' },
    ],
  },
  product: {
    columns: [
      {
        title: 'productTypes',
        links: [
          { name: 'simpleProduct', href: '/products/simple-product' },
          { name: 'variableProduct', href: '/products/variable-product' },
          { name: 'digitalProduct', href: '/products/digital-product' },
          { name: 'affiliateProduct', href: '/products/affiliate-product' },
          { name: 'groupedProduct', href: '/products/grouped-product' },
        ],
      },
      {
        title: 'popularItems',
        links: [
          { name: 'signatureBag', href: '/products/signature-bag' },
          { name: 'canvasTote', href: '/products/canvas-tote' },
          { name: 'leatherWallet', href: '/products/leather-wallet' },
          { name: 'modernWatch', href: '/products/modern-watch' },
          { name: 'silkScarf', href: '/products/silk-scarf' },
        ],
      },
      {
        title: 'collections',
        links: [
          { name: 'essentialCollection', href: '/products?tag=essentials' },
          { name: 'modernMinimalist', href: '/products?tag=minimalist' },
          { name: 'activeLiving', href: '/products?tag=active' },
          { name: 'premiumCraft', href: '/products?tag=premium' },
          { name: 'sustainable', href: '/products?tag=sustainable' },
        ],
      },
    ],
    images: [
      { titleKey: 'pants', image: '/images/megamenu/pants.png', href: '/products?category=pants' },
    ],
  },
  pages: {
    columns: [
      {
        title: 'aboutNayzakSection',
        links: [
          { name: 'ourStory', href: '/about-us' },
          { name: 'sustainability', href: '/about-us' },
          { name: 'journal', href: '/about-us' },
          { name: 'careers', href: '/about-us' },
          { name: 'press', href: '/about-us' },
        ],
      },
      {
        title: 'customerCare',
        links: [
          { name: 'trackOrder', href: '/my-account' },
          { name: 'helpFaq', href: '/faq' },
          { name: 'shippingInfo', href: '/faq' },
          { name: 'returnsExchanges', href: '/faq' },
          { name: 'sizeGuide', href: '/faq' },
        ],
      },
      {
        title: 'contact',
        links: [
          { name: 'storeLocator', href: '/contact-us' },
          { name: 'wholesale', href: '/contact-us' },
          { name: 'generalInquiries', href: '/contact-us' },
          { name: 'collaborations', href: '/contact-us' },
        ],
      },
    ],
    images: [],
  },
};

const NAV_KEYS = ['home', 'shop', 'product', 'pages'] as const;

export const Navbar = () => {
  const t = useTranslations('navbar');
  const scrolled = useScroll();
  const [activeMegamenu, setActiveMegamenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();
  const { isLoggedIn } = useAuth();
  const cartCount = cart?.totalQuantity ?? 0;
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMegamenu(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMegamenu(null);
      }
    };
    if (activeMegamenu) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeMegamenu]);

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-300',
        scrolled ? 'pt-4' : 'pt-6',
        activeMegamenu ? 'pb-0' : scrolled ? 'pb-4' : 'pb-6',
        activeMegamenu
          ? 'bg-white border-b border-gray-100'
          : scrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
      )}
      onMouseLeave={() => setActiveMegamenu(null)}
    >
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt={t('logoAlt')}
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_KEYS.map((key) => (
            <div
              key={key}
              className="group relative"
              onMouseEnter={() => setActiveMegamenu(key)}
            >
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMegamenu(activeMegamenu === key ? null : key);
                }}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  activeMegamenu === key
                    ? 'text-foreground'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                {t(`nav.${key}`)}
                <CaretDown
                  size={14}
                  weight="bold"
                  className={cn(
                    'transition-transform duration-200',
                    activeMegamenu === key ? 'rotate-180' : ''
                  )}
                />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden md:flex text-foreground hover:text-primary transition-colors h-auto w-auto p-0 hover:bg-transparent"
            aria-label={t('search')}
            onClick={() => setIsSearchOpen(true)}
          >
            <MagnifyingGlass size={24} />
          </Button>

          {isLoggedIn && (
            <Link
              href="/cart"
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label={t('cart')}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              href="/my-account"
              className="hidden md:block text-foreground hover:text-primary transition-colors"
              aria-label={t('account')}
            >
              <User size={24} />
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-[#141718] text-white px-4 py-2 hover:bg-[#141718]/90 transition-colors"
              >
                {t('signUp')}
              </Link>
            </div>
          )}

          <MobileMenu />
        </div>
      </Container>

      <AnimatePresence>
        {activeMegamenu && MEGAMENUS[activeMegamenu] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-50 bg-white shadow-sm border-b border-gray-100"
          >
            <Container>
              <div className="flex items-start gap-12 py-10">
                <div className="flex gap-16 flex-1">
                  {MEGAMENUS[activeMegamenu].columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-6">
                      <h3 className="text-sm font-bold text-black tracking-wider">
                        {t(`megamenu.${column.title}`)}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {column.links.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            className="text-sm font-normal text-gray-500 hover:text-black transition-colors whitespace-nowrap"
                            onClick={() => setActiveMegamenu(null)}
                          >
                            {t(`megamenu.${link.name}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {MEGAMENUS[activeMegamenu].images.length > 0 && (
                  <div className="flex gap-4 shrink-0">
                    {MEGAMENUS[activeMegamenu].images.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="group/category flex flex-col"
                        onClick={() => setActiveMegamenu(null)}
                      >
                        <div className="relative w-50 h-64 bg-gray-50 overflow-hidden">
                          <Image
                            src={category.image}
                            alt={t(`megamenu.${category.titleKey}`)}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/category:scale-110"
                          />
                          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm py-2 px-3 shadow-sm transform transition-transform group-hover/category:-translate-y-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {t(`megamenu.${category.titleKey}`)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </nav>
  );
};
