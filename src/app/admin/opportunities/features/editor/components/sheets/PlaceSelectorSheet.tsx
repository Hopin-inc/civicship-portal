"use client";

import { useMemo } from "react";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { ItemContent, ItemTitle } from "@/components/ui/item";
import { SelectorSheet } from "../../shared/components/SelectorSheet";

interface PlaceSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string, placeName: string) => void;
}

interface Place {
  id: string;
  name: string;
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

  const handleSelect = (place: Place) => {
    onSelectPlace(place.id, place.name);
  };

  const renderItem = (place: Place) => (
    <ItemContent>
      <ItemTitle className="text-body-md">{place.name}</ItemTitle>
    </ItemContent>
  );

  return (
    <SelectorSheet<Place>
      open={open}
      onOpenChange={onOpenChange}
      title="開催場所を選択"
      emptyMessage="場所が登録されていません"
      items={places}
      loading={loading}
      selectedId={selectedPlaceId}
      onSelect={handleSelect}
      renderItem={renderItem}
      getItemKey={(place) => place.id}
    />
  );
}
