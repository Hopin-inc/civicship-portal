"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  hint?: string;
  previewUrl: string | null;
  onPickerClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewClassName?: string;
  onPreviewClick?: () => void;
}

function ImagePickerField({
  label,
  hint,
  previewUrl,
  onPickerClick,
  inputRef,
  onFileChange,
  previewClassName = "h-16 w-auto",
  onPreviewClick,
}: ImagePickerFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground px-1">{hint}</p>}
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
          {onPreviewClick && (
            <Button type="button" variant="text" size="sm" onClick={onPreviewClick}>
              プレビュー
            </Button>
          )}
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
  const [previewDialog, setPreviewDialog] = useState<"squareLogo" | "logo" | "ogImage" | null>(
    null,
  );

  const squareLogoPreviewUrl = editor.getPreviewUrl(editor.squareLogoImage);
  const logoPreviewUrl = editor.getPreviewUrl(editor.logoImage);
  const ogImagePreviewUrl = editor.getPreviewUrl(editor.ogImageImage);

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* タイトル */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm text-muted-foreground">{t("adminSetting.form.title")}</span>
            <RequiredBadge />
          </div>
          <p className="text-xs text-muted-foreground px-1">{t("adminSetting.form.title.hint")}</p>
          <Input
            value={editor.formState.title}
            onChange={(e) => editor.updateField("title", e.target.value)}
            placeholder={t("adminSetting.form.title")}
            className={
              editor.errors.title ? "border-destructive focus-visible:ring-destructive" : ""
            }
          />
          {editor.errors.title && (
            <p className="text-xs text-destructive px-1">{editor.errors.title}</p>
          )}
        </div>

        {/* 短い説明 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm text-muted-foreground">
              {t("adminSetting.form.shortDescription")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {t("adminSetting.form.shortDescription.hint")}
          </p>
          <Input
            value={editor.formState.shortDescription}
            onChange={(e) => editor.updateField("shortDescription", e.target.value)}
            placeholder={t("adminSetting.form.shortDescription")}
          />
        </div>

        {/* 説明文 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm text-muted-foreground">
              {t("adminSetting.form.description")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {t("adminSetting.form.description.hint")}
          </p>
          <Textarea
            value={editor.formState.description}
            onChange={(e) => editor.updateField("description", e.target.value)}
            placeholder={t("adminSetting.form.description")}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* OGP画像 */}
        <ImagePickerField
          label={t("adminSetting.form.ogImage")}
          hint={t("adminSetting.form.ogImage.hint")}
          previewUrl={ogImagePreviewUrl}
          onPickerClick={() => editor.ogImageInputRef.current?.click()}
          inputRef={editor.ogImageInputRef}
          onFileChange={(e) => editor.handleImageSelect("ogImage", e)}
          previewClassName="w-full max-w-xs aspect-[1200/630] object-cover"
          onPreviewClick={() => setPreviewDialog("ogImage")}
        />

        {/* ロゴ画像 */}
        <ImagePickerField
          label={t("adminSetting.form.logoPath")}
          hint={t("adminSetting.form.logoPath.hint")}
          previewUrl={logoPreviewUrl}
          onPickerClick={() => editor.logoInputRef.current?.click()}
          inputRef={editor.logoInputRef}
          onFileChange={(e) => editor.handleImageSelect("logo", e)}
          previewClassName="h-16 w-auto"
          onPreviewClick={() => setPreviewDialog("logo")}
        />

        {/* 正方形ロゴ画像 */}
        <ImagePickerField
          label={t("adminSetting.form.squareLogoPath")}
          hint={t("adminSetting.form.squareLogoPath.hint")}
          previewUrl={squareLogoPreviewUrl}
          onPickerClick={() => editor.squareLogoInputRef.current?.click()}
          inputRef={editor.squareLogoInputRef}
          onFileChange={(e) => editor.handleImageSelect("squareLogo", e)}
          previewClassName="h-12 w-12"
          onPreviewClick={() => setPreviewDialog("squareLogo")}
        />

        {/* Favicon */}
        <ImagePickerField
          label={t("adminSetting.form.faviconPrefix")}
          hint={t("adminSetting.form.faviconPrefix.hint")}
          previewUrl={editor.getPreviewUrl(editor.faviconImage)}
          onPickerClick={() => editor.faviconInputRef.current?.click()}
          inputRef={editor.faviconInputRef}
          onFileChange={(e) => editor.handleImageSelect("favicon", e)}
          previewClassName="h-8 w-8"
        />

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

      {/* プレビューダイアログ: 正方形ロゴ（ヘッダーモック） */}
      <Dialog
        open={previewDialog === "squareLogo"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>ヘッダーでの表示イメージ</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 bg-background border rounded-lg px-4 h-12">
            {squareLogoPreviewUrl ? (
              <img
                src={squareLogoPreviewUrl}
                className="h-[28px] w-auto object-contain"
                alt="square logo preview"
              />
            ) : (
              <div className="h-[28px] w-16 bg-muted rounded" />
            )}
            <span className="text-xs text-muted-foreground ml-auto">ヘッダー</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* プレビューダイアログ: ロゴ（ウォレットカードモック） */}
      <Dialog
        open={previewDialog === "logo"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>ウォレットカードでの表示イメージ</DialogTitle>
          </DialogHeader>
          <div className="bg-background rounded-2xl px-6 py-4 shadow-sm border">
            <div className="text-xs text-muted-foreground mb-1">残高</div>
            <div className="text-xl font-bold mb-4">1,234 pt</div>
            <div>
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  style={{ width: 80, height: 24 }}
                  className="opacity-60 object-contain"
                  alt="logo preview"
                />
              ) : (
                <div className="w-[80px] h-[24px] bg-muted rounded opacity-60" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* プレビューダイアログ: OGP画像（SNSシェアカードモック） */}
      <Dialog
        open={previewDialog === "ogImage"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>SNSシェア時の表示イメージ</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            {ogImagePreviewUrl ? (
              <img
                src={ogImagePreviewUrl}
                className="w-full aspect-[1200/630] object-cover"
                alt="og image preview"
              />
            ) : (
              <div className="w-full aspect-[1200/630] bg-muted flex items-center justify-center text-xs text-muted-foreground">
                画像未設定
              </div>
            )}
            <div className="p-3 border-t bg-background">
              <p className="text-sm font-bold truncate">
                {editor.formState.title || "タイトル"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {editor.formState.shortDescription || "短い説明"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
