"use client";

import { SheetType } from "../types/settings";
import { IMAGE_SIZES, IMAGE_FIELD_CONFIG } from "../constants/settings";
import { EditTextSheet } from "./sheets/EditTextSheet";
import { EditImageSheet } from "./sheets/EditImageSheet";

interface PortalSettingsSheetsProps {
  activeSheet: SheetType;
  onSheetChange: (sheet: SheetType) => void;

  // テキスト値
  title: string;
  description: string;

  // 画像値
  squareLogoPath: string | null;
  logoPath: string | null;
  ogImagePath: string | null;
  faviconPrefix: string | null;

  // 保存ハンドラ
  onSaveTitle: (value: string) => Promise<void>;
  onSaveDescription: (value: string) => Promise<void>;
  onSaveSquareLogo: (file: File | null) => Promise<boolean>;
  onSaveLogo: (file: File | null) => Promise<boolean>;
  onSaveOgImage: (file: File | null) => Promise<boolean>;
  onSaveFavicon: (file: File | null) => Promise<boolean>;

  saving?: boolean;
}

export function PortalSettingsSheets({
  activeSheet,
  onSheetChange,

  title,
  description,

  squareLogoPath,
  logoPath,
  ogImagePath,
  faviconPrefix,

  onSaveTitle,
  onSaveDescription,
  onSaveSquareLogo,
  onSaveLogo,
  onSaveOgImage,
  onSaveFavicon,

  saving = false,
}: PortalSettingsSheetsProps) {
  return (
    <>
      {/* タイトル編集 */}
      <EditTextSheet
        open={activeSheet === "title"}
        onOpenChange={(open) => onSheetChange(open ? "title" : null)}
        title="名前を編集"
        value={title}
        onSave={onSaveTitle}
        placeholder="コミュニティ名"
        maxLength={100}
        saving={saving}
      />

      {/* 概要編集 */}
      <EditTextSheet
        open={activeSheet === "description"}
        onOpenChange={(open) => onSheetChange(open ? "description" : null)}
        title="概要を編集"
        value={description}
        onSave={onSaveDescription}
        placeholder="コミュニティの概要を入力"
        multiline
        maxLength={500}
        saving={saving}
      />

      {/* ロゴ(正方形)編集 */}
      <EditImageSheet
        open={activeSheet === "squareLogo"}
        onOpenChange={(open) => onSheetChange(open ? "squareLogo" : null)}
        title={IMAGE_FIELD_CONFIG.squareLogo.editTitle}
        currentImageUrl={squareLogoPath}
        onSave={onSaveSquareLogo}
        recommendedSize={IMAGE_SIZES.squareLogo}
        description={IMAGE_FIELD_CONFIG.squareLogo.description}
        saving={saving}
      />

      {/* ロゴ(横長)編集 */}
      <EditImageSheet
        open={activeSheet === "logo"}
        onOpenChange={(open) => onSheetChange(open ? "logo" : null)}
        title={IMAGE_FIELD_CONFIG.logo.editTitle}
        currentImageUrl={logoPath}
        onSave={onSaveLogo}
        recommendedSize={IMAGE_SIZES.logo}
        description={IMAGE_FIELD_CONFIG.logo.description}
        saving={saving}
      />

      {/* OG画像編集 */}
      <EditImageSheet
        open={activeSheet === "ogImage"}
        onOpenChange={(open) => onSheetChange(open ? "ogImage" : null)}
        title={IMAGE_FIELD_CONFIG.ogImage.editTitle}
        currentImageUrl={ogImagePath}
        onSave={onSaveOgImage}
        recommendedSize={IMAGE_SIZES.ogImage}
        description={IMAGE_FIELD_CONFIG.ogImage.description}
        saving={saving}
      />

      {/* ファビコン編集 */}
      <EditImageSheet
        open={activeSheet === "favicon"}
        onOpenChange={(open) => onSheetChange(open ? "favicon" : null)}
        title={IMAGE_FIELD_CONFIG.favicon.editTitle}
        currentImageUrl={faviconPrefix}
        onSave={onSaveFavicon}
        recommendedSize={IMAGE_SIZES.favicon}
        description={IMAGE_FIELD_CONFIG.favicon.description}
        acceptSvg={IMAGE_FIELD_CONFIG.favicon.acceptSvg}
        saving={saving}
      />
    </>
  );
}
