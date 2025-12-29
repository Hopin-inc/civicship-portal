"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, MapPin } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import AddressMap from "@/components/shared/AddressMap";

interface PlaceFormSectionProps {
  name: string;
  onNameChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
  cityCode: string;
  cityName: string | null;
  onCityClick: () => void;
  latitude: number | null;
  longitude: number | null;
  geocoding: boolean;
  errors?: {
    name?: string;
    address?: string;
    cityCode?: string;
  };
}

export function PlaceFormSection({
  name,
  onNameChange,
  address,
  onAddressChange,
  cityCode,
  cityName,
  onCityClick,
  latitude,
  longitude,
  geocoding,
  errors,
}: PlaceFormSectionProps) {
  return (
    <section className="space-y-2">
      {/* 場所名 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">場所名</span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="例: シビックシップラボ"
          className={`placeholder:text-sm ${errors?.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
          required
        />
        {errors?.name && (
          <p className="text-xs text-destructive px-1">{errors.name}</p>
        )}
      </div>

      {/* 住所 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">住所</span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Textarea
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="例: 岡山県瀬戸内市邑久町尾張465-21"
          className={`min-h-[80px] placeholder:text-sm ${errors?.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
          required
        />
        {geocoding && (
          <p className="text-xs text-muted-foreground px-1">座標を取得中...</p>
        )}
        {errors?.address && (
          <p className="text-xs text-destructive px-1">{errors.address}</p>
        )}
      </div>

      {/* 市区町村・座標 */}
      <div className="space-y-1">
        <ItemGroup className="border rounded-lg">
          {/* 市区町村 */}
          <Item
            size="sm"
            role="button"
            tabIndex={0}
            onClick={onCityClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCityClick();
              }
            }}
            className={`cursor-pointer ${errors?.cityCode ? "border-destructive" : ""}`}
          >
            <ItemContent>
              <ItemTitle>
                <MapPin className="h-3.5 w-3.5" />
                市区町村
                <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
                  必須
                </span>
              </ItemTitle>
              <ItemDescription>{cityName || "未選択"}</ItemDescription>
            </ItemContent>

            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          <ItemSeparator />

          {/* 座標（読み取り専用） */}
          <Item size="sm">
            <ItemContent>
              <ItemTitle>座標</ItemTitle>
              <ItemDescription>
                {latitude !== null && longitude !== null
                  ? `緯度: ${latitude.toFixed(6)}, 経度: ${longitude.toFixed(6)}`
                  : "未取得"}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        {errors?.cityCode && (
          <p className="text-xs text-destructive px-1">{errors.cityCode}</p>
        )}
      </div>

      {/* 地図プレビュー */}
      {address && latitude !== null && longitude !== null && (
        <div className="space-y-1">
          <div className="px-1">
            <span className="text-sm text-muted-foreground">地図</span>
          </div>
          <AddressMap
            address={address}
            latitude={latitude}
            longitude={longitude}
            placeId=""
            height={300}
          />
        </div>
      )}
    </section>
  );
}
