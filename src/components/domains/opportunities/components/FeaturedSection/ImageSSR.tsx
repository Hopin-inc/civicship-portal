import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";

type Props = {
  image: string;
  title: string;
};

export default function OpportunityImageSSR({ image, title }: Props) {
  return (
    <div className="absolute inset-0 z-0">
      <div className="relative h-full w-full">
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          fill
          sizes="100vw"
          priority // ✅ これが SSR 時に <link rel="preload" /> を生成
          fetchPriority="high"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_IMAGE}
          className="object-cover"
        />
      </div>
    </div>
  );
}
