"use client";

import { Item, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import { PlaceData } from "../../shared/types/place";
import { PlaceCardMenu } from "./PlaceCardMenu";
import CommunityLink from "@/components/navigation/CommunityLink";

interface PlaceItemProps {
  place: PlaceData;
  refetch?: () => void;
}

export function PlaceItem({ place, refetch }: PlaceItemProps) {
  return (
    <Item asChild>
      <CommunityLink href={`/admin/places/${place.id}`} className="flex flex-1 gap-3">
        {/* 左側コンテンツ */}
        <div className="flex flex-1 flex-col min-w-0">
          <ItemContent>
            {/* 場所名 */}
            <ItemTitle className="font-bold text-base leading-snug line-clamp-2">
              {place.name}
            </ItemTitle>
            {/* 住所（小さく） */}
            <ItemDescription className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {place.address}
            </ItemDescription>
          </ItemContent>
        </div>

        {/* アクションメニュー（右端の…） */}
        <PlaceCardMenu placeId={place.id!} placeName={place.name} onDelete={refetch} />
      </CommunityLink>
    </Item>
  );
}
