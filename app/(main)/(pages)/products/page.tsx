import { getProducts, getProductTypes } from '@/lib/shopify/products';
import { getAllCollections } from '@/lib/shopify/collections';
import { ProductsGrid } from './_components/products-grid';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [productsData, productTypes, collections] = await Promise.all([
    getProducts({ first: 20 }),
    getProductTypes(),
    getAllCollections(),
  ]);
  const products = productsData.edges.map((e) => e.node);

  console.log('[Products Page] products:', products)
  console.log('[Products Page] productTypes:', productTypes)
  console.log('[Products Page] collections:', collections)

  return (
    <main className="min-h-screen bg-white font-sans">
      <ProductsGrid
        products={products}
        totalCount={products.length}
        productTypes={productTypes}
        collections={collections}
      />
    </main>
  );
}
