'use client';

import { useState } from 'react';
import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/cn';
import { useAuth } from '@/providers/auth-provider';

const SHOP_LINKS_LOGGED_IN = [
  { label: 'My account', href: '/my-account' },
  { label: 'Wishlist', href: '/my-account/wishlist' },
  { label: 'Cart', href: '/cart' },
];

const SHOP_LINKS_LOGGED_OUT = [
  { label: 'Sign in', href: '/sign-in' },
  { label: 'Sign up', href: '/sign-up' },
];

const OTHER_SECTIONS = [
  {
    title: 'Information',
    links: [
      { label: 'Shipping Policy', href: '#' },
      { label: 'Returns & Refunds', href: '#' },
      { label: 'Cookies Policy', href: '#' },
      { label: 'Frequently asked', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about-us' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
  },
];

const SocialIcon = ({ Icon, href }: { Icon: any; href: string }) => (
  <Link
    href={href}
    className="p-2.5 rounded-full border border-border bg-background hover:bg-muted hover:text-foreground text-muted-foreground transition-colors group"
  >
    <Icon
      size={18}
      strokeWidth={2}
      className="group-hover:scale-110 transition-transform duration-200"
    />
  </Link>
);

const AccordionItem = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-semibold text-foreground transition-all hover:text-primary h-auto px-0 hover:bg-transparent rounded-none"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn(
            'text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-foreground transition-colors block py-0.5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  const { isLoggedIn } = useAuth();

  const footerSections = [
    {
      title: 'Shop',
      links: isLoggedIn ? SHOP_LINKS_LOGGED_IN : SHOP_LINKS_LOGGED_OUT,
    },
    ...OTHER_SECTIONS,
  ];

  return (
    <footer className="bg-background text-foreground py-12 lg:py-16 border-t border-border mt-auto">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-12 lg:mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Nayzak Logo"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Phosf luorescently engage worldwide method process shopping.
            </p>
            <div className="flex gap-3 mt-2">
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Mail} href="#" />
            </div>
          </div>

          {/* Desktop Links Grid (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-3 gap-8 md:gap-12 lg:gap-16 flex-1 lg:max-w-3xl">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-foreground transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Links Accordion (Hidden on Desktop) */}
          <div className="block md:hidden w-full border-t border-border mt-4">
            {footerSections.map((section) => (
              <AccordionItem
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            © 2088 Nayzak Design
          </p>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="flex items-center gap-2 hover:text-foreground transition-colors group h-auto p-0 hover:bg-transparent">
              <span className="text-base group-hover:scale-110 transition-transform">
                🇺🇸
              </span>
              <span>English</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 hover:text-foreground transition-colors group h-auto p-0 hover:bg-transparent">
              <span>USD</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
};
