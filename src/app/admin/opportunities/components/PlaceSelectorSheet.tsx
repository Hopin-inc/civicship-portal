"use client";

import { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface PlaceSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string, placeName: string) => void;
}

export function PlaceSelectorSheet({
  open,
  onOpenChange,
  selectedPlaceId,
  onSelectPlace,
}: PlaceSelectorSheetProps) {
  // クエリはSheetが開いている時のみ実行
  const { data, loading } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 100,
    },
    skip: !open,
    fetchPolicy: "network-only",
  });

  // 場所リスト
  const places = useMemo(() => {
    return (data?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place) => place != null)
      .map((place) => ({
        id: place!.id,
        name: place!.name,
      }));
  }, [data]);

  const handleSelect = (placeId: string, placeName: string) => {
    onSelectPlace(placeId, placeName);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-6 text-title-sm">
          <SheetTitle className={"text-title-sm"}>開催場所を選択</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {loading && <LoadingIndicator />}

          {!loading && places.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              場所が登録されていません
            </div>
          )}

          {!loading && places.length > 0 && (
            <div className="space-y-2">
              {places.map((place) => (
                <Item
                  key={place.id}
                  size="sm"
                  variant={selectedPlaceId === place.id ? "default" : "outline"}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(place.id, place.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSelect(place.id, place.name);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <ItemContent>
                    <ItemTitle className="text-body-md">{place.name}</ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
