import React from 'react';
import { Container } from '@/components/container';
import { ProductCard, Product } from '@/components/products/product-card';
import { FilterBar } from '@/components/products/filter-bar';
import { Button } from '@/components/ui/button';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Product Name',
    image: '/images/folka.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 2,
    name: 'Product Name',
    image: '/images/kopia.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 3,
    name: 'Product Name',
    image: '/images/lola.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 4,
    name: 'Product Name',
    image: '/images/categories/brown_sugar.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 5,
    name: 'Product Name',
    image: '/images/categories/gold_crest.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 6,
    name: 'Product Name',
    image: '/images/categories/hot_slips.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 7,
    name: 'Product Name',
    image: '/images/categories/red_velvet.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 8,
    name: 'Product Name',
    image: '/images/folka.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 9,
    name: 'Product Name',
    image: '/images/kopia.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 10,
    name: 'Product Name',
    image: '/images/lola.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 11,
    name: 'Product Name',
    image: '/images/categories/brown_sugar.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
  {
    id: 12,
    name: 'Product Name',
    image: '/images/categories/gold_crest.png',
    price: '$56.00',
    originalPrice: '$130.00',
    rating: 5,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <Container>
        {/* Title/Header area could go here if needed, but the image starts with count & filter */}
        
        {/* Filter Bar */}
        <FilterBar productCount={134} />

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-16 flex justify-center">
          <Button 
            className="rounded-lg h-12 px-12 text-sm font-semibold bg-[#141718] text-white hover:bg-[#141718]/90 transition-all active:scale-95"
          >
            Load more
          </Button>
        </div>
      </Container>
    </main>
  );
}
