import { logger } from "@/lib/logging";

export type CommunityId = "neo88" | "kibotcha" | "dais" | "kotohira" | "himeji-ymca" | "izu";

export const COMMUNITY_IDS = ["neo88", "kibotcha", "dais", "kotohira", "himeji-ymca", "izu"] as const;

export interface CommunityAuthConfig {
  tenantId: string;
  liffId: string;
  lineClient: string;
}

export function isValidCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && COMMUNITY_IDS.includes(value as CommunityId);
}

const AUTH_BY_COMMUNITY_COMMENT = `
本番環境では環境変数（NEXT_PUBLIC_*）が優先されるため、
このレジストリのダミー値は使用されません。
開発時は .env.local で環境変数を設定してください。
`;
void AUTH_BY_COMMUNITY_COMMENT;
const AUTH_BY_COMMUNITY: Record<CommunityId, CommunityAuthConfig> = {
  neo88: {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
  kibotcha: {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
  dais: {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
  kotohira: {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
  "himeji-ymca": {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
  izu: {
    tenantId: "dummy-tenant-id",
    liffId: "dummy-liff-id",
    lineClient: "dummy-line-client",
  },
};

export function getEnvCommunityId(): string | null {
  return process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
}

export function getEnvAuthConfig(): Partial<CommunityAuthConfig> {
  return {
    tenantId: process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
    liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    lineClient: process.env.NEXT_PUBLIC_LINE_CLIENT,
  };
}


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

export function resolveCommunityIdFromHost(host: string): CommunityId {
  const communityId = DOMAIN_TO_COMMUNITY[host];
  if (!communityId) {
    logger.warn(`Unknown host: ${host}, falling back to neo88`, { host });
    return "neo88";
  }
  return communityId;
}

export function normalizeCommunityId(envId: string | null, host: string): CommunityId {
  if (envId && isValidCommunityId(envId)) {
    return envId;
  }
  
  if (envId && !isValidCommunityId(envId)) {
    logger.warn(`Invalid NEXT_PUBLIC_COMMUNITY_ID: ${envId}, resolving from host`, { envId, host });
  }
  
  return resolveCommunityIdFromHost(host);
}

export function getAuthForCommunity(input?: string | null): CommunityAuthConfig {
  const env = getEnvAuthConfig();
  
  let validCommunityId: CommunityId;
  if (input && isValidCommunityId(input)) {
    validCommunityId = input;
  } else {
    if (input) {
      const logLevel = process.env.NODE_ENV === "production" ? "error" : "warn";
      logger[logLevel](`Invalid communityId: ${input}, falling back to neo88`, { input });
    }
    validCommunityId = "neo88";
  }
  
  const fallback = AUTH_BY_COMMUNITY[validCommunityId];

  const usingFallback = !env.tenantId || !env.liffId || !env.lineClient;
  if (usingFallback && process.env.NODE_ENV === "production") {
    logger.error(
      `[getAuthForCommunity] Production environment missing required env vars for ${validCommunityId}. ` +
      `Set NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID, NEXT_PUBLIC_LIFF_ID, NEXT_PUBLIC_LINE_CLIENT.`,
      { communityId: validCommunityId }
    );
  }

  return {
    tenantId: env.tenantId ?? fallback.tenantId,
    liffId: env.liffId ?? fallback.liffId,
    lineClient: env.lineClient ?? fallback.lineClient,
  };
}
