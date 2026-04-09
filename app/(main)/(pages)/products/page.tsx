import { getProducts, getProductTypes } from '@/lib/shopify/products';
import { getAllCollections } from '@/lib/shopify/collections';
import { ProductsGrid } from './_components/products-grid';
import type { SortKey } from '@/components/products/filter-bar';

export const dynamic = 'force-dynamic';

const VALID_SORT_KEYS: SortKey[] = ['TITLE', 'PRICE', 'CREATED_AT', 'BEST_SELLING'];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sortKey?: string; reverse?: string; productType?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { sortKey: sortKeyParam, reverse: reverseParam, productType, minPrice, maxPrice } = await searchParams;
  const sortKey = VALID_SORT_KEYS.includes(sortKeyParam as SortKey)
    ? (sortKeyParam as SortKey)
    : 'CREATED_AT';
  const reverse = reverseParam === 'true';

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
