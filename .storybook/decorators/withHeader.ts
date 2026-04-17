import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import { HeaderContext as CtxHeaderContext, type HeaderContextState } from "../../src/contexts/HeaderContext";
import HeaderProviderDefault from "../../src/components/providers/HeaderProvider";

// リポジトリ内に HeaderContext が2系統存在する:
//   1. src/contexts/HeaderContext.ts         （一部 hook / page が参照）
//   2. src/components/providers/HeaderProvider.tsx  （layout / Header / Navigation 等が参照）
// どちらの import path のコンポーネントでも動くよう、両方の Provider でラップする。
// 後者は default export された HeaderProvider コンポーネント本体から
// 内部の HeaderContext を取り出す必要があるが、直接 export されていないので
// コンポーネント自体を使う（usePathname の副作用がある点に注意）。

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
 * 2系統の HeaderContext を両方供給して useHeader() をどちらの import でも成立させる。
 * 外側: src/contexts/HeaderContext (固定値で供給)
 * 内側: src/components/providers/HeaderProvider (実コンポーネントがマウント)
 */
export const withHeader: Decorator = (Story) =>
  React.createElement(
    CtxHeaderContext.Provider,
    { value: defaultHeaderState },
    React.createElement(HeaderProviderDefault, null, React.createElement(Story)),
  );
