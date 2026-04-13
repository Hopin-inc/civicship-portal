"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityProfileEditor } from "../hooks/useCommunityProfileEditor";

function RequiredBadge() {
  return (
    <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
      必須
    </span>
  );
}

interface CommunitySettingFormProps {
  editor: ReturnType<typeof useCommunityProfileEditor>;
  onSubmit: (e: FormEvent) => void;
}

export function CommunitySettingForm({ editor, onSubmit }: CommunitySettingFormProps) {
  const t = useTranslations();

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

      {/* トークン名 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.tokenName")}</span>
          <RequiredBadge />
        </div>
        <Input
          value={editor.formState.tokenName}
          onChange={(e) => editor.updateField("tokenName", e.target.value)}
          placeholder={t("adminSetting.form.tokenName")}
          className={editor.errors.tokenName ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {editor.errors.tokenName && (
          <p className="text-xs text-destructive px-1">{editor.errors.tokenName}</p>
        )}
      </div>

      {/* ロゴ画像パス */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">{t("adminSetting.form.logoPath")}</span>
        </div>
        <Input
          value={editor.formState.logoPath}
          onChange={(e) => editor.updateField("logoPath", e.target.value)}
          placeholder="/logos/logo.png"
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
          placeholder="/logos/logo-square.png"
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
