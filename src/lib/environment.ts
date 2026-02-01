/**
 * 環境判定ユーティリティ
 */

// Dev環境（Staging）の判定
// Workflow/Dockerfile で明示的に注入された ENV を参照
export const isStaging = process.env.ENV === "staging";

// 本番環境の判定
// NODE_ENV が production かつ、Staging でない場合を真の本番とする
export const isProduction =
    process.env.NODE_ENV === "production" && !isStaging;

// ローカル環境の判定
export const isLocal = process.env.ENV === "LOCAL" || process.env.NODE_ENV === "development";

// Storybook環境の判定
export const isStorybook = process.env.ENV === "STORYBOOK";
