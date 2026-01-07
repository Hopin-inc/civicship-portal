"use client";

import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { getNftImageUrl } from "@/lib/nfts/image-helper";

export interface NftItemData {
  id: string;
  name?: string | null;
  imageUrl?: string | null;
  instanceId?: string | null;
  createdAt: string;
  nftWallet?: {
    user: {
      name: string;
    };
  } | null;
}

interface NftItemProps {
  nftInstance: NftItemData;
}

export function NftItem({ nftInstance }: NftItemProps) {
  const imageUrl = getNftImageUrl(nftInstance.imageUrl, nftInstance.instanceId);
  const userName = nftInstance.nftWallet?.user?.name || "不明";

  // 配布日をフォーマット (YYYY/MM/DD形式)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Item asChild>
      <a href={`/nfts/${nftInstance.id}`} className="flex flex-1 gap-3">
        {/* --- LEFT CONTENT --- */}
        <div className="flex flex-1 flex-col min-w-0">
          <ItemContent>
            {/* NFT名（2行で ...） */}
            <ItemTitle className={cn("font-bold text-base leading-snug", "line-clamp-2")}>
              {nftInstance.name || "名称未設定"}
            </ItemTitle>
          </ItemContent>

          {/* --- FOOTER（保有者・配布日） --- */}
          <ItemFooter className="mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
              <span className="truncate">
                {userName}・{formatDate(nftInstance.createdAt)}
              </span>
            </div>
          </ItemFooter>
        </div>

        {/* --- RIGHT IMAGE (正方形) --- */}
        <div className="shrink-0 w-14 h-14 overflow-hidden rounded-md relative bg-muted">
          <Image
            src={imageUrl!}
            alt={nftInstance.name || "NFT"}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      </a>
    </Item>
  );
}
