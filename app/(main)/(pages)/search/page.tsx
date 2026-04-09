import { getProducts, parseSortParams } from '@/lib/shopify/products';
import { ProductsGrid } from '@/components/products/products-grid';
import { Container } from '@/components/container';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { NothingFound } from './_components/nothing-found';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sortKey?: string; reverse?: string }>;
}) {
  const raw = await searchParams;
  const q = raw.q?.trim() ?? '';
  const { sortKey, reverse } = parseSortParams(raw);

  const productsData = q
    ? await getProducts({ first: 24, sortKey, reverse, query: q })
    : { edges: [], pageInfo: { hasNextPage: false, endCursor: '' } };

  const products = productsData.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-white py-10">
        <Container>
          <h1 className="text-2xl md:text-[32px] font-semibold text-[#141718] mb-3 text-center">
            Search results for: &ldquo;{q}&rdquo;
          </h1>
          <nav className="flex items-center justify-center gap-1.5 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#141718] transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-neutral-400" />
            <span className="text-[#141718]">&ldquo;{q}&rdquo; Search results</span>
          </nav>
        </Container>
      </div>

      {products.length > 0 ? (
        <ProductsGrid
          products={products}
          totalCount={products.length}
          showSidebar={false}
        />
      ) : (
        <NothingFound query={q} />
      )}
    </main>
  );
}
