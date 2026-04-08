'use client';

import React, { useState } from 'react';
import { FilterSidebar } from '@/components/products/filter-sidebar';
import { FilterBar } from '@/components/products/filter-bar';
import { ActiveFilters } from '@/components/products/active-filters';
import { ProductCard } from '@/components/products/product-card';
import { cn } from '@/helpers/cn';
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';

interface ProductsGridProps {
  products: ShopifyProduct[];
  totalCount: number;
  productTypes: string[];
  collections: ShopifyCollection[];
}

export function ProductsGrid({ products, totalCount, productTypes, collections }: ProductsGridProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState(4);

  return (
    <div className="flex items-start">
      {isSidebarOpen && (
        <FilterSidebar
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          inline
          productTypes={productTypes}
          collections={collections}
        />
      )}
      <div className="flex-1 w-full overflow-hidden">
        <div className="lg:max-w-full lg:px-12 mx-auto px-4">
          <FilterBar
            productCount={totalCount}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            currentView={view}
            onViewChange={setView}
          />
          <ActiveFilters />
          <div className={cn(
            'transition-all duration-300',
            view === 1 ? 'flex flex-col' : 'grid gap-x-6 gap-y-10',
            view === 2 ? 'grid-cols-2' :
            view === 3 ? 'grid-cols-2 md:grid-cols-3' :
            view === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
            view === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : ''
          )}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout={view === 1 ? 'list' : 'grid'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
