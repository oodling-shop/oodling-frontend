'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/helpers/cn';
import { FilterSidebar } from './filter-sidebar';

interface FilterBarProps {
  productCount: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const FilterBar = ({ productCount, onToggleSidebar, isSidebarOpen = false }: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 border-b border-neutral-100 mb-8">
      {/* Filter Sidebar - Mobile Drawer */}
      <FilterSidebar 
        open={isSidebarOpen} 
        onOpenChange={(open) => !open && onToggleSidebar?.()} 
      />

      {/* Product Count */}
      <span className="text-sm font-medium text-neutral-500 order-2 md:order-1">
        {productCount} products
      </span>

      {/* Controls */}
      <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 order-1 md:order-2">
        {/* Filter & Sort */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleSidebar}
            className="flex items-center gap-2 text-sm font-semibold hover:text-neutral-600 transition-colors"
          >
            Filter
            <SlidersHorizontal className="size-4" />
          </button>
          <button className="flex items-center gap-1.5 text-sm font-semibold hover:text-neutral-600 transition-colors">
            Sort by
            <ChevronDown className="size-4" />
          </button>
        </div>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center border border-neutral-200 rounded-md overflow-hidden bg-white">
          {[5, 4, 3, 2, 1].map((cols, i) => (
            <button 
              key={cols}
              className={cn(
                "p-2.5 hover:bg-neutral-50 transition-colors",
                i !== 4 && "border-r border-neutral-200",
                cols === 5 && "bg-neutral-100" // Active state for the default view
              )}
            >
              <div className="flex gap-0.5">
                {cols === 1 ? (
                  <div className="w-5 h-4 border-2 border-neutral-300 rounded-xs" />
                ) : (
                  Array.from({ length: cols }).map((_, idx) => (
                    <div key={idx} className="w-1 h-4 bg-neutral-300 rounded-full" />
                  ))
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
