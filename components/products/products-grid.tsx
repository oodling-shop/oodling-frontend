'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebar } from './filter-sidebar';
import { FilterBar, SORT_OPTIONS } from './filter-bar';
import type { SortOption } from './filter-bar';
import { ActiveFilters } from './active-filters';
import { ProductCard } from './product-card';
import { cn } from '@/helpers/cn';
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';

interface ProductsGridProps {
  products: ShopifyProduct[];
  totalCount: number;
  productTypes?: string[];
  collections?: ShopifyCollection[];
  /** When false the filter sidebar and Filter button are hidden (e.g. search results). Default: true */
  showSidebar?: boolean;
}

function ProductsGridInner({
  products,
  totalCount,
  productTypes = [],
  collections = [],
  showSidebar = true,
}: ProductsGridProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(showSidebar);
  const [view, setView] = useState(4);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort: SortOption = (() => {
    const sortKey = searchParams.get('sortKey');
    const reverse = searchParams.get('reverse') === 'true';
    return SORT_OPTIONS.find((o) => o.sortKey === sortKey && o.reverse === reverse) ?? SORT_OPTIONS[0];
  })();

  const handleSortChange = (option: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortKey', option.sortKey);
    params.set('reverse', String(option.reverse));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-start">
      {showSidebar && isSidebarOpen && (
        <FilterSidebar
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          inline
          productTypes={productTypes}
          collections={collections}
        />
      )}
      <div className="flex-1 w-full overflow-hidden">
        <div className="lg:max-w-full lg:px-12 mx-auto px-4 pb-16">
          <FilterBar
            productCount={totalCount}
            onToggleSidebar={showSidebar ? () => setIsSidebarOpen(!isSidebarOpen) : undefined}
            isSidebarOpen={isSidebarOpen}
            currentView={view}
            onViewChange={setView}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            productTypes={productTypes}
            collections={collections}
            showFilter={showSidebar}
          />
          {showSidebar && <ActiveFilters />}
          <div
            className={cn(
              'transition-all duration-300',
              view === 1 ? 'flex flex-col' : 'grid gap-x-6 gap-y-10',
              view === 2 ? 'grid-cols-2' :
              view === 3 ? 'grid-cols-2 md:grid-cols-3' :
              view === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
              view === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : ''
            )}
          >
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

export function ProductsGrid(props: ProductsGridProps) {
  return (
    <Suspense>
      <ProductsGridInner {...props} />
    </Suspense>
  );
}
