'use client';

import React, { useState } from 'react';
import { Container } from '@/components/container';
import { ProductCard, Product } from '@/components/products/product-card';
import { FilterBar } from '@/components/products/filter-bar';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from '@/components/products/filter-sidebar';
import { ActiveFilters } from '@/components/products/active-filters';
import { cn } from '@/helpers/cn';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Product Name',
    image: '/images/folka.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 2,
    name: 'Product Name',
    image: '/images/kopia.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 3,
    name: 'Product Name',
    image: '/images/lola.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 4,
    name: 'Product Name',
    image: '/images/categories/brown_sugar.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 5,
    name: 'Product Name',
    image: '/images/categories/gold_crest.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 6,
    name: 'Product Name',
    image: '/images/categories/hot_slips.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 7,
    name: 'Product Name',
    image: '/images/categories/red_velvet.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 8,
    name: 'Product Name',
    image: '/images/folka.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 9,
    name: 'Product Name',
    image: '/images/kopia.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 10,
    name: 'Product Name',
    image: '/images/lola.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 11,
    name: 'Product Name',
    image: '/images/categories/brown_sugar.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 12,
    name: 'Product Name',
    image: '/images/categories/gold_crest.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
];

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <div className="flex items-start">
        {/* Full Height Sidebar on Desktop */}
        {isSidebarOpen && (
          <FilterSidebar 
            open={isSidebarOpen} 
            onOpenChange={setIsSidebarOpen} 
            inline 
          />
        )}

        <div className="flex-1 w-full overflow-hidden">
          <Container className="lg:max-w-full lg:px-12">
            {/* Filter Bar with toggle logic */}
            <FilterBar 
              productCount={134} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Active Filters */}
            <ActiveFilters />

            {/* Product Grid */}
            <div className={cn(
              "grid gap-x-6 gap-y-10 transition-all duration-300",
              isSidebarOpen 
                ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            )}>
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-16 flex justify-center">
              <Button 
                className="rounded-lg h-12 px-12 text-sm font-semibold bg-[#141718] text-white hover:bg-[#141718]/90 transition-all active:scale-95"
              >
                Load more
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </main>
  );
}
