import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";

/**
 * 指定された機能が有効かどうかを判定するカスタムフック
 * @param targetFeatures チェックしたい機能の配列
 * @returns 指定された機能のいずれかが有効かどうかの真偽値
 */
export function useFeatureCheck(targetFeatures: readonly FeaturesType[]): boolean {
  const shouldShowFeature = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  return shouldShowFeature;
}

/**
 * 複数の機能チェックを同時に行うカスタムフック
 * @param featureChecks 機能チェックの設定オブジェクト
 * @returns 各機能の有効/無効状態を含むオブジェクト
 */
export function useMultipleFeatureChecks<T extends Record<string, readonly FeaturesType[]>>(
  featureChecks: T,
): Record<keyof T, boolean> {
  const result = {} as Record<keyof T, boolean>;

  for (const key in featureChecks) {
    if (Object.prototype.hasOwnProperty.call(featureChecks, key)) {
      const features = featureChecks[key];
      result[key] = features.some((feature) =>
        currentCommunityConfig.enableFeatures.includes(feature),
      );
    }
  }

  return result;
} 