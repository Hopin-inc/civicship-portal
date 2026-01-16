"use client";

import { MapPin } from "lucide-react";
import { PlaceData } from "../../shared/types/place";
import { PlaceCardMenu } from "./PlaceCardMenu";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";

interface PlaceCardProps {
  place: PlaceData;
  onDelete?: () => void;
}

export function PlaceCard({ place, onDelete }: PlaceCardProps) {
  const router = useCommunityRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // メニューボタンのクリックは無視
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/admin/places/${place.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* 場所名 */}
          <h3 className="text-title-sm font-bold truncate mb-2">{place.name}</h3>

          {/* 住所 */}
          <div className="flex items-start gap-2 text-caption text-caption-sm mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2">{place.address}</p>
          </div>

          {/* 市区町村 */}
          {place.cityName && (
            <p className="text-caption text-caption-sm mb-2">市区町村: {place.cityName}</p>
          )}

          {/* 募集数 */}
          {place.opportunityCount !== undefined && (
            <p className="text-caption text-caption-sm">
              関連する募集: {place.opportunityCount}件
            </p>
          )}
        </div>

        {/* メニュー */}
        <div onClick={(e) => e.stopPropagation()}>
          <PlaceCardMenu placeId={place.id!} placeName={place.name} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
