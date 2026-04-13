'use client';

import { useState, useRef, useEffect } from 'react';
import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/cn';
import { useAuth } from '@/providers/auth-provider';
import { useLocale } from '@/providers/locale-provider';
import { getLocaleFlag } from '@/lib/shopify/locale';
import { useTranslations } from 'next-intl';

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

const LocaleDropdown = () => {
  const { locale, setLocale, locales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = locales.find((l) => l.isoCode === locale) ?? locales[0];
  if (!current) return null;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 hover:text-foreground transition-colors group h-auto p-0 hover:bg-transparent"
      >
        <span className="text-base">{getLocaleFlag(current.isoCode)}</span>
        <span>{current.endonymName}</span>
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </Button>

      {isOpen && locales.length > 1 && (
        <div className="absolute bottom-full mb-2 left-0 min-w-35 bg-background border border-border rounded-md shadow-md overflow-hidden z-10">
          {locales.map((l) => (
            <button
              key={l.isoCode}
              onClick={() => {
                setLocale(l.isoCode);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors',
                l.isoCode === locale ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              <span>{getLocaleFlag(l.isoCode)}</span>
              <span>{l.endonymName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Footer = () => {
  const { isLoggedIn } = useAuth();
  const t = useTranslations('footer');

  const footerSections = [
    {
      title: t('sections.shop'),
      links: isLoggedIn
        ? [
            { label: t('shop.myAccount'), href: '/my-account' },
            { label: t('shop.wishlist'), href: '/my-account/wishlist' },
            { label: t('shop.cart'), href: '/cart' },
          ]
        : [
            { label: t('shop.signIn'), href: '/sign-in' },
            { label: t('shop.signUp'), href: '/sign-up' },
          ],
    },
    {
      title: t('sections.information'),
      links: [
        { label: t('information.shippingPolicy'), href: '#' },
        { label: t('information.returnsRefunds'), href: '#' },
        { label: t('information.cookiesPolicy'), href: '#' },
        { label: t('information.frequentlyAsked'), href: '/faq' },
      ],
    },
    {
      title: t('sections.company'),
      links: [
        { label: t('company.aboutUs'), href: '/about-us' },
        { label: t('company.privacyPolicy'), href: '/privacy-policy' },
        { label: t('company.termsConditions'), href: '/terms-and-conditions' },
        { label: t('company.contactUs'), href: '/contact-us' },
      ],
    },
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
                alt={t('logoAlt')}
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {t('tagline')}
            </p>
            <div className="flex gap-3 mt-2">
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Mail} href="#" />
            </div>
          </div>

          {/* Desktop Links Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8 md:gap-12 lg:gap-16 flex-1 lg:max-w-3xl">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-foreground transition-colors inline-block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Links Accordion */}
          <div className="block md:hidden w-full border-t border-border mt-4">
            {footerSections.map((section) => (
              <AccordionItem key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p className="text-center md:text-left">{t('copyright')}</p>

          <div className="flex items-center gap-6">
            <LocaleDropdown />
            <Button variant="ghost" className="flex items-center gap-2 hover:text-foreground transition-colors group h-auto p-0 hover:bg-transparent">
              <span>{t('usd')}</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
};
