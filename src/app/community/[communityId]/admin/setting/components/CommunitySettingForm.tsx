"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

function ImagePreview({ src, alt, className = "" }: ImagePreviewProps) {
  if (!src) return null;
  return (
    <div className="mt-2">
      <img
        src={src}
        alt={alt}
        className={`rounded border border-border object-contain bg-muted ${className}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
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

      {/* ロゴ画像パス */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.logoPath")}</span>
        </div>
        <Input
          value={editor.formState.logoPath}
          onChange={(e) => editor.updateField("logoPath", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
        <ImagePreview
          src={editor.formState.logoPath}
          alt="ロゴプレビュー"
          className="h-16 w-auto"
        />
      </div>

      {/* 正方形ロゴ画像パス */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.squareLogoPath")}</span>
        </div>
        <Input
          value={editor.formState.squareLogoPath}
          onChange={(e) => editor.updateField("squareLogoPath", e.target.value)}
          placeholder="https://example.com/logo-square.png"
        />
        <ImagePreview
          src={editor.formState.squareLogoPath}
          alt="正方形ロゴプレビュー"
          className="h-12 w-12"
        />
      </div>

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
        <ImagePreview
          src={faviconPreviewSrc}
          alt="Faviconプレビュー"
          className="h-8 w-8"
        />
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
