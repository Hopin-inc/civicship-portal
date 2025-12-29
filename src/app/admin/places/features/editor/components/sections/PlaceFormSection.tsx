"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

  // 郵便番号
  postalCode: string;
  onPostalCodeChange: (value: string) => void;
  onPostalCodeSearch: () => void;
  postalCodeSearching: boolean;

  address: string;
  onAddressChange: (value: string) => void;

  // 地図・座標
  coordinatesConfirmed: boolean;
  coordinatesNeedReview: boolean;
  latitude: number | null;
  longitude: number | null;
  onMapClick: () => void;

  // 市区町村（条件付き表示）
  showCitySelector: boolean;
  cityCode: string;
  cityName: string | null;
  onCityClick: () => void;

  errors?: {
    name?: string;
    address?: string;
    coordinates?: string;
    cityCode?: string;
  };
}

export function PlaceFormSection({
  name,
  onNameChange,
  postalCode,
  onPostalCodeChange,
  onPostalCodeSearch,
  postalCodeSearching,
  address,
  onAddressChange,
  coordinatesConfirmed,
  coordinatesNeedReview,
  latitude,
  longitude,
  onMapClick,
  showCitySelector,
  cityCode,
  cityName,
  onCityClick,
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

      {/* 郵便番号 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">郵便番号</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value.replace(/\D/g, ""))}
            placeholder="例: 7010111"
            className="placeholder:text-sm"
            maxLength={7}
          />
          <Button
            type="button"
            onClick={onPostalCodeSearch}
            disabled={postalCode.length !== 7 || postalCodeSearching}
            size="sm"
            variant="secondary"
          >
            {postalCodeSearching ? "検索中..." : "住所検索"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground px-1">
          郵便番号から都道府県・市区町村・町域を自動入力します
        </p>
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
        {errors?.address && (
          <p className="text-xs text-destructive px-1">{errors.address}</p>
        )}
      </div>

      {/* 地図・座標 */}
      <div className="space-y-1">
        <ItemGroup className="border rounded-lg">
          <Item
            size="sm"
            role="button"
            tabIndex={0}
            onClick={onMapClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onMapClick();
              }
            }}
            className={`cursor-pointer ${errors?.coordinates ? "border-destructive" : ""}`}
          >
            <ItemContent>
              <ItemTitle>
                <MapPin className="h-3.5 w-3.5" />
                {coordinatesConfirmed && !coordinatesNeedReview ? "地図・座標" : "地図で位置を確認"}
                {!coordinatesConfirmed && (
                  <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
                    必須
                  </span>
                )}
                {coordinatesNeedReview && (
                  <span className="text-amber-600 text-xs font-bold bg-amber-50 px-1 py-0.5 rounded">
                    要再確認
                  </span>
                )}
              </ItemTitle>
              <ItemDescription>
                {coordinatesConfirmed && latitude !== null && longitude !== null
                  ? `緯度: ${latitude.toFixed(6)}, 経度: ${longitude.toFixed(6)}`
                  : "タップして位置を確定してください"}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </ItemGroup>
        {errors?.coordinates && (
          <p className="text-xs text-destructive px-1">{errors.coordinates}</p>
        )}
      </div>

      {/* 市区町村（条件付き表示）*/}
      {showCitySelector && (
        <div className="space-y-1">
          <ItemGroup className="border rounded-lg">
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
                <ItemDescription>
                  {cityName || "選択してください"}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
          <p className="text-xs text-muted-foreground px-1">
            住所から市区町村を特定できませんでした。手動で選択してください。
          </p>
          {errors?.cityCode && (
            <p className="text-xs text-destructive px-1">{errors.cityCode}</p>
          )}
        </div>
      )}

      {/* 地図プレビュー（確定済みで要再確認でない時のみ表示）*/}
      {coordinatesConfirmed && !coordinatesNeedReview && latitude !== null && longitude !== null && (
        <div className="space-y-1">
          <div className="px-1">
            <span className="text-sm text-muted-foreground">地図プレビュー</span>
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
