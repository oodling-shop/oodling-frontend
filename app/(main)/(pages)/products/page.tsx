import { getProducts, getProductTypes, parseSortParams } from '@/lib/shopify/products';
import { getAllCollections } from '@/lib/shopify/collections';
import { ProductsGrid } from '@/components/products/products-grid';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sortKey?: string;
    reverse?: string;
    productType?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const raw = await searchParams;
  const { sortKey, reverse } = parseSortParams(raw);
  const { productType, minPrice, maxPrice } = raw;

  const queryParts: string[] = [];
  if (productType) queryParts.push(`product_type:"${productType}"`);
  if (minPrice) queryParts.push(`variants.price:>=${minPrice}`);
  if (maxPrice) queryParts.push(`variants.price:<=${maxPrice}`);
  const query = queryParts.length > 0 ? queryParts.join(' AND ') : undefined;

  const [productsData, productTypes, collections] = await Promise.all([
    getProducts({ first: 20, sortKey, reverse, query }),
    getProductTypes(),
    getAllCollections(),
  ]);
  const products = productsData.edges.map((e) => e.node);

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
