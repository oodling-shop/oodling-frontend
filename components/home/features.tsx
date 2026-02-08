'use client';

import React from 'react';
import { Container } from '../container';
import { Truck, ArrowsCounterClockwise, Headset, Lock } from '@phosphor-icons/react';
import { cn } from '@/helpers/cn';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Orders above $200',
  },
  {
    icon: ArrowsCounterClockwise,
    title: 'Money-back',
    description: '30 day Guarantee',
  },
  {
    icon: Headset,
    title: 'Premium Support',
    description: 'Phone and email support',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Secured by Stripe',
  },
];

export const Features = () => {
  return (
    <section className="py-12 md:py-20 bg-white border-t border-b border-gray-100">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-6 py-8 px-4 sm:px-8 transition-colors duration-300",
                  // Vertical dividers on desktop (lg)
                  index !== FEATURES.length - 1 && "lg:border-r border-gray-100",
                  // Divider for tablet (2x2 grid)
                  index % 2 === 0 && "sm:border-r lg:border-r-0 border-gray-100",
                  index < 2 && "sm:max-lg:border-b border-gray-100",
                  // Mobile dividers (between each item except last)
                  index !== FEATURES.length - 1 && "max-sm:border-b border-gray-100"
                )}
              >
                <div className="flex-shrink-0 text-gray-900">
                  <Icon size={48} weight="thin" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {feature.description}
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
