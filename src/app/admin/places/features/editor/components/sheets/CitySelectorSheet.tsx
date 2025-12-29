"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Check } from "lucide-react";
import { GET_CITIES } from "../../queries";
import { GqlSortDirection } from "@/types/graphql";

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
  // 検索テキスト
  const [searchText, setSearchText] = useState("");

  // Cityマスタから検索
  const { data, loading } = useQuery(GET_CITIES, {
    variables: {
      filter: searchText ? { name: searchText } : undefined,
      first: 500, // バックエンド上限
      sort: { code: GqlSortDirection.Asc },
    },
    skip: !open || !searchText, // 検索テキストがある場合のみクエリ実行
    fetchPolicy: "network-only", // 常に最新データを取得
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
      .sort((a: City, b: City) => a.name.localeCompare(b.name, "ja"));
  }, [data]);

  const handleSelect = (city: City) => {
    onSelectCity(city.code, city.name);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-4 text-title-sm">
          <SheetTitle className="text-title-sm">市区町村を選択</SheetTitle>
        </SheetHeader>

        {/* 検索入力 */}
        <div className="mb-4">
          <Input
            placeholder="市区町村名で検索（例: 姫路）"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="placeholder:text-sm"
            autoFocus
          />
        </div>

        <div className="space-y-4">
          {loading && <LoadingIndicator />}

          {!loading && cities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchText
                ? `「${searchText}」に一致する市区町村が見つかりませんでした`
                : "市区町村名を入力して検索してください（例: 姫路）"}
            </div>
          )}

          {!loading && cities.length > 0 && (
            <div className="space-y-2">
              {cities.map((city) => {
                const isSelected = selectedCityCode === city.code;

                return (
                  <Item
                    key={city.code}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(city)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelect(city);
                      } else if (e.key === "Escape") {
                        onOpenChange(false);
                      }
                    }}
                    className="cursor-pointer relative"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <ItemContent>
                        <ItemTitle className="text-body-md">{city.name}</ItemTitle>
                      </ItemContent>
                      {isSelected && (
                        <div className="ml-auto">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                  </Item>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
