"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import { useCommunityProfileEditor } from "../hooks/useCommunityProfileEditor";

interface CommunitySettingFormProps {
  editor: ReturnType<typeof useCommunityProfileEditor>;
  onSubmit: (e: FormEvent) => void;
}

function RequiredBadge() {
  return (
    <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
      必須
    </span>
  );
}

interface ImagePickerFieldProps {
  label: string;
  previewUrl: string | null;
  onPickerClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewClassName?: string;
}

function ImagePickerField({
  label,
  previewUrl,
  onPickerClick,
  inputRef,
  onFileChange,
  previewClassName = "h-16 w-auto",
}: ImagePickerFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <Item size="sm" variant="outline">
        <ItemContent>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className={`rounded object-contain bg-muted ${previewClassName}`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <p className="text-xs text-muted-foreground">未設定</p>
          )}
        </ItemContent>
        <ItemActions className="self-center">
          <Button type="button" variant="text" size="sm" onClick={onPickerClick}>
            画像を変更
          </Button>
        </ItemActions>
      </Item>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

export function CommunitySettingForm({ editor, onSubmit }: CommunitySettingFormProps) {
  const t = useTranslations();

  const faviconPreviewSrc = editor.formState.faviconPrefix
    ? `${editor.formState.faviconPrefix}/favicon.ico`
    : "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* タイトル */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.title")}</span>
          <RequiredBadge />
        </div>
        <Input
          value={editor.formState.title}
          onChange={(e) => editor.updateField("title", e.target.value)}
          placeholder={t("adminSetting.form.title")}
          className={editor.errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {editor.errors.title && (
          <p className="text-xs text-destructive px-1">{editor.errors.title}</p>
        )}
      </div>

      {/* 説明文 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.description")}</span>
        </div>
        <Textarea
          value={editor.formState.description}
          onChange={(e) => editor.updateField("description", e.target.value)}
          placeholder={t("adminSetting.form.description")}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* 短い説明 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.shortDescription")}</span>
        </div>
        <Input
          value={editor.formState.shortDescription}
          onChange={(e) => editor.updateField("shortDescription", e.target.value)}
          placeholder={t("adminSetting.form.shortDescription")}
        />
      </div>

      {/* ロゴ画像 */}
      <ImagePickerField
        label={t("adminSetting.form.logoPath")}
        previewUrl={editor.getPreviewUrl(editor.logoImage)}
        onPickerClick={() => editor.logoInputRef.current?.click()}
        inputRef={editor.logoInputRef}
        onFileChange={(e) => editor.handleImageSelect("logo", e)}
        previewClassName="h-16 w-auto"
      />

      {/* 正方形ロゴ画像 */}
      <ImagePickerField
        label={t("adminSetting.form.squareLogoPath")}
        previewUrl={editor.getPreviewUrl(editor.squareLogoImage)}
        onPickerClick={() => editor.squareLogoInputRef.current?.click()}
        inputRef={editor.squareLogoInputRef}
        onFileChange={(e) => editor.handleImageSelect("squareLogo", e)}
        previewClassName="h-12 w-12"
      />

      {/* Favicon プレフィックス */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.faviconPrefix")}</span>
        </div>
        <Input
          value={editor.formState.faviconPrefix}
          onChange={(e) => editor.updateField("faviconPrefix", e.target.value)}
          placeholder="https://example.com/favicons"
        />
        {faviconPreviewSrc && (
          <div className="mt-2">
            <img
              src={faviconPreviewSrc}
              alt="Faviconプレビュー"
              className="h-8 w-8 rounded border border-border object-contain bg-muted"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto pt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? t("adminSetting.form.saving") : t("adminSetting.form.submit")}
        </Button>
      </div>
    </form>
  );
}
