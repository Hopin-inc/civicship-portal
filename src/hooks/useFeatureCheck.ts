import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";

//単一の機能チェックを行いたい場合
export function useFeatureCheck(targetFeatures: readonly FeaturesType[]) {
  const shouldShowFeature = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  return shouldShowFeature;
}
//複数の機能チェックを同時に行いたい場合
export function useMultipleFeatureChecks<T extends Record<string, readonly FeaturesType[]>>(
  featureChecks: T,
) {
  const result = {} as Record<keyof T, boolean>;

  for (const [key, features] of Object.entries(featureChecks)) {
    result[key as keyof T] = features.some((feature) =>
      currentCommunityConfig.enableFeatures.includes(feature),
    );
  }

  return result;
} 