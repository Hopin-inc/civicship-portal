"use client";

import { ChangeEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { X } from "lucide-react";
import { CommunityFormData, ValidationErrors } from "../../types/form";

interface BasicInfoSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors?: ValidationErrors;
  onClearError?: (field: keyof ValidationErrors) => void;
}

export function BasicInfoSection({
  formData,
  onChange,
  errors,
  onClearError,
}: BasicInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrl = formData.imageFile ? URL.createObjectURL(formData.imageFile) : null;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange("imageFile", file);
    e.target.value = "";
  };

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">コミュニティ名</span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Input
          value={formData.name}
          onChange={(e) => {
            onChange("name", e.target.value);
            if (errors?.name) onClearError?.("name");
          }}
          placeholder="コミュニティ名を入力"
          className={`placeholder:text-sm ${errors?.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.name && <p className="text-xs text-destructive px-1">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">ポイント名称</span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Input
          value={formData.pointName}
          onChange={(e) => {
            onChange("pointName", e.target.value);
            if (errors?.pointName) onClearError?.("pointName");
          }}
          placeholder="例: シビックポイント"
          className={`placeholder:text-sm ${errors?.pointName ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.pointName && (
          <p className="text-xs text-destructive px-1">{errors.pointName}</p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">説明</span>
        <Textarea
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="コミュニティの説明を入力"
          className="min-h-[80px] placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Webサイト</span>
        <Input
          value={formData.website}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://example.com"
          type="url"
          className="placeholder:text-sm"
        />
      </div>

      <Item size="sm" variant="outline">
        <ItemContent>
          <ItemTitle>アイコン画像</ItemTitle>
          {imagePreviewUrl ? (
            <div className="mt-3 relative w-20">
              <img
                src={imagePreviewUrl}
                alt="コミュニティアイコン"
                className="aspect-square w-20 rounded-md object-cover bg-muted"
              />
              <button
                type="button"
                onClick={() => onChange("imageFile", null)}
                aria-label="画像を削除"
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">未登録</p>
          )}
        </ItemContent>
        <ItemActions className="self-start">
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={!!formData.imageFile}
          >
            写真を追加
          </Button>
        </ItemActions>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
      </Item>
    </section>
  );
}
