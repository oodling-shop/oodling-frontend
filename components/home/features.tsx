'use client';

import React from 'react';
import { Container } from '../container';
import { Truck, ArrowsCounterClockwise, Headset, Lock } from '@phosphor-icons/react';
import { cn } from '@/helpers/cn';
import { useTranslations } from 'next-intl';

const FEATURE_KEYS = [
  { icon: Truck, key: 'freeShipping' },
  { icon: ArrowsCounterClockwise, key: 'moneyBack' },
  { icon: Headset, key: 'premiumSupport' },
  { icon: Lock, key: 'securePayments' },
] as const;

export const Features = () => {
  const t = useTranslations('features');

  return (
    <section className="py-12 md:py-20 bg-white border-t border-b border-gray-100">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {FEATURE_KEYS.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col lg:flex-row items-center lg:items-center gap-4 lg:gap-6 py-8 px-4 sm:px-8 transition-colors duration-300",
                  index !== FEATURE_KEYS.length - 1 && "lg:border-r border-gray-100",
                )}
              >
                <div className="flex-shrink-0 text-gray-900">
                  <Icon size={40} weight="thin" className="lg:w-12 lg:h-12" />
                </div>
                <div className="flex flex-col gap-1 text-center lg:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Features;
