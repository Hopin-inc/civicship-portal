import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

/**
 * 指定された機能が有効かどうかを判定するカスタムフック
 * @param targetFeature チェックしたい機能
 * @returns 指定された機能が有効かどうかの真偽値
 */
export function useFeatureCheck(targetFeature: string): boolean {
  const communityConfig = useCommunityConfig();
  const shouldShowFeature = communityConfig?.enableFeatures?.includes(targetFeature) ?? false;

  return shouldShowFeature;
}
