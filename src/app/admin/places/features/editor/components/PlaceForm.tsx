"use client";

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AddressMap from "@/components/shared/AddressMap";
import { PlaceEditorFormState } from "../types/form";

interface PlaceFormProps {
  formState: PlaceEditorFormState;
  onFieldChange: <K extends keyof PlaceEditorFormState>(
    field: K,
    value: PlaceEditorFormState[K]
  ) => void;
  onAddressChange: (address: string) => void;
  onSubmit: (e: FormEvent) => void;
  saving: boolean;
  geocoding: boolean;
}

export function PlaceForm({
  formState,
  onFieldChange,
  onAddressChange,
  onSubmit,
  saving,
  geocoding,
}: PlaceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 場所名 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-body-md font-bold">
          場所名 <span className="text-error">*</span>
        </Label>
        <Input
          id="name"
          value={formState.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="例: シビックシップラボ"
          disabled={saving}
          required
        />
      </div>

      {/* 住所 */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-body-md font-bold">
          住所 <span className="text-error">*</span>
        </Label>
        <Input
          id="address"
          value={formState.address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="例: 岡山県瀬戸内市邑久町尾張465-21"
          disabled={saving}
          required
        />
        {geocoding && (
          <p className="text-caption text-caption-sm">座標を取得中...</p>
        )}
      </div>

      {/* 市区町村選択 */}
      <div className="space-y-2">
        <Label htmlFor="cityCode" className="text-body-md font-bold">
          市区町村 <span className="text-error">*</span>
        </Label>
        <select
          id="cityCode"
          value={formState.cityCode}
          onChange={(e) => onFieldChange("cityCode", e.target.value)}
          className="w-full h-10 px-3 py-2 border border-border rounded-md bg-background text-body-md"
          disabled={saving}
          required
        >
          <option value="">選択してください</option>
          {/* TODO: 市区町村のリストを取得して表示 */}
          <option value="33212">瀬戸内市</option>
          <option value="33201">岡山市</option>
        </select>
      </div>

      {/* 座標表示（読み取り専用） */}
      <div className="space-y-2">
        <Label className="text-body-md font-bold">座標</Label>
        <div className="space-y-1">
          <p className="text-body-sm text-caption">
            緯度: {formState.latitude !== null ? formState.latitude.toFixed(6) : "未取得"}
          </p>
          <p className="text-body-sm text-caption">
            経度: {formState.longitude !== null ? formState.longitude.toFixed(6) : "未取得"}
          </p>
        </div>
      </div>

      {/* 地図プレビュー */}
      {formState.address && formState.latitude !== null && formState.longitude !== null && (
        <div className="space-y-2">
          <Label className="text-body-md font-bold">地図</Label>
          <AddressMap
            address={formState.address}
            latitude={formState.latitude}
            longitude={formState.longitude}
            placeId={formState.googlePlaceId || ""}
            height={300}
            onLocationFound={(location) => {
              onFieldChange("latitude", location.lat());
              onFieldChange("longitude", location.lng());
            }}
          />
        </div>
      )}

      {/* 保存ボタン */}
      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full" disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}
