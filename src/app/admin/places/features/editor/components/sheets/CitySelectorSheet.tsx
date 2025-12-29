"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ItemContent, ItemTitle } from "@/components/ui/item";
import { SelectorSheet } from "@/app/admin/opportunities/features/shared/components/SelectorSheet";
import { GET_CITIES } from "../../queries";

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
  // Cityマスタから全citiesを取得
  const { data, loading } = useQuery(GET_CITIES, {
    variables: {
      first: 1000, // 全件取得（日本の市区町村数は約2000なので十分）
      sort: { code: "ASC" },
    },
    skip: !open,
    fetchPolicy: "cache-first",
  });

  // citiesリストを作成
  const cities = useMemo<City[]>(() => {
    return (data?.cities?.edges || [])
      .map((edge: any) => {
        const city = edge?.node;
        if (city && city.code && city.name) {
          return {
            code: city.code,
            name: city.name,
          };
        }
        return null;
      })
      .filter((city: City | null): city is City => city !== null)
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
