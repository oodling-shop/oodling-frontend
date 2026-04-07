import Hero from '@/components/home/hero';
import Categories from '@/components/home/categories';
import Collections from '@/components/home/collections';
import NewArrivals from '@/components/home/new-arrivals';
import ProductGrid from '@/components/home/product-grid';
import Features from '@/components/home/features';
import Newsletter from '@/components/home/newsletter';
import FeaturedProduct from '@/components/home/featured-product';
import { getProducts } from '@/lib/shopify/products';
import { getCollectionByHandle } from '@/lib/shopify/collections';
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';

export default async function Home() {
  let bestSellers: ShopifyProduct[] = []
  let newArrivals: ShopifyProduct[] = []
  let saleProducts: ShopifyProduct[] = []
  let collectionItems: ShopifyCollection[] = []
  let categoryItems: ShopifyCollection[] = []

  try {
    const [
      bestSellerConn,
      newArrivalConn,
      saleConn,
      kopla,
      lola,
      folka,
      pinkPanther,
      goldCrest,
      hotLips,
      brownSugar,
      redVelvet,
    ] = await Promise.all([
      getProducts({ first: 12, sortKey: 'BEST_SELLING' }),
      getProducts({ first: 12, sortKey: 'CREATED_AT', reverse: true }),
      getProducts({ first: 12, query: 'tag:sale' }),
      getCollectionByHandle('kopla'),
      getCollectionByHandle('lola'),
      getCollectionByHandle('folka'),
      getCollectionByHandle('pink-panther'),
      getCollectionByHandle('gold-crest'),
      getCollectionByHandle('hot-lips'),
      getCollectionByHandle('brown-sugar'),
      getCollectionByHandle('red-velvet'),
    ])

    bestSellers = bestSellerConn.edges.map(e => e.node)
    newArrivals = newArrivalConn.edges.map(e => e.node)
    saleProducts = saleConn.edges.map(e => e.node)
    collectionItems = [kopla, lola, folka].filter((c): c is ShopifyCollection => c !== null)
    categoryItems = [pinkPanther, goldCrest, hotLips, brownSugar, redVelvet].filter((c): c is ShopifyCollection => c !== null)
  } catch (err) {
    console.error('Home page data fetch failed:', err)
  }

  return (
    <main className="min-h-screen font-sans">
      <Hero />
      <Categories categories={categoryItems} />
      <Collections collections={collectionItems} />
      <NewArrivals products={newArrivals} />
      <FeaturedProduct />
      <ProductGrid bestSellers={bestSellers} newArrivals={newArrivals} sale={saleProducts} />
      <div className="font-secondary"><Newsletter /></div>
      <div className="font-secondary"><Features /></div>
    </main>
  );
}
