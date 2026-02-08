'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/helpers/cn';
import { FilterSidebar } from './filter-sidebar';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  productCount: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  currentView: number;
  onViewChange: (view: number) => void;
}

export const FilterBar = ({ 
  productCount, 
  onToggleSidebar, 
  isSidebarOpen = false,
  currentView,
  onViewChange
}: FilterBarProps) => {
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
          <Button 
            variant="ghost"
            onClick={onToggleSidebar}
            className="flex items-center gap-2 text-sm font-semibold hover:text-neutral-600 transition-colors h-auto p-0 hover:bg-transparent"
          >
            Filter
            <SlidersHorizontal className="size-4" />
          </Button>
          <Button variant="ghost" className="flex items-center gap-1.5 text-sm font-semibold hover:text-neutral-600 transition-colors h-auto p-0 hover:bg-transparent">
            Sort by
            <ChevronDown className="size-4" />
          </Button>
        </div>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center border border-neutral-100 rounded-md overflow-hidden bg-white shadow-sm">
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
