import Image from 'next/image';

interface ImageNode {
  url: string;
  altText: string;
}

interface ProductImageGalleryProps {
  images: ImageNode[];
  title: string;
  compareAtAmount?: string;
  currentAmount?: string;
}

export function ProductImageGallery({
  images,
  title,
  compareAtAmount,
  currentAmount,
}: ProductImageGalleryProps) {
  const showDiscount =
    compareAtAmount &&
    currentAmount &&
    parseFloat(compareAtAmount) > parseFloat(currentAmount);

  const discountPct = showDiscount
    ? Math.round(
        ((parseFloat(compareAtAmount!) - parseFloat(currentAmount!)) /
          parseFloat(compareAtAmount!)) *
          100
      )
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="relative aspect-3/4 bg-[#F3F5F7] overflow-hidden rounded-sm"
        >
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={index === 0}
          />
          {index === 0 && (
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-white text-[#141718] text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
              {showDiscount && (
                <span className="bg-[#38CB89] text-white text-xs font-semibold px-2 py-1 rounded">
                  -{discountPct}%
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
