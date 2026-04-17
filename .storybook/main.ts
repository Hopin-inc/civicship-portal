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
      // NODE_ENV など他の process.env.* は Vite のデフォルト置換に任せる。
      "process.env.ENV": JSON.stringify("STORYBOOK"),
    };
    return viteConfig;
  },
};
export default config;
