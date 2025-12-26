import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { FeaturesType } from "@/lib/communities/metadata";

/**
 * 指定された機能が有効かどうかを判定するカスタムフック
 * @param targetFeature チェックしたい機能
 * @returns 指定された機能が有効かどうかの真偽値
 */
export function useFeatureCheck(targetFeature: FeaturesType): boolean {
  const communityConfig = useCommunityConfig();
  const shouldShowFeature = communityConfig?.enableFeatures?.includes(targetFeature) ?? false;

  return shouldShowFeature;
}
