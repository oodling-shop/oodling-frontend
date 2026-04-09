'use client';

import { useRef, useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/helpers/cn';
import { FilterSidebar } from './filter-sidebar';
import { Button } from '@/components/ui/button';

export type SortKey = 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';

export interface SortOption {
  label: string;
  sortKey: SortKey;
  reverse: boolean;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest',              sortKey: 'CREATED_AT',  reverse: false },
  { label: 'Oldest',              sortKey: 'CREATED_AT',  reverse: true  },
  { label: 'Price: Low to High',  sortKey: 'PRICE',       reverse: false },
  { label: 'Price: High to Low',  sortKey: 'PRICE',       reverse: true  },
  { label: 'Name: A–Z',           sortKey: 'TITLE',       reverse: false },
  { label: 'Name: Z–A',           sortKey: 'TITLE',       reverse: true  },
  { label: 'Best Selling',        sortKey: 'BEST_SELLING', reverse: false },
];

interface FilterBarProps {
  productCount: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  currentView: number;
  onViewChange: (view: number) => void;
  currentSort?: SortOption;
  onSortChange?: (option: SortOption) => void;
  productTypes?: string[];
  collections?: import('@/lib/shopify/types').ShopifyCollection[];
  showFilter?: boolean;
}

export const FilterBar = ({
  productCount,
  onToggleSidebar,
  isSidebarOpen = false,
  currentView,
  onViewChange,
  currentSort = SORT_OPTIONS[0],
  onSortChange,
  productTypes,
  collections,
  showFilter = true,
}: FilterBarProps) => {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4 border-b border-neutral-100 mb-4">
      {/* Filter Sidebar - Mobile Drawer (only when filter is enabled) */}
      {showFilter && (
        <FilterSidebar
          open={isSidebarOpen}
          onOpenChange={(open) => !open && onToggleSidebar?.()}
          productTypes={productTypes}
          collections={collections}
        />
      )}

      {/* Product Count */}
      <span className="text-sm font-medium text-neutral-500 order-2 md:order-1">
        {productCount} products
      </span>

      {/* Controls */}
      <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 order-1 md:order-2">
        {/* Filter & Sort */}
        <div className="flex items-center gap-6">
          {showFilter && (
          <Button
            variant="ghost"
            onClick={onToggleSidebar}
            className="flex items-center gap-2 text-sm font-semibold hover:text-neutral-600 transition-colors h-auto p-0 hover:bg-transparent"
          >
            Filter
            <SlidersHorizontal className="size-4" />
          </Button>
          )}

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <Button
              variant="ghost"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-neutral-600 transition-colors h-auto p-0 hover:bg-transparent"
            >
              Sort by
              <ChevronDown className={cn("size-4 transition-transform duration-200", sortOpen && "rotate-180")} />
            </Button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-white border border-neutral-100 shadow-md py-1">
                {SORT_OPTIONS.map((option) => {
                  const isActive =
                    currentSort.sortKey === option.sortKey &&
                    currentSort.reverse === option.reverse;
                  return (
                    <button
                      key={`${option.sortKey}:${option.reverse}`}
                      onClick={() => {
                        onSortChange?.(option);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors",
                        isActive
                          ? "font-semibold text-[#141718] bg-[#F3F5F7]"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      {option.label}
                      {isActive && <Check className="size-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center border border-[#EAEAEA] overflow-hidden bg-white">
          {[5, 4, 3, 2, 1].map((cols, i) => (
            <Button 
              key={cols}
              variant="ghost"
              onClick={() => onViewChange(cols)}
              className={cn(
                "p-3 hover:bg-neutral-50 transition-all flex items-center justify-center min-w-[46px] h-[46px] rounded-none",
                i !== 4 && "border-r border-neutral-100",
                currentView === cols ? "bg-[#F3F5F7]" : "bg-white"
              )}
            >
              <div className={cn(
                "flex gap-[3px]",
                cols === 1 ? "flex-col" : "flex-row"
              )}>
                {cols === 1 ? (
                  // List view: 2 horizontal bars
                  <>
                    <div className={cn(
                      "w-4 h-[2px] rounded-full transition-colors", 
                      currentView === cols ? "bg-[#141718]" : "bg-neutral-300"
                    )} />
                    <div className={cn(
                      "w-4 h-[2px] rounded-full transition-colors", 
                      currentView === cols ? "bg-[#141718]" : "bg-neutral-300"
                    )} />
                  </>
                ) : (
                  Array.from({ length: cols }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "w-[2.5px] h-4 rounded-full transition-colors", 
                        currentView === cols ? "bg-[#141718]" : "bg-neutral-300"
                      )} 
                    />
                  ))
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
