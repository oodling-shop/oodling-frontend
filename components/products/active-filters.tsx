"use client"

import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ActiveFilters = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-md text-sm font-medium">
        Plants
        <Button variant="ghost" className="hover:text-neutral-500 transition-colors h-auto w-auto p-0 hover:bg-transparent">
          <X className="size-3" />
        </Button>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-md text-sm font-medium">
        Plants
        <Button variant="ghost" className="hover:text-neutral-500 transition-colors h-auto w-auto p-0 hover:bg-transparent">
          <X className="size-3" />
        </Button>
      </div>
      <Button variant="ghost" className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 ml-2 h-auto p-0 hover:bg-transparent">
        <X className="size-3" />
        Clear All
      </Button>
    </div>
  )
}
