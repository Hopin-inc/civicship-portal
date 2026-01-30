"use client";

import { useCallback, useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ItemGroup, ItemSeparator, Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

import { FeatureKey, SheetType } from "./features/editor/types/settings";
import { usePortalConfigSheets } from "./features/editor/hooks/usePortalConfigSheets";
import { usePortalConfigSave } from "./features/editor/hooks/usePortalConfigSave";
import { BasicInfoSection } from "./features/editor/components/sections/BasicInfoSection";
import { BrandingSection } from "./features/editor/components/sections/BrandingSection";
import { FeaturesSection } from "./features/editor/components/sections/FeaturesSection";
import { PortalSettingsSheets } from "./features/editor/components/PortalSettingsSheets";

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
  const [features, setFeatures] = useState<FeatureKey[]>(
    (communityConfig?.enableFeatures ?? []) as FeatureKey[],
  );

  const handleFeatureToggle = useCallback(
    async (featureKey: FeatureKey, checked: boolean) => {
      const newFeatures = checked
        ? [...features, featureKey]
        : features.filter((f) => f !== featureKey);

      setFeatures(newFeatures);
      await save.saveFeatures(newFeatures);
    },
    [features, save],
  );

  const handleTitleSave = useCallback(
    async (value: string) => {
      const success = await save.saveTitle(value);
      if (success) {
        setLocalTitle(value);
      }
    },
    [save],
  );

  const handleDescriptionSave = useCallback(
    async (value: string) => {
      const success = await save.saveDescription(value);
      if (success) {
        setLocalDescription(value);
      }
    },
    [save],
  );

  const handleItemClick = useCallback(
    (sheet: SheetType) => {
      sheets.openSheet(sheet);
    },
    [sheets],
  );

  if (!communityConfig) {
    return null;
  }

  const { title, description, squareLogoPath, logoPath, ogImagePath, faviconPrefix } =
    communityConfig;

  const displayTitle = localTitle || title;
  const displayDescription = localDescription || description;

  return (
    <>
      <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
        <section>
          <div className="space-y-2">
            {/* 基本情報 */}
            <BasicInfoSection
              title={displayTitle}
              description={displayDescription}
              onItemClick={handleItemClick}
            />

            {/* ブランディング（画像系） */}
            <BrandingSection
              squareLogoPath={squareLogoPath}
              logoPath={logoPath}
              ogImagePath={ogImagePath}
              faviconPrefix={faviconPrefix}
              onItemClick={handleItemClick}
            />

            {/* 利用機能 */}
            <ItemGroup className="border rounded-lg">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle className="flex items-center font-bold gap-2">利用機能</ItemTitle>
                </ItemContent>
              </Item>
              <ItemSeparator />
              <FeaturesSection
                features={features}
                onFeatureToggle={handleFeatureToggle}
                disabled={save.saving}
              />
            </ItemGroup>
          </div>
        </section>
      </div>

      {/* 編集シート */}
      <PortalSettingsSheets
        activeSheet={sheets.activeSheet}
        onSheetChange={sheets.setActiveSheet}
        title={displayTitle}
        description={displayDescription}
        squareLogoPath={squareLogoPath}
        logoPath={logoPath}
        ogImagePath={ogImagePath}
        faviconPrefix={faviconPrefix}
        onSaveTitle={handleTitleSave}
        onSaveDescription={handleDescriptionSave}
        onSaveSquareLogo={save.saveSquareLogo}
        onSaveLogo={save.saveLogo}
        onSaveOgImage={save.saveOgImage}
        onSaveFavicon={save.saveFavicon}
        saving={save.saving}
      />
    </>
  );
}
