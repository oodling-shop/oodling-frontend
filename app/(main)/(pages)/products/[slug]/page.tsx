import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/shopify/products';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const image = product.images.edges[0]?.node;
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(parseFloat(product.priceRange.minVariantPrice.amount));

  const firstAvailableVariant = product.variants.edges.find(
    (e) => e.node.availableForSale
  )?.node;

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden rounded-lg">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-contain p-6"
              priority
            />
          )}
        </div>
        <div className="flex flex-col gap-6 py-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#141718]">{product.title}</h1>
          <p className="text-2xl font-bold text-[#141718]">{price}</p>
          {product.description && (
            <p className="text-[#6C7275] leading-relaxed">{product.description}</p>
          )}
          {firstAvailableVariant && (
            <AddToCartButton variantId={firstAvailableVariant.id} />
          )}
          {!firstAvailableVariant && (
            <p className="text-red-500 font-medium">Out of stock</p>
          )}
        </div>
      </div>
    </main>
  );
}

// Inline placeholder — will be wired to cart in Task 19
function AddToCartButton({ variantId }: { variantId: string }) {
  return (
    <button
      data-variant-id={variantId}
      className="h-14 w-full bg-[#141718] text-white font-semibold rounded-lg hover:bg-[#141718]/90 transition-all active:scale-[0.98]"
    >
      Add to cart
    </button>
  );
}
