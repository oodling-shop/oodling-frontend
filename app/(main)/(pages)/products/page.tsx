'use client';

import React, { useState } from 'react';
import { Container } from '@/components/container';
import { ProductCard } from '@/components/products/product-card';
import { FilterBar } from '@/components/products/filter-bar';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from '@/components/products/filter-sidebar';
import { ActiveFilters } from '@/components/products/active-filters';
import { cn } from '@/helpers/cn';
import { MOCK_PRODUCTS } from '@/constants';

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState(4);

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
              currentView={view}
              onViewChange={setView}
            />

            {/* Active Filters */}
            <ActiveFilters />

            {/* Product Grid */}
            <div className={cn(
              "transition-all duration-300",
              view === 1 ? "flex flex-col" : "grid gap-x-6 gap-y-10",
              view === 2 ? "grid-cols-2" :
              view === 3 ? "grid-cols-2 md:grid-cols-3" :
              view === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
              view === 5 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : ""
            )}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(MOCK_PRODUCTS as any[]).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={view === 1 ? 'list' : 'grid'}
                />
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
