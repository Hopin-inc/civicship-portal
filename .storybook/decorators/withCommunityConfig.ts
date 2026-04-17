import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import { CommunityConfigProvider } from "../../src/contexts/CommunityConfigContext";
import type { CommunityPortalConfig } from "../../src/lib/communities/config";

/**
 * Storybook 用の最小 CommunityPortalConfig。
 * 実 API は叩かず、AppLink 等のパス解決に使う communityId だけを保証する。
 */
const mockCommunityConfig: CommunityPortalConfig = {
  communityId: "storybook",
  tokenName: "POINT",
  title: "Storybook",
  description: "Storybook mock community",
  shortDescription: null,
  domain: "storybook.local",
  faviconPrefix: "/favicon",
  logoPath: "/logo.svg",
  squareLogoPath: "/logo-square.svg",
  ogImagePath: "/og.png",
  enableFeatures: [],
  rootPath: "/",
  adminRootPath: "/admin",
  documents: null,
  commonDocumentOverrides: null,
  regionName: null,
  regionKey: null,
  liffId: null,
  liffAppId: null,
  liffBaseUrl: null,
  firebaseTenantId: null,
};

/**
 * useCommunityConfig() / AppLink 等が成立するよう、実物の
 * CommunityConfigProvider に最小 config を与える。
 */
export const withCommunityConfig: Decorator = (Story) =>
  React.createElement(
    CommunityConfigProvider,
    { config: mockCommunityConfig, isFromDatabase: false },
    React.createElement(Story),
  );
