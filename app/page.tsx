import Hero from '@/components/home/hero';
import Categories from '@/components/home/categories';
import Collections from '@/components/home/collections';
import NewArrivals from '@/components/home/new-arrivals';
import ProductGrid from '@/components/home/product-grid';
import Features from '@/components/home/features';
import Newsletter from '@/components/home/newsletter';
import FeaturedProduct from '@/components/home/featured-product';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <Collections />
      <NewArrivals />
      <FeaturedProduct />
      <ProductGrid />
      <Newsletter />
      <Features />
    </main>
  );
}
