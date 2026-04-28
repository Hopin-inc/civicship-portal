import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  viteFinal: async (viteConfig) => {
    viteConfig.define = {
      ...viteConfig.define,
      // src/lib/environment.ts の isStorybook 判定をビルド時に true にする。
      "process.env.ENV": JSON.stringify("STORYBOOK"),
      // Storybook / Chromatic 環境では Firebase 関連の env が無いため、
      // `firebase-config.ts` の module-level `initializeApp()` が
      // `auth/invalid-api-key` で crash する。stories は実際に auth を
      // 呼ばないので dummy 値で init を通過させればよい。
      "process.env.NEXT_PUBLIC_FIREBASE_API_KEY": JSON.stringify(
        "storybook-dummy-api-key",
      ),
      "process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID": JSON.stringify(
        "storybook-project",
      ),
      "process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": JSON.stringify(
        "storybook.firebaseapp.com",
      ),
      "process.env.NEXT_PUBLIC_FIREBASE_APP_ID": JSON.stringify(
        "storybook-app-id",
      ),
    };
    return viteConfig;
  },
};
export default config;
