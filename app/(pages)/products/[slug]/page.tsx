'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/helpers/cn';
import { 
  Heart, 
  ShareNetwork, 
  Question as QuestionIcon, 
  CaretRight, 
  CaretDown,
  Truck,
  Package,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight
} from '@phosphor-icons/react';
import { Star } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { MOCK_PRODUCTS } from '@/constants';

const PRODUCT = {
  name: "Huishō Shoulder Bag",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  price: 86.00,
  originalPrice: 104.00,
  rating: 5,
  reviews: 23,
  sku: "1162",
  category: "Clothing",
  tags: ["Loose", "Modern", "Pants", "Sale"],
  images: [
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop', // Front
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', // Side
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop', // Model/Life
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop', // Detail
  ],
  colors: [
    { name: 'Brown', hex: '#A5693F' },
    { name: 'Red', hex: '#8B0000' },
    { name: 'Black', hex: '#141718' },
  ],
  sizes: [
    'S', 'M', 'L', 'XL'
  ]
};

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Brown');
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <main className="min-h-screen bg-white pb-20 pt-6">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <CaretRight size={14} className="flex-shrink-0" />
          <Link href="/products" className="hover:text-black transition-colors">Clothing</Link>
          <CaretRight size={14} className="flex-shrink-0" />
          <span className="text-black font-medium">{PRODUCT.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Left Side: Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            {PRODUCT.images.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] bg-[#F3F5F7] overflow-hidden group rounded-sm">
                {idx === 0 && (
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Badge variant="secondary" className="bg-white text-black font-bold px-3 py-1 text-[10px] tracking-wider uppercase rounded-[4px] border-none shadow-sm">
                      NEW
                    </Badge>
                    <Badge variant="secondary" className="bg-[#38CB89] text-white font-bold px-3 py-1 text-[10px] tracking-wider uppercase rounded-[4px] border-none shadow-sm">
                      -50%
                    </Badge>
                  </div>
                )}
                <Image
                  src={img}
                  alt={`${PRODUCT.name} detail ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* Right Side: Product Info */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#141718] leading-[1.1]">
                {PRODUCT.name}
              </h1>
              <p className="text-neutral-500 max-w-lg leading-relaxed text-sm">
                {PRODUCT.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < PRODUCT.rating ? "fill-[#141718] text-[#141718]" : "text-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium tracking-wide">
                  {PRODUCT.reviews} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#141718]">
                  ${PRODUCT.price.toFixed(2)}
                </span>
                <span className="text-lg text-neutral-400 line-through">
                  ${PRODUCT.originalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Selectors */}
            <div className="space-y-8">
              {/* Color */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Color</span>
                  <CaretDown size={14} className="text-neutral-400" />
                </div>
                <div className="flex gap-3">
                  {PRODUCT.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-8 h-8 rounded-full cursor-pointer transition-all ring-offset-2 ring-2",
                        selectedColor === color.name ? "ring-[#141718]" : "ring-transparent hover:ring-neutral-200"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Size</span>
                  <CaretDown size={14} className="text-neutral-400" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  {PRODUCT.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-12 h-10 px-4 flex items-center justify-center rounded-lg border text-sm font-semibold transition-all",
                        selectedSize === size 
                          ? "border-[#141718] bg-[#141718] text-white" 
                          : "border-neutral-200 hover:border-[#141718] text-neutral-900"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Guide & Stock */}
              <div className="flex items-center justify-between py-2">
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141718] hover:text-opacity-70 transition-all">
                  <Package size={20} weight="bold" />
                  SIZE GUIDE
                </button>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#38CB89]">
                  <Check size={18} weight="bold" />
                  ONLY 2 LEFT
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 h-12 w-full sm:w-36 bg-[#F3F5F7]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="text-neutral-500 hover:text-black transition-colors"
                  >
                    <Minus size={18} weight="bold" />
                  </button>
                  <span className="font-bold text-[#141718]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="text-neutral-500 hover:text-black transition-colors"
                  >
                    <Plus size={18} weight="bold" />
                  </button>
                </div>

                {/* Add to Cart */}
                <Button className="flex-1 bg-[#141718] hover:bg-[#141718]/95 text-white font-bold h-12 rounded-lg text-base tracking-wide transition-all active:scale-[0.98]">
                  Add to Cart
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center gap-8 py-2">
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141718] hover:text-neutral-500 transition-colors">
                  <Heart size={20} />
                  Wishlist
                </button>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141718] hover:text-neutral-500 transition-colors">
                  <QuestionIcon size={20} />
                  Ask question
                </button>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141718] hover:text-neutral-500 transition-colors">
                  <ShareNetwork size={20} />
                  Share
                </button>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Logistics Info */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Truck size={24} className="text-neutral-400 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-neutral-500">
                    Delivery: <span className="text-[#141718] font-bold ml-1">10 - 12 Oct, 2023</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Package size={24} className="text-neutral-400 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-neutral-500">
                    Shipping: <span className="text-[#141718] font-bold ml-1">Free for orders above $100</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-[100px_1fr] gap-y-3 pt-6 border-t border-neutral-100">
               <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em]">SKU</span>
               <span className="text-[10px] font-bold uppercase text-[#141718] tracking-[0.2em]">{PRODUCT.sku}</span>
               
               <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em]">CATEGORY</span>
               <span className="text-[10px] font-bold uppercase text-[#141718] tracking-[0.2em]">{PRODUCT.category}</span>
               
               <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em]">TAGS</span>
               <span className="text-[10px] font-bold uppercase text-[#141718] tracking-[0.2em]">{PRODUCT.tags.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-24">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start gap-12 bg-transparent border-b border-neutral-100 rounded-none h-auto p-0 mb-10 overflow-x-auto scrollbar-hide">
              <TabsTrigger 
                value="description" 
                className="bg-transparent border-none p-0 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#141718] data-[state=active]:text-[#141718] text-neutral-400 font-bold text-sm tracking-wide transition-all data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="additional" 
                className="bg-transparent border-none p-0 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#141718] data-[state=active]:text-[#141718] text-neutral-400 font-bold text-sm tracking-wide transition-all data-[state=active]:shadow-none"
              >
                Additional Info
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="bg-transparent border-none p-0 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#141718] data-[state=active]:text-[#141718] text-neutral-400 font-bold text-sm tracking-wide transition-all data-[state=active]:shadow-none"
              >
                Reviews ({PRODUCT.reviews})
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="bg-transparent border-none p-0 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#141718] data-[state=active]:text-[#141718] text-neutral-400 font-bold text-sm tracking-wide transition-all data-[state=active]:shadow-none"
              >
                Questions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-0 focus-visible:outline-none">
              <div className="space-y-12">
                <p className="text-neutral-500 max-w-4xl leading-[1.8] text-sm md:text-base">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint non provident.
                </p>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#141718]">Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-xs md:text-sm text-neutral-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                       Fabric: Denim
                    </li>
                    <li className="flex items-center gap-4 text-xs md:text-sm text-neutral-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                       Fit type: Loose fit
                    </li>
                    <li className="flex items-center gap-4 text-xs md:text-sm text-neutral-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                       Feature: Adjustable straps
                    </li>
                    <li className="flex items-center gap-4 text-xs md:text-sm text-neutral-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                       Front and back pockets
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            {/* Other tabs placeholders */}
            <TabsContent value="additional" className="text-neutral-500 text-sm">Additional information content here.</TabsContent>
            <TabsContent value="reviews" className="text-neutral-500 text-sm">Customer reviews content here.</TabsContent>
            <TabsContent value="questions" className="text-neutral-500 text-sm">Frequently asked questions content here.</TabsContent>
          </Tabs>
        </div>

        {/* You might also like section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141718]">
              You might also like
            </h2>
            <div className="flex gap-3">
              <button className="size-11 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-[#F3F5F7] transition-all active:scale-90">
                <ArrowLeft size={24} weight="light" />
              </button>
              <button className="size-11 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-[#F3F5F7] transition-all active:scale-90">
                <ArrowRight size={24} weight="light" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {MOCK_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
