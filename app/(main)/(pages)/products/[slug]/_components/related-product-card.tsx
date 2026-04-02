import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductCardProps {
  handle: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string };
}

export function RelatedProductCard({
  handle,
  title,
  imageUrl,
  imageAlt,
  price,
  compareAtPrice,
}: RelatedProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const showCompareAt =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const formattedCompareAt =
    showCompareAt && compareAtPrice
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: compareAtPrice.currencyCode,
        }).format(parseFloat(compareAtPrice.amount))
      : null;

  return (
    <Link href={`/products/${handle}`} className="group flex flex-col gap-3">
      <div className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[#141718]">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#141718]">{formattedPrice}</span>
          {formattedCompareAt && (
            <span className="text-sm text-[#6C7275] line-through">{formattedCompareAt}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
