"use client";

import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import SearchForm from "@/components/shared/SearchForm";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // 検索フィルタリング
  const filteredPlaces = useMemo(() => {
    const places = (data?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place) => place != null)
      .map((place) => ({
        id: place!.id,
        name: place!.name,
      }));

    if (!searchQuery.trim()) return places;

    const query = searchQuery.toLowerCase();
    return places.filter((place) => place.name.toLowerCase().includes(query));
  }, [data, searchQuery]);

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
          <SearchForm
            value={searchQuery}
            onInputChange={setSearchQuery}
            onSearch={setSearchQuery}
            placeholder="場所を検索"
          />

          {loading && <LoadingIndicator />}

          {!loading && filteredPlaces.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "該当する場所が見つかりません" : "場所が登録されていません"}
            </div>
          )}

          {!loading && filteredPlaces.length > 0 && (
            <div className="space-y-2">
              {filteredPlaces.map((place) => (
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
