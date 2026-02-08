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
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col lg:flex-row items-center lg:items-center gap-4 lg:gap-6 py-8 px-4 sm:px-8 transition-colors duration-300",
                  // Vertical dividers on desktop (lg)
                  index !== FEATURES.length - 1 && "lg:border-r border-gray-100",
                  // Mobile/Tablet: No borders for cleaner look in 2x2 grid, or add if strictly needed. 
                  // Assuming clean look is desired based on "exact" image which likely has white space.
                  // We removed the complex mobile/tablet border logic.
                )}
              >
                <div className="flex-shrink-0 text-gray-900">
                  <Icon size={40} weight="thin" className="lg:w-12 lg:h-12" />
                </div>
                <div className="flex flex-col gap-1 text-center lg:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
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
