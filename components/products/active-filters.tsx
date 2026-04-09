"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const PRICE_MIN = 0
const PRICE_MAX = 5000

export const ActiveFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const productType = searchParams.get("productType")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  const hasPriceFilter =
    minPrice !== null || maxPrice !== null

  const activeFilters: { key: string; label: string }[] = []

  if (productType) {
    activeFilters.push({ key: "productType", label: productType })
  }
  if (hasPriceFilter) {
    const min = Number(minPrice ?? PRICE_MIN)
    const max = Number(maxPrice ?? PRICE_MAX)
    activeFilters.push({
      key: "price",
      label: `$${min.toLocaleString()} – $${max.toLocaleString()}`,
    })
  }

  if (activeFilters.length === 0) return null

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key === "price") {
      params.delete("minPrice")
      params.delete("maxPrice")
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("productType")
    params.delete("minPrice")
    params.delete("maxPrice")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-md text-sm font-medium"
        >
          {filter.label}
          <Button
            variant="ghost"
            onClick={() => removeFilter(filter.key)}
            className="hover:text-neutral-500 transition-colors h-auto w-auto p-0 hover:bg-transparent"
          >
            <X className="size-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        onClick={clearAll}
        className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 ml-2 h-auto p-0 hover:bg-transparent"
      >
        <X className="size-3" />
        Clear All
      </Button>
    </div>
  )
}
