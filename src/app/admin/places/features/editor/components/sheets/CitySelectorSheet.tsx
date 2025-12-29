"use client";

import { useMemo } from "react";
import { ItemContent, ItemTitle } from "@/components/ui/item";
import { SelectorSheet } from "@/app/admin/opportunities/features/shared/components/SelectorSheet";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface CitySelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCityCode: string | null;
  onSelectCity: (code: string, name: string) => void;
}

interface City {
  code: string;
  name: string;
}

export function CitySelectorSheet({
  open,
  onOpenChange,
  selectedCityCode,
  onSelectCity,
}: CitySelectorSheetProps) {
  // placesクエリから利用可能なcitiesを抽出
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

  // 重複を排除してcitiesリストを作成
  const cities = useMemo<City[]>(() => {
    const cityMap = new Map<string, string>();

    (data?.places?.edges || []).forEach((edge) => {
      const city = edge?.node?.city;
      if (city && city.code && city.name) {
        cityMap.set(city.code, city.name);
      }
    });

    return Array.from(cityMap.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }, [data]);

  const handleSelect = (city: City) => {
    onSelectCity(city.code, city.name);
  };

  const renderItem = (city: City) => (
    <ItemContent>
      <ItemTitle className="text-body-md">{city.name}</ItemTitle>
    </ItemContent>
  );

  return (
    <SelectorSheet<City>
      open={open}
      onOpenChange={onOpenChange}
      title="市区町村を選択"
      emptyMessage="市区町村が登録されていません"
      items={cities}
      loading={loading}
      selectedId={selectedCityCode}
      onSelect={handleSelect}
      renderItem={renderItem}
      getItemKey={(city) => city.code}
    />
  );
}
