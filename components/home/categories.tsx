'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../container';

const CATEGORIES = [
  {
    name: 'Pink Panther',
    image: '/images/categories/pink_panther.png',
  },
  {
    name: 'Gold Crest',
    image: '/images/categories/gold_crest.png',
  },
  {
    name: 'Hot Lips',
    image: '/images/categories/hot_slips.png',
  },
  {
    name: 'Brown Sugar',
    image: '/images/categories/brown_sugar.png',
  },
  {
    name: 'Red Velvet',
    image: '/images/categories/red_velvet.png',
  },
];

export const Categories = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900">
            Categories
          </h2>
          <Link 
            href="/categories" 
            className="text-base font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-70 transition-opacity"
          >
            See all categories
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.name} 
              href={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}
              className="group flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative w-full aspect-square rounded-full bg-[#f6f6f6] flex items-center justify-center p-8 overflow-hidden">
                <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="text-base md:text-lg font-medium text-neutral-800 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
