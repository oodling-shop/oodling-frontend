"use client";

import React from "react";
import { cn } from "@/helpers/cn";

interface BottomBannerProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function BottomBanner({
  children,
  action,
  icon,
  className,
  innerClassName,
}: BottomBannerProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 w-full bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all animate-in slide-in-from-bottom duration-300",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[1400px] mx-auto px-4 py-4 md:px-8 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4",
          innerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="text-[13px] md:text-sm font-medium text-[#1A1A1A] leading-relaxed max-w-4xl">
            {children}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0 md:ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
