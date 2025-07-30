import Link from "next/link";
import Image from "next/image";
import { GqlNftInstance } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";

interface UserNftListProps {
  nftInstances: GqlNftInstance;
  isCarousel?: boolean;
}

const UserNftList = ({ nftInstances, isCarousel = false }: UserNftListProps) => {
  return (
    <Link
        key={nftInstances.id}
        href={`/nfts/${nftInstances.id}`}
        className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[150px] sm:max-w-[164px]" : ""}`}
    >
          <Card className="w-full h-[205px] overflow-hidden relative">
            <Image
            src={nftInstances.imageUrl ?? PLACEHOLDER_IMAGE}
            alt={nftInstances.name ?? ""}
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
              <h3 className="text-title-sm text-foreground line-clamp-2">{nftInstances.name}</h3>
          </div>
    </Link>
  );
}

export default UserNftList;