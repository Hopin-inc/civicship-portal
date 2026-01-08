import Link from "next/link";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";
import { getNftImageUrl } from "@/lib/nfts/image-helper";

export type NftCardData = {
  id: string;
  name?: string | null;
  imageUrl?: string | null;
  instanceId?: string | null;
  communityId?: string | null;
};

interface NftCardProps {
  nftInstance: NftCardData;
  isCarousel?: boolean;
}

export const NftCard = ({ nftInstance, isCarousel = false }: NftCardProps) => {
  return (
    <Link
      key={nftInstance.id}
      href={`/nfts/${nftInstance.id}`}
      className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[100px]" : ""}`}
    >
      <Card className="w-full h-[100px] overflow-hidden relative">
        <Image
          src={getNftImageUrl(nftInstance.imageUrl, nftInstance.instanceId, nftInstance.communityId)}
          alt={nftInstance.name ?? ""}
          width={400}
          height={400}
          sizes="100px"
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
        <h3 className="text-label-xs text-foreground line-clamp-1">{nftInstance.name}</h3>
      </div>
    </Link>
  );
};
