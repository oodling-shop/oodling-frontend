"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/helpers/index"
import { useMediaQuery } from "@/hooks/use-media-query"

interface FilterSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORIES = ["Home & Decor", "Clothing", "Accessories", "Outdoor"]
const COLORS = [
  { name: "Green", value: "#2DD4BF" },
  { name: "Purple", value: "#A78BFA" },
  { name: "Red", value: "#E11D48" },
  { name: "Black", value: "#171717" },
]
const SIZES = ["S", "M", "L", "XL", "One size", "Custom"]
const STYLES = [
  "Modern",
  "Streetwear",
  "Colorfull",
  "Patchwork",
  "Bohemian",
  "Vintage",
]

export const FilterSidebarContent = () => {
  const [activeCategory, setActiveCategory] = useState("Clothing")
  const [activeStyle, setActiveStyle] = useState("Streetwear")
  const [activeColor, setActiveColor] = useState("Green")
  const [activeSize, setActiveSize] = useState("S")
  const [priceRange, setPriceRange] = useState([25, 3000])

  return (
    <>
      <div className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-bold">Filter</h2>
      </div>

      <div className="px-8 py-4 space-y-10 pb-20">
        {/* Categories */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
            Categories
          </h3>
          <ul className="space-y-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "text-sm transition-colors",
                    activeCategory === category
                      ? "font-semibold text-neutral-900 underline underline-offset-[12px] decoration-2"
                      : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Color */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
            Color
          </h3>
          <div className="flex gap-4">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setActiveColor(color.name)}
                className={cn(
                  "size-8 rounded-full border-2 transition-all p-0.5",
                  activeColor === color.name ? "border-neutral-900" : "border-transparent"
                )}
                title={color.name}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Size */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
            Size
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                className={cn(
                  "h-11 flex items-center justify-center border text-sm font-medium transition-colors",
                  activeSize === size
                    ? "border-neutral-900 bg-white text-neutral-900"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* Price */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
            Price
          </h3>
          <div className="space-y-6">
            <Slider
              defaultValue={[25, 3000]}
              max={5000}
              step={1}
              onValueChange={setPriceRange}
              className="mt-2"
            />
            <div className="text-center text-sm font-medium text-neutral-600">
              ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </div>
          </div>
        </section>

        {/* Style */}
        <section className="relative">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
            Style
          </h3>
          <div className="relative group">
            <ul className="space-y-4 max-h-[220px] overflow-y-auto pr-6 scrollbar-none">
              {STYLES.map((style) => (
                <li key={style}>
                  <button
                    onClick={() => setActiveStyle(style)}
                    className={cn(
                      "text-sm transition-colors",
                      activeStyle === style
                        ? "font-semibold text-neutral-900 underline underline-offset-[12px] decoration-2"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    {style}
                  </button>
                </li>
              ))}
            </ul>
            {/* Custom scrollbar track visual */}
            <div className="absolute top-0 right-0 w-1.5 h-full bg-neutral-100 rounded-full">
              <div className="w-full h-12 bg-neutral-400 rounded-full pointer-events-none" />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


export const FilterSidebar = ({ open, onOpenChange, inline = false }: FilterSidebarProps & { inline?: boolean }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (inline) {
    return (
      <aside className="hidden lg:block w-[300px] flex-shrink-0 border-r border-neutral-100 min-h-screen">
        <FilterSidebarContent />
      </aside>
    )
  }

  return (
    <Sheet open={!isDesktop && open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] sm:w-[350px] p-0 overflow-y-auto lg:hidden">
        <FilterSidebarContent />
      </SheetContent>
    </Sheet>
  )
}
