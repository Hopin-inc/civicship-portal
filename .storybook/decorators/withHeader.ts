import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import { HeaderContext, type HeaderContextState } from "../../src/contexts/HeaderContext";

const defaultHeaderState: HeaderContextState = {
  config: {
    title: undefined,
    showBackButton: false,
    showLogo: true,
    showSearchForm: false,
  },
  updateConfig: () => {},
  resetConfig: () => {},
  lastVisitedUrls: {},
  addToHistory: () => {},
};

/**
 * useHeader() を呼ぶコンポーネントのため、実物の HeaderContext に
 * 最小限のモック値を入れる。必要なら parameters で上書き可能にする拡張も可。
 */
export const withHeader: Decorator = (Story) =>
  React.createElement(
    HeaderContext.Provider,
    { value: defaultHeaderState },
    React.createElement(Story),
  );
