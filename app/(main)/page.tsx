import Hero from '@/components/home/hero';
import Categories from '@/components/home/categories';
import Collections from '@/components/home/collections';
import NewArrivals from '@/components/home/new-arrivals';
import ProductGrid from '@/components/home/product-grid';
import Features from '@/components/home/features';
import Newsletter from '@/components/home/newsletter';
import FeaturedProduct from '@/components/home/featured-product';
import { getProducts, getHeroProducts } from '@/lib/shopify/products';
import { getAllCollections } from '@/lib/shopify/collections';
import type { ShopifyProduct, ShopifyProductWithMetafields, ShopifyCollection } from '@/lib/shopify/types';
import { getLocale } from 'next-intl/server';

const COLLECTION_HANDLES = ['kopla', 'lola', 'folka']
const CATEGORY_HANDLES = ['pink-panther', 'gold-crest', 'hot-lips', 'brown-sugar', 'red-velvet']

export default async function Home() {
  let bestSellers: ShopifyProduct[] = []
  let newArrivals: ShopifyProduct[] = []
  let saleProducts: ShopifyProduct[] = []
  let heroProducts: ShopifyProductWithMetafields[] = []
  let collectionItems: ShopifyCollection[] = []
  let categoryItems: ShopifyCollection[] = []

  const locale = await getLocale();
  const language = locale.toUpperCase();

  try {
    const [bestSellerConn, newArrivalConn, saleConn, heroConn, allCollections] = await Promise.all([
      getProducts({ first: 12, sortKey: 'BEST_SELLING' }, language),
      getProducts({ first: 12, sortKey: 'CREATED_AT', reverse: true }, language),
      getProducts({ first: 12, query: 'tag:sale' }, language),
      getHeroProducts(3, language),
      getAllCollections(50, language),
    ])

    bestSellers = bestSellerConn.edges.map(e => e.node)
    newArrivals = newArrivalConn.edges.map(e => e.node)
    saleProducts = saleConn.edges.map(e => e.node)
    heroProducts = heroConn.edges.map(e => e.node)
    collectionItems = COLLECTION_HANDLES.flatMap(h => allCollections.filter(c => c.handle === h))
    categoryItems = CATEGORY_HANDLES.flatMap(h => allCollections.filter(c => c.handle === h))

    console.log('[Home Page] allCollections:', allCollections)
    console.log('[Home Page] collectionItems:', collectionItems)
    console.log('[Home Page] categoryItems:', categoryItems)
    console.log('[Home Page] bestSellers:', bestSellers)
    console.log('[Home Page] newArrivals:', newArrivals)
    console.log('[Home Page] saleProducts:', saleProducts)
  } catch (err) {
    console.error('Home page data fetch failed:', err)
  }

  return (
    <main className="min-h-screen font-sans">
      <Hero products={heroProducts} />
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
