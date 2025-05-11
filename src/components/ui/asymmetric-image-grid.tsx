import Image from "next/image";
import { memo } from "react";

type ImageData = {
  url: string;
  alt: string;
};

type AsymmetricImageGridProps = {
  images: ImageData[];
  className?: string;
  remainingCount?: number;
};

export const AsymmetricImageGrid = memo(
  ({ images, className = "", remainingCount }: AsymmetricImageGridProps) => {
    if (images.length === 0) return null;

    const [featured, ...thumbnails] = images;

    return (
      <div className={`grid h-full grid-cols-12 gap-2 ${className}`}>
        {/* Featured Image */}
        <div className="col-span-7 flex h-full items-center justify-end">
          <div className="relative h-full w-full max-w-[226px]">
            <div className="aspect-[226/282] h-full">
              <Image
                src={featured.url}
                alt={featured.alt}
                className="rounded-lg object-cover"
                fill
                sizes="(max-width: 226px) 100vw, 226px"
                priority={true}
              />
            </div>
          </div>
        </div>
        {/* Thumbnails */}
        <div className="col-span-5 flex h-full flex-col items-start justify-center gap-2">
          {thumbnails.map((image, index) => (
            <div key={index} className="relative h-full w-full max-w-[112px]">
              <div className="aspect-[112/140] h-full">
                <Image
                  src={image.url}
                  alt={image.alt}
                  className="rounded-lg object-cover"
                  fill
                  sizes="(max-width: 112px) 100vw, 112px"
                />
                {remainingCount && index === thumbnails.length - 1 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">+{remainingCount}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

AsymmetricImageGrid.displayName = "AsymmetricImageGrid";
