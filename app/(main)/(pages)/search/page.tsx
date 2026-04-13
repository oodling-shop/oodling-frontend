import { getProducts, parseSortParams } from '@/lib/shopify/products';
import { ProductsGrid } from '@/components/products/products-grid';
import { Container } from '@/components/container';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { NothingFound } from './_components/nothing-found';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sortKey?: string; reverse?: string }>;
}) {
  const [raw, t, locale] = await Promise.all([
    searchParams,
    getTranslations('search'),
    getLocale(),
  ]);

  const q = raw.q?.trim() ?? '';
  const { sortKey, reverse } = parseSortParams(raw);
  const language = locale.toUpperCase();

  const productsData = q
    ? await getProducts({ first: 24, sortKey, reverse, query: q }, language)
    : { edges: [], pageInfo: { hasNextPage: false, endCursor: '' } };

  const products = productsData.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-white py-10">
        <Container>
          <h1 className="text-2xl md:text-[32px] font-semibold text-[#141718] mb-3 text-center">
            {t('title', { q })}
          </h1>
          <nav className="flex items-center justify-center gap-1.5 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#141718] transition-colors">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight className="size-3.5 text-neutral-400" />
            <span className="text-[#141718]">{t('breadcrumbResults', { q })}</span>
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
