"use client";

import { FormEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
import { Eye } from "lucide-react";
import WalletCard from "@/components/shared/WalletCard";
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
  previewClassName = "h-16 aspect-[2/1]",
  onPreviewClick,
}: ImagePickerFieldProps) {
  const [imgError, setImgError] = useState(false);

  // previewUrl が変わったらエラー状態をリセット（新画像のプレビューを正しく表示するため）
  useEffect(() => {
    setImgError(false);
  }, [previewUrl]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground px-1">{hint}</p>}
      <Item size="sm" variant="outline">
        <ItemContent>
          {/* 推奨サイズのアスペクト比でグレー枠を表示し、画像が正しい比率かを視覚的に確認できる */}
          <div className={cn("bg-muted rounded overflow-hidden self-start", previewClassName)}>
            {previewUrl && !imgError ? (
              <img
                src={previewUrl}
                alt={label}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-xs text-muted-foreground">
                  {previewUrl && imgError ? "設定済み" : "未設定"}
                </p>
              </div>
            )}
          </div>
        </ItemContent>
        <ItemActions className="self-center">
          {onPreviewClick && (
            <Button type="button" variant="icon-only" size="icon" onClick={onPreviewClick} aria-label="プレビュー">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button type="button" variant="tertiary" size="sm" onClick={onPickerClick}>
            変更
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
          <p className="text-xs text-muted-foreground px-1">{t("adminSetting.form.titleHint")}</p>
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
            {t("adminSetting.form.shortDescriptionHint")}
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
            {t("adminSetting.form.descriptionHint")}
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
          hint={t("adminSetting.form.ogImageHint")}
          previewUrl={ogImagePreviewUrl}
          onPickerClick={() => editor.ogImageInputRef.current?.click()}
          inputRef={editor.ogImageInputRef}
          onFileChange={(e) => editor.handleImageSelect("ogImage", e)}
          previewClassName="h-20 aspect-[1200/630]"
          onPreviewClick={() => setPreviewDialog("ogImage")}
        />

        {/* ロゴ画像 */}
        <ImagePickerField
          label={t("adminSetting.form.logoPath")}
          hint={t("adminSetting.form.logoPathHint")}
          previewUrl={logoPreviewUrl}
          onPickerClick={() => editor.logoInputRef.current?.click()}
          inputRef={editor.logoInputRef}
          onFileChange={(e) => editor.handleImageSelect("logo", e)}
          previewClassName="h-16 aspect-[240/100]"
          onPreviewClick={() => setPreviewDialog("logo")}
        />

        {/* 正方形ロゴ画像 */}
        <ImagePickerField
          label={t("adminSetting.form.squareLogoPath")}
          hint={t("adminSetting.form.squareLogoPathHint")}
          previewUrl={squareLogoPreviewUrl}
          onPickerClick={() => editor.squareLogoInputRef.current?.click()}
          inputRef={editor.squareLogoInputRef}
          onFileChange={(e) => editor.handleImageSelect("squareLogo", e)}
          previewClassName="h-12 aspect-square"
          onPreviewClick={() => setPreviewDialog("squareLogo")}
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

      {/* プレビューダイアログ: 正方形ロゴ（ヘッダービジュアルモック） */}
      <Dialog
        open={previewDialog === "squareLogo"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">ヘッダーでの表示イメージ</DialogTitle>
          </DialogHeader>
          {/* Header と同じ CSS クラスで構成したモック */}
          <div className="bg-background border-b border-border w-full flex items-center px-6 h-16 rounded-lg border">
            {squareLogoPreviewUrl ? (
              <img
                src={squareLogoPreviewUrl}
                alt="ロゴ"
                className="h-[28px] w-auto object-contain"
              />
            ) : (
              <div className="h-[28px] w-16 bg-muted rounded" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* プレビューダイアログ: ロゴ（実際のWalletCard） */}
      <Dialog
        open={previewDialog === "logo"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">ウォレットカードでの表示イメージ</DialogTitle>
          </DialogHeader>
          <WalletCard
            currentPoint={0}
            isLoading={false}
            showRefreshButton={false}
            logoOverride={logoPreviewUrl}
          />
        </DialogContent>
      </Dialog>

      {/* プレビューダイアログ: OGP画像（SNSシェアカードモック） */}
      <Dialog
        open={previewDialog === "ogImage"}
        onOpenChange={(o) => !o && setPreviewDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">SNSシェア時の表示イメージ</DialogTitle>
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
