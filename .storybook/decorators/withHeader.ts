import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import { HeaderContext, type HeaderContextState } from "../../src/components/providers/HeaderProvider";

// HeaderProvider コンポーネント本体を使うと内部の usePathname()
// や useEffect の副作用が Chromatic の Playwright テスト環境で
// 不安定になるため、Context.Provider に固定値を渡す形にする。
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

export const withHeader: Decorator = (Story) =>
  React.createElement(
    HeaderContext.Provider,
    { value: defaultHeaderState },
    React.createElement(Story),
  );
