import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { ProductImageGallery } from './_components/product-image-gallery';
import { ProductInfo } from './_components/product-info';
import { ProductTabs } from './_components/product-tabs';
import { RelatedProducts } from './_components/related-products';
import { getLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const language = locale.toUpperCase();
  const product = await getProduct(slug, language);

  if (!product) notFound();

  const numericId = product.id.split('/').pop();
  const relatedProductsData = await getProducts({
    first: 8,
    query: `NOT id:${numericId}`,
  }, language);
  const relatedProducts = relatedProductsData.edges.map((e) => e.node);

  const images = product.images.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image gallery */}
          <ProductImageGallery
            images={images}
            title={product.title}
            compareAtAmount={product.compareAtPriceRange.maxVariantPrice.amount}
            currentAmount={product.priceRange.minVariantPrice.amount}
          />

          {/* Right: Product info */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Tabs section */}
      <div className="max-w-6xl mx-auto px-4">
        <ProductTabs descriptionHtml={product.descriptionHtml} options={product.options} productId={product.id} />
      </div>

      {/* Related products */}
      <div className="max-w-6xl mx-auto px-4">
        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}
