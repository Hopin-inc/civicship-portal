import { COMMUNITY_ID } from "@/utils";

export interface CommunityAssets {
  favicon: string;
  logo: string;
  logoSquare: string;
  ogImage: string;
  placeholder: string;
}

export interface AssetConfig {
  useCloudStorage: boolean;
  cloudStorageBaseUrl: string;
  localAssetPath: string;
}

const DEFAULT_ASSET_CONFIG: AssetConfig = {
  useCloudStorage: true,
  cloudStorageBaseUrl: "https://storage.googleapis.com/prod-civicship-storage-public/asset",
  localAssetPath: "/community"
};

const getAssetConfig = (communityId: string = COMMUNITY_ID): AssetConfig => {
  const configs: Record<string, Partial<AssetConfig>> = {
    "neo88": {
      useCloudStorage: true,
      cloudStorageBaseUrl: "https://storage.googleapis.com/prod-civicship-storage-public/asset",
    }
  };
  
  return {
    ...DEFAULT_ASSET_CONFIG,
    ...configs[communityId]
  };
};

export const getCommunityAssets = (communityId: string = COMMUNITY_ID): CommunityAssets => {
  const config = getAssetConfig(communityId);
  
  if (config.useCloudStorage) {
    const cloudBase = `${config.cloudStorageBaseUrl}/${communityId}`;
    return {
      favicon: `${cloudBase}/favicon.ico`,
      logo: `${cloudBase}/logo.jpg`,
      logoSquare: `${cloudBase}/logo-square.jpg`,
      ogImage: `${cloudBase}/ogp.jpg`,
      placeholder: `${cloudBase}/placeholder.jpg`
    };
  } else {
    const localBase = `${config.localAssetPath}/${communityId}`;
    return {
      favicon: `${localBase}/favicon.ico`,
      logo: `${localBase}/logo.jpg`,
      logoSquare: `${localBase}/logo-square.jpg`,
      ogImage: `${localBase}/ogp.jpg`,
      placeholder: `${localBase}/placeholder.jpg`
    };
  }
};

export const getCommunityFavicon = (communityId: string = COMMUNITY_ID): string => {
  return getCommunityAssets(communityId).favicon;
};

export const getCommunityLogo = (communityId: string = COMMUNITY_ID): string => {
  return getCommunityAssets(communityId).logo;
};

export const getCommunityLogoSquare = (communityId: string = COMMUNITY_ID): string => {
  return getCommunityAssets(communityId).logoSquare;
};

export const getCommunityPlaceholder = (communityId: string = COMMUNITY_ID): string => {
  return getCommunityAssets(communityId).placeholder;
};

export const getCommunityOgImage = (communityId: string = COMMUNITY_ID): string => {
  return getCommunityAssets(communityId).ogImage;
};

export const getAssetWithFallback = (
  primaryAsset: string,
  fallbackAsset: string = "/images/placeholder.jpg"
): string => {
  return primaryAsset || fallbackAsset;
};
