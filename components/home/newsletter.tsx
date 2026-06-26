"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '../container';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const Newsletter = () => {
  const t = useTranslations('newsletter');

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="rounded-lg md:rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 w-full shadow-sm">

          {/* Right Side (Desktop) / Top Side (Mobile): Image and Glow */}
          <div className="order-1 lg:order-2 relative min-h-[350px] overflow-hidden">
            <Image
              src="/images/shoes/kyrie_7.png"
              alt="Nike Basketball Shoe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Left Side (Desktop) / Bottom Side (Mobile): Content */}
          <div className="order-2 lg:order-1 bg-[#F5F5F5] p-8 md:p-16 lg:p-20 flex flex-col justify-center gap-8 lg:gap-10 z-10">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-medium tracking-tight text-[#1A1A1A] leading-[1.15]">
                {t('heading')} <br />
                <span className="block md:inline lg:block">{t('subheading')}</span>
              </h2>
            </div>

            <form className="w-full max-w-md mx-auto lg:mx-0 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex items-center border-b border-black/10 pb-2 group transition-all focus-within:border-black/30">
                <Mail className="w-6 h-6 text-black/40 mr-3 group-focus-within:text-black transition-colors" />
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="bg-transparent border-none outline-none flex-grow text-base md:text-lg text-black placeholder:text-black/40 focus-visible:ring-0 py-1 shadow-none h-auto px-0 rounded-none"
                  required
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-base md:text-lg font-semibold font-sans text-black hover:opacity-60 transition-opacity px-2 h-auto hover:bg-transparent"
                >
                  {t('signup')}
                </Button>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group select-none justify-center lg:justify-start">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-5 w-5 rounded-sm border border-black/20 transition-all peer-checked:bg-black peer-checked:border-black group-hover:border-black/30" />
                  <svg className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm md:text-base text-black/60 transition-colors group-hover:text-black leading-tight">
                  {t('agreeMarketing')}
                </span>
              </label>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
