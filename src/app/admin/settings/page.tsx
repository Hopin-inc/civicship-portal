"use client";

import { useMemo, useState, useCallback } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ChevronRight } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { usePortalConfigSheets, SheetType } from "./hooks/usePortalConfigSheets";
import { usePortalConfigSave } from "./hooks/usePortalConfigSave";
import { EditTextSheet } from "./components/sheets/EditTextSheet";
import { EditImageSheet } from "./components/sheets/EditImageSheet";

type FeatureKey = "opportunities" | "points" | "tickets" | "credentials";

export default function AdminSettingsPage() {
  const communityConfig = useCommunityConfig();
  const sheets = usePortalConfigSheets();
  const save = usePortalConfigSave({ communityId: communityConfig?.communityId ?? "" });

  const headerConfig = useMemo(
    () => ({
      title: "設定",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  // ローカルステート（編集後の値を保持）
  const [localTitle, setLocalTitle] = useState(communityConfig?.title ?? "");
  const [localDescription, setLocalDescription] = useState(communityConfig?.description ?? "");
  const [features, setFeatures] = useState<string[]>(
    communityConfig?.enableFeatures ?? []
  );

  const handleFeatureToggle = useCallback(async (featureKey: FeatureKey, checked: boolean) => {
    const newFeatures = checked
      ? [...features, featureKey]
      : features.filter((f) => f !== featureKey);

    setFeatures(newFeatures);
    await save.saveFeatures(newFeatures);
  }, [features, save]);

  const handleTitleSave = useCallback(async (value: string) => {
    const success = await save.saveTitle(value);
    if (success) {
      setLocalTitle(value);
    }
  }, [save]);

  const handleDescriptionSave = useCallback(async (value: string) => {
    const success = await save.saveDescription(value);
    if (success) {
      setLocalDescription(value);
    }
  }, [save]);

  const handleItemClick = (sheet: SheetType) => {
    sheets.openSheet(sheet);
  };

  if (!communityConfig) {
    return null;
  }

  const {
    title,
    description,
    squareLogoPath,
    logoPath,
    ogImagePath,
    faviconPrefix,
  } = communityConfig;

  // ローカルで更新された値を優先表示
  const displayTitle = localTitle || title;
  const displayDescription = localDescription || description;

  return (
    <>
      <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
        <section>
          <div className="space-y-2">
            {/* 名前 */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => handleItemClick("title")}
            >
              <ItemContent>
                <ItemTitle className="font-bold">名前</ItemTitle>
                <ItemDescription className="whitespace-pre-wrap">{displayTitle}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>

            {/* 概要 */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => handleItemClick("description")}
            >
              <ItemContent>
                <ItemTitle className="font-bold">概要</ItemTitle>
                <ItemDescription className="whitespace-pre-wrap line-clamp-2">
                  {displayDescription}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>

            {/* ロゴ(正方形) - 右側にプレビュー */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => handleItemClick("squareLogo")}
            >
              <ItemContent>
                <ItemTitle className="font-bold">ロゴ(正方形)</ItemTitle>
              </ItemContent>
              <ItemActions className="flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded-md border">
                  <AvatarImage src={squareLogoPath} alt="正方形ロゴ" />
                  <AvatarFallback className="rounded-md bg-muted text-xs">
                    {displayTitle?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>

            {/* ロゴ(横長) - 右側にプレビュー */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => handleItemClick("logo")}
            >
              <ItemContent>
                <ItemTitle className="font-bold">ロゴ(横長)</ItemTitle>
              </ItemContent>
              <ItemActions className="flex items-center gap-2">
                {logoPath ? (
                  <div className="h-8 w-20 relative border rounded overflow-hidden bg-muted">
                    <Image
                      src={logoPath}
                      alt="横長ロゴ"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-20 border rounded bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">未設定</span>
                  </div>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>

            {/* OG画像 - 下にプレビュー */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer flex-col items-stretch"
              onClick={() => handleItemClick("ogImage")}
            >
              <div className="flex items-center justify-between w-full">
                <ItemContent>
                  <ItemTitle className="font-bold">OG画像</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </ItemActions>
              </div>
              {ogImagePath ? (
                <div className="mt-2 w-full aspect-[1.91/1] relative border rounded overflow-hidden bg-muted">
                  <Image
                    src={ogImagePath}
                    alt="OG画像"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mt-2 w-full aspect-[1.91/1] border rounded bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">未設定</span>
                </div>
              )}
            </Item>

            {/* ファビコン */}
            <Item
              size="sm"
              variant="outline"
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => handleItemClick("favicon")}
            >
              <ItemContent>
                <ItemTitle className="font-bold">ファビコン</ItemTitle>
                <ItemDescription className="whitespace-pre-wrap">
                  {faviconPrefix || "未設定"}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex items-center gap-2">
                {faviconPrefix && (
                  <div className="h-6 w-6 relative">
                    <Image
                      src={`/${faviconPrefix}-32x32.png`}
                      alt="ファビコン"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>

            {/* 利用機能 */}
            <ItemGroup className="border rounded-lg">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle className="flex items-center font-bold gap-2">利用機能</ItemTitle>
                </ItemContent>
              </Item>

              <Item size="sm">
                <ItemContent>
                  <ItemTitle>募集</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground">
                    ボランティア募集機能を有効にする
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={features.includes("opportunities")}
                    onCheckedChange={(checked) => handleFeatureToggle("opportunities", checked)}
                    disabled={save.saving}
                  />
                </ItemActions>
              </Item>
              <ItemSeparator />

              <Item size="sm">
                <ItemContent>
                  <ItemTitle>ポイント</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground">
                    ポイント・ウォレット機能を有効にする
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={features.includes("points")}
                    onCheckedChange={(checked) => handleFeatureToggle("points", checked)}
                    disabled={save.saving}
                  />
                </ItemActions>
              </Item>
              <ItemSeparator />

              <Item size="sm">
                <ItemContent>
                  <ItemTitle>チケット</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground">
                    チケット機能を有効にする
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={features.includes("tickets")}
                    onCheckedChange={(checked) => handleFeatureToggle("tickets", checked)}
                    disabled={save.saving}
                  />
                </ItemActions>
              </Item>
              <ItemSeparator />

              <Item size="sm">
                <ItemContent>
                  <ItemTitle>証明書</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground">
                    証明書発行機能を有効にする
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={features.includes("credentials")}
                    onCheckedChange={(checked) => handleFeatureToggle("credentials", checked)}
                    disabled={save.saving}
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </section>
      </div>

      {/* 編集シート */}
      <EditTextSheet
        open={sheets.isOpen("title")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="名前を編集"
        value={displayTitle}
        onSave={handleTitleSave}
        placeholder="ポータル名を入力"
        maxLength={100}
        saving={save.saving}
      />

      <EditTextSheet
        open={sheets.isOpen("description")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="概要を編集"
        value={displayDescription}
        onSave={handleDescriptionSave}
        placeholder="概要を入力"
        multiline
        maxLength={500}
        saving={save.saving}
      />

      <EditImageSheet
        open={sheets.isOpen("squareLogo")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="ロゴ(正方形)を編集"
        currentImageUrl={squareLogoPath}
        onSave={save.saveSquareLogo}
        aspectRatio="1/1"
        description="正方形のロゴ画像をアップロードしてください"
        saving={save.saving}
      />

      <EditImageSheet
        open={sheets.isOpen("logo")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="ロゴ(横長)を編集"
        currentImageUrl={logoPath}
        onSave={save.saveLogo}
        aspectRatio="5/2"
        description="横長のロゴ画像をアップロードしてください"
        saving={save.saving}
      />

      <EditImageSheet
        open={sheets.isOpen("ogImage")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="OG画像を編集"
        currentImageUrl={ogImagePath}
        onSave={save.saveOgImage}
        aspectRatio="1.91/1"
        description="SNSシェア時に表示される画像をアップロードしてください"
        saving={save.saving}
      />

      <EditTextSheet
        open={sheets.isOpen("favicon")}
        onOpenChange={(open) => !open && sheets.closeSheet()}
        title="ファビコンプレフィックスを編集"
        value={faviconPrefix ?? ""}
        onSave={save.saveFavicon}
        placeholder="favicon"
        maxLength={50}
        saving={save.saving}
      />
    </>
  );
}
