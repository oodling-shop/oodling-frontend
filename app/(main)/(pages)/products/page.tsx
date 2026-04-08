import { getProducts } from '@/lib/shopify/products';
import { ProductsGrid } from './_components/products-grid';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const productsData = await getProducts({ first: 20 });
  const products = productsData.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white font-sans">
      <ProductsGrid products={products} totalCount={products.length} />
    </main>
  );
}
