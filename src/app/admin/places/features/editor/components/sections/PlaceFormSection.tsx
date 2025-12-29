"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
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
    <div className="space-y-4">
      {/* 場所名 */}
      <div className="space-y-2">
        <label className="text-body-md font-bold">
          場所名 <span className="text-error">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="例: シビックシップラボ"
        />
        {errors?.name && <p className="text-error text-caption-sm">{errors.name}</p>}
      </div>

      {/* 住所 */}
      <div className="space-y-2">
        <label className="text-body-md font-bold">
          住所 <span className="text-error">*</span>
        </label>
        <Textarea
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="例: 岡山県瀬戸内市邑久町尾張465-21"
          rows={3}
        />
        {geocoding && <p className="text-caption text-caption-sm">座標を取得中...</p>}
        {errors?.address && <p className="text-error text-caption-sm">{errors.address}</p>}
      </div>

      {/* 市区町村 - Item */}
      <Item onClick={onCityClick} className="cursor-pointer">
        <ItemContent>
          <ItemTitle>
            市区町村 <span className="text-error">*</span>
          </ItemTitle>
          <ItemDescription>{cityName || "未選択"}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-5 w-5 text-caption" />
        </ItemActions>
      </Item>
      {errors?.cityCode && <p className="text-error text-caption-sm">{errors.cityCode}</p>}

      {/* 座標表示 */}
      <div className="space-y-1">
        <label className="text-body-md font-bold">座標</label>
        <div className="space-y-1 text-caption text-caption-sm">
          <p>緯度: {latitude !== null ? latitude.toFixed(6) : "未取得"}</p>
          <p>経度: {longitude !== null ? longitude.toFixed(6) : "未取得"}</p>
        </div>
      </div>

      {/* 地図プレビュー */}
      {address && latitude !== null && longitude !== null && (
        <div className="space-y-2">
          <label className="text-body-md font-bold">地図</label>
          <AddressMap
            address={address}
            latitude={latitude}
            longitude={longitude}
            placeId=""
            height={300}
          />
        </div>
      )}
    </div>
  );
}
