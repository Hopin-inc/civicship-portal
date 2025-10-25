/**
 * コミュニティID型定義
 */
export type CommunityId = "neo88" | "kibotcha" | "dais" | "kotohira" | "himeji-ymca" | "izu";

/**
 * コミュニティ固有の認証設定
 */
export interface CommunityAuthConfig {
  tenantId: string;
  liffId: string;
  lineClient: string;
}

/**
 * コミュニティ固有の認証設定レジストリ
 * 環境変数がない場合のフォールバックとして使用
 */
const AUTH_BY_COMMUNITY: Record<CommunityId, CommunityAuthConfig> = {
  neo88: {
    tenantId: "neo88-5qtpy",
    liffId: "2007251473-yJNnzapO",
    lineClient: "2007251473",
  },
  kibotcha: {
    tenantId: "kibotcha-sff2c",
    liffId: "2007594502-amjOlNx",
    lineClient: "2007594502",
  },
  dais: {
    tenantId: "neo88-5qtpy",
    liffId: "2007251473-yJNnzapO",
    lineClient: "2007251473",
  },
  kotohira: {
    tenantId: "kotohira-xxxxx", // TODO: 実際の値に置き換え
    liffId: "kotohira-liff-id",
    lineClient: "kotohira-client",
  },
  "himeji-ymca": {
    tenantId: "himeji-ymca-xxxxx", // TODO: 実際の値に置き換え
    liffId: "himeji-ymca-liff-id",
    lineClient: "himeji-ymca-client",
  },
  izu: {
    tenantId: "izu-xxxxx", // TODO: 実際の値に置き換え
    liffId: "izu-liff-id",
    lineClient: "izu-client",
  },
};

/**
 * 環境変数からコミュニティIDを取得
 */
export function getEnvCommunityId(): string | null {
  return process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
}

/**
 * 環境変数から認証設定を取得
 */
export function getEnvAuthConfig(): Partial<CommunityAuthConfig> {
  return {
    tenantId: process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
    liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    lineClient: process.env.NEXT_PUBLIC_LINE_CLIENT,
  };
}

/**
 * ドメインからコミュニティIDへのマッピング
 */
export const DOMAIN_TO_COMMUNITY: Record<string, CommunityId> = {
  "www.neo88.app": "neo88",
  "kibotcha.civicship.jp": "kibotcha",
  "dais.civicship.jp": "dais",
  "kotohira.civicship.app": "kotohira",
  "himeji-ymca.civicship.jp": "himeji-ymca",
  "izu.civicship.app": "izu",

  "dev.neo88.app": "neo88",
  "dev-kibotcha.civicship.jp": "kibotcha",
  "dev-dais.civicship.jp": "dais",
  "dev-kotohira.civicship.app": "kotohira",
  "dev-himeji-ymca.civicship.jp": "himeji-ymca",
  "dev-izu.civicship.app": "izu",

  localhost: "neo88",
  "localhost:3000": "neo88",
};

/**
 * ホスト名からコミュニティIDを解決
 */
export function resolveCommunityIdFromHost(host: string): CommunityId {
  const communityId = DOMAIN_TO_COMMUNITY[host];
  if (!communityId) {
    console.warn(`Unknown host: ${host}, falling back to neo88`);
    return "neo88";
  }
  return communityId;
}

/**
 * コミュニティIDから認証設定を取得
 * 環境変数優先、なければレジストリから取得
 */
export function getAuthForCommunity(communityId: CommunityId): CommunityAuthConfig {
  const env = getEnvAuthConfig();
  const fallback = AUTH_BY_COMMUNITY[communityId];

  return {
    tenantId: env.tenantId ?? fallback.tenantId,
    liffId: env.liffId ?? fallback.liffId,
    lineClient: env.lineClient ?? fallback.lineClient,
  };
}
