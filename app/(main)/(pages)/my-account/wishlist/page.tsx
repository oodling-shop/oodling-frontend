"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/helpers/index";

const wishlistItems = [
  { id: 1, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/aero_dive.png" },
  { id: 2, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/airkan_ii.png" },
  { id: 3, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/halo.png" },
  { id: 4, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/nike.png" },
  { id: 5, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/aero_dive.png" },
  { id: 6, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/airkan_ii.png" },
  { id: 7, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/halo.png" },
  { id: 8, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/nike.png" },
  { id: 9, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/aero_dive.png" },
  { id: 10, name: "Luxury Kanzo Shoes", size: "2XL", color: "Green", price: "$24.00", image: "/images/shoes/airkan_ii.png" },
];

const pagination = [1, 2, 3, 4, "...", 32, 33, 34];

export default function WishlistPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="group flex flex-col md:grid md:grid-cols-[100px_1fr_120px_160px] items-center py-8 border-b border-[#E8ECEF] first:border-t"
          >
            {/* Product Image */}
            <div className="w-[80px] md:w-[100px] aspect-[3/4] relative bg-[#F3F5F7] rounded-sm overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-300">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-2"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 md:pl-8 text-center md:text-left mt-4 md:mt-0">
              <h3 className="text-base font-semibold text-[#141718] leading-tight">
                {item.name}
              </h3>
              <p className="text-sm text-[#6C7275] mt-1.5">
                Size: {item.size}, Color: {item.color}
              </p>
              <button className="flex items-center gap-1.5 text-[#6C7275] text-sm mt-3.5 hover:text-black transition-colors mx-auto md:mx-0 font-medium">
                <Trash2 size={18} className="stroke-[1.5px]" />
                <span>Remove</span>
              </button>
            </div>

            {/* Price */}
            <div className="mt-4 md:mt-0 md:text-center">
              <span className="text-lg font-medium text-[#141718]">
                {item.price}
              </span>
            </div>

            {/* Action Button */}
            <div className="mt-6 md:mt-0 md:text-right w-full">
              <Button
                variant="outline"
                className="rounded-lg px-7 h-11 font-semibold border-black text-black hover:bg-black hover:text-white transition-all w-full md:w-auto text-sm"
              >
                Select options
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 md:gap-4 mt-16 mb-12">
        {pagination.map((page, index) => (
          <button
            key={index}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              page === 1
                ? "bg-[#141718] text-white shadow-md shadow-black/10"
                : page === "..."
                ? "text-[#6C7275] cursor-default"
                : "text-[#6C7275] hover:text-black hover:bg-[#F3F5F7]"
            )}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
