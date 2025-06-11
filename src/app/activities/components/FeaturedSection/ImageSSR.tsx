import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { useEffect } from "react";

type Props = {
  image: string;
  title: string;
};

const preloadHeroImage = (imageUrl: string) => {
  if (typeof window !== 'undefined' && imageUrl && imageUrl !== PLACEHOLDER_IMAGE) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  }
};

export default function OpportunityImageSSR({ image, title }: Props) {
  useEffect(() => {
    preloadHeroImage(image);
  }, [image]);

  return (
    <div className="absolute inset-0 z-0">
      <div className="relative h-full w-full">
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_IMAGE}
          className="object-cover"
        />
      </div>
    </div>
  );
}
