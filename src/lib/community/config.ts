/**
 * Community configuration management
 * Provides centralized access to community-specific settings
 */

declare const process: {
  env: {
    NEXT_PUBLIC_COMMUNITY_ID?: string;
    [key: string]: string | undefined;
  };
};

/**
 * Get the current community ID from environment variables
 * Falls back to "neo88" for backward compatibility
 */
export const getCommunityId = (): string => {
  return (process.env.NEXT_PUBLIC_COMMUNITY_ID as string) || "neo88";
};

/**
 * Check if the application is running in multi-tenant mode
 */
export const isMultiTenantMode = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_COMMUNITY_ID as string);
};

/**
 * Community configuration type
 */
export interface CommunityConfig {
  id: string;
  isMultiTenant: boolean;
}

/**
 * Get complete community configuration
 */
export const getCommunityConfig = (): CommunityConfig => {
  return {
    id: getCommunityId(),
    isMultiTenant: isMultiTenantMode(),
  };
};
