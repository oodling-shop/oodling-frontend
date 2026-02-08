'use client';

import React from 'react';
import { ListFilter, ChevronDown, LayoutGrid, Grid2X2, Grid3X3, Rows } from 'lucide-react';
import { cn } from '@/helpers/cn';

interface FilterBarProps {
  productCount: number;
}

export const FilterBar = ({ productCount }: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 border-b border-neutral-100 mb-8">
      {/* Product Count */}
      <span className="text-sm font-medium text-neutral-500">
        {productCount} products
      </span>

      {/* Controls */}
      <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
        {/* Filter & Sort */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-semibold hover:text-neutral-600 transition-colors">
            Filter
            <ListFilter className="size-4" />
          </button>
          <button className="flex items-center gap-1.5 text-sm font-semibold hover:text-neutral-600 transition-colors">
            Sort by
            <ChevronDown className="size-4" />
          </button>
        </div>

        {/* View Switchers - Desktop Only or Responsive? The design shows 4 icons */}
        <div className="hidden sm:flex items-center border border-neutral-200 rounded-md overflow-hidden">
          <button className="p-2 border-r border-neutral-200 hover:bg-neutral-50 transition-colors">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1.5 h-4 bg-neutral-300 rounded-sm" />
            </div>
          </button>
          <button className="p-2 border-r border-neutral-200 hover:bg-neutral-50 transition-colors">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1.5 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1.5 h-4 bg-neutral-300 rounded-sm" />
            </div>
          </button>
          <button className="p-2 border-r border-neutral-200 hover:bg-neutral-50 transition-colors">
            <div className="flex gap-0.5">
              <div className="w-1 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1 h-4 bg-neutral-300 rounded-sm" />
              <div className="w-1 h-4 bg-neutral-300 rounded-sm" />
            </div>
          </button>
          <button className="p-2 hover:bg-neutral-50 transition-colors bg-neutral-50">
            <div className="w-4 h-4 border-2 border-neutral-900 rounded-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
