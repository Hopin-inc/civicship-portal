import Link from "next/link";
import Image from "next/image";
import { GqlNftInstance } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";

interface UserNftListProps {
  nftInstance: GqlNftInstance;
  isCarousel?: boolean;
}

export const NftCard = ({ nftInstance, isCarousel = false }: UserNftListProps) => {
  return (
    <Link
        key={nftInstance.id}
        href={`/nfts/${nftInstance.id}`}
        className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[150px] sm:max-w-[164px]" : ""}`}
    >
          <Card className="w-full h-[205px] overflow-hidden relative">
            <Image
            src={nftInstance.imageUrl ?? PLACEHOLDER_IMAGE}
            alt={nftInstance.name ?? ""}
            width={400}
            height={400}
            sizes="164px"
            placeholder={`blur`}
            blurDataURL={PLACEHOLDER_IMAGE}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = PLACEHOLDER_IMAGE;
            }}
            />
          </Card>
          <div className="mt-3">
              <h3 className="text-title-sm text-foreground line-clamp-2">{nftInstance.name}</h3>
          </div>
    </Link>
  );
}
