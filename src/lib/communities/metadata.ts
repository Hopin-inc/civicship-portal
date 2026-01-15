import { Metadata } from "next";
import { DEFAULT_ASSET_PATHS } from "./constants";
import {
  getCommunityConfig,
  type CommunityPortalConfig,
  type CommunityDocumentConfig,
} from "./config";

export type FeaturesType =
  | "places"
  | "opportunities"
  | "points"
  | "tickets"
  | "articles"
  | "prefectures"
  | "credentials"
  | "justDaoIt"
  | "quests"
  | "languageSwitcher";

/**
 * コミュニティの規約・文書の定義
 */
export interface CommunityDocument {
  /** 文書のID（一意識別子） */
  id: string;

  /** 表示名 */
  title: string;

  /** ファイルパスまたはURL */
  path: string;

  /**
   * リンクタイプ
   * - 'external': 外部リンク（PDF等、新しいタブで開く）
   * - 'internal': 内部ページ（Next.js Link使用）
   */
  type: "external" | "internal";

  /**
   * 表示順序（小さい順に表示）
   * 指定しない場合は定義順
   */
  order?: number;
}

// コミュニティごとのベース設定
export interface CommunityBaseConfig {
  id: string;
  tokenName: string;
  title: string;
  description: string;
  shortDescription?: string;
  domain: string;
  faviconPrefix: string;
  logoPath: string;
  squareLogoPath: string;
  ogImagePath: string;
  enableFeatures: FeaturesType[];
  rootPath?: string;
  adminRootPath?: string;
  /** コミュニティ固有の規約・文書リスト */
  documents?: CommunityDocument[];
  /** 共通文書（利用規約・プライバシーポリシー）のオーバーライド */
  commonDocumentOverrides?: {
    terms?: CommunityDocument;
    privacy?: CommunityDocument;
  };
}

// コミュニティごとのメタデータ型定義
export interface CommunityMetadata {
  title: string;
  description: string;
  icons: Metadata["icons"];
  openGraph: Metadata["openGraph"];
  alternates?: Metadata["alternates"];
  logo: {
    url: string;
    alt: string;
  };
}

/**
 * @deprecated Use URL path-based routing instead. This constant is kept for backward compatibility.
 */
export const COMMUNITY_ID = "default";

/**
 * Get region name for a specific community
 * @param communityId - Community ID from URL path parameter
 */
export function getRegionName(communityId: string): string {
  if (communityId === "neo88") return "四国";
  if (communityId === "kibotcha") return "東松島";
  if (communityId === "dais") return "四国";
  return "地域";
}

/**
 * Get region key for a specific community
 * @param communityId - Community ID from URL path parameter
 */
export function getRegionKey(communityId: string): string {
  if (communityId === "neo88") return "common.regions.shikoku";
  if (communityId === "kibotcha") return "common.regions.higashimatsushima";
  if (communityId === "dais") return "common.regions.shikoku";
  return "common.regions.default";
}

// ============================================================================
// DB-based community config functions
// These functions fetch community config from the database with fallback to
// hardcoded config for backward compatibility.
// ============================================================================

/**
 * Convert DB portal config to CommunityBaseConfig format
 */
function convertPortalConfigToBaseConfig(
  portalConfig: CommunityPortalConfig,
): CommunityBaseConfig {
  return {
    id: portalConfig.communityId,
    tokenName: portalConfig.tokenName,
    title: portalConfig.title,
    description: portalConfig.description,
    shortDescription: portalConfig.shortDescription ?? undefined,
    domain: portalConfig.domain,
    faviconPrefix: portalConfig.faviconPrefix,
    logoPath: portalConfig.logoPath,
    squareLogoPath: portalConfig.squareLogoPath,
    ogImagePath: portalConfig.ogImagePath,
    enableFeatures: portalConfig.enableFeatures as FeaturesType[],
    rootPath: portalConfig.rootPath,
    adminRootPath: portalConfig.adminRootPath,
    documents: portalConfig.documents?.map(
      (doc: CommunityDocumentConfig): CommunityDocument => ({
        id: doc.id,
        title: doc.title,
        path: doc.path,
        type: doc.type as "external" | "internal",
        order: doc.order,
      }),
    ),
    commonDocumentOverrides: portalConfig.commonDocumentOverrides
      ? {
          terms: portalConfig.commonDocumentOverrides.terms
            ? {
                id: portalConfig.commonDocumentOverrides.terms.id,
                title: portalConfig.commonDocumentOverrides.terms.title,
                path: portalConfig.commonDocumentOverrides.terms.path,
                type: portalConfig.commonDocumentOverrides.terms.type as "external" | "internal",
              }
            : undefined,
          privacy: portalConfig.commonDocumentOverrides.privacy
            ? {
                id: portalConfig.commonDocumentOverrides.privacy.id,
                title: portalConfig.commonDocumentOverrides.privacy.title,
                path: portalConfig.commonDocumentOverrides.privacy.path,
                type: portalConfig.commonDocumentOverrides.privacy.type as "external" | "internal",
              }
            : undefined,
        }
      : undefined,
  };
}

/**
 * Get community config from DB with fallback to hardcoded config
 * This is an async function that should be called in Server Components
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export async function getCommunityConfigFromDB(communityId: string): Promise<CommunityBaseConfig> {
  // Try to fetch from DB first
  const portalConfig = await getCommunityConfig(communityId);

  if (portalConfig) {
    return convertPortalConfigToBaseConfig(portalConfig);
  } else {
    throw new Error(`Failed to fetch community config for ${communityId}`);
  }
}

/**
 * Get region name from DB config or fallback to hardcoded logic
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export async function getRegionNameFromDB(communityId: string): Promise<string> {
  const portalConfig = await getCommunityConfig(communityId);

  if (portalConfig?.regionName) {
    return portalConfig.regionName;
  }

  // Fallback to hardcoded logic
  return getRegionName(communityId);
}

/**
 * Get region key from DB config or fallback to hardcoded logic
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export async function getRegionKeyFromDB(communityId: string): Promise<string> {
  const portalConfig = await getCommunityConfig(communityId);

  if (portalConfig?.regionKey) {
    return portalConfig.regionKey;
  }

  // Fallback to hardcoded logic
  return getRegionKey(communityId);
}

/**
 * Get community metadata from DB with fallback to hardcoded config
 * This is an async function that should be called in Server Components
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export async function getCommunityMetadataFromDB(communityId: string): Promise<CommunityMetadata> {
  const config = await getCommunityConfigFromDB(communityId);
  return {
    title: config.title,
    description: config.description,
    icons: {
      icon: [
        {
          url: config.faviconPrefix
            ? `${config.faviconPrefix}/favicon.ico`
            : DEFAULT_ASSET_PATHS.FAVICON,
        },
      ],
      apple: [
        {
          url: config.faviconPrefix
            ? `${config.faviconPrefix}/apple-touch-icon.png`
            : DEFAULT_ASSET_PATHS.APPLE_TOUCH_ICON,
        },
      ],
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.domain,
      siteName: config.title,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: config.ogImagePath,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    alternates: {
      canonical: config.domain,
    },
    logo: {
      url: config.logoPath ?? DEFAULT_ASSET_PATHS.LOGO,
      alt: config.title,
    },
  };
}
