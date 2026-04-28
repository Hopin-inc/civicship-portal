import type { Decorator } from "@storybook/nextjs-vite";
import React, { useCallback, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  HeaderContext,
  type HeaderConfig,
  type HeaderContextState,
} from "../../src/components/providers/HeaderProvider";

const defaultConfig: HeaderConfig = {
  title: undefined,
  showBackButton: false,
  showLogo: true,
  showSearchForm: false,
};

/**
 * ページ丸ごと Storybook 化する時に使う decorator。
 *
 * 通常の `withHeader` (stateless no-op) と違い:
 * - HeaderContext を state として保持するので、story 内の `useHeaderConfig`
 *   呼び出しが実際に header 表示に反映される (=コミュニティ名が title に入る様子が見える)。
 * - 上部に stub header bar を描画する (本物の Header は通信/context 依存が重いため)。
 *
 * 本物の Header と完全一致はさせない。視覚確認用の approximate bar のみ。
 */
export const withPageShell: Decorator = (Story) => {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

  const updateConfig = useCallback((next: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...next }));
  }, []);
  const resetConfig = useCallback(() => setConfig(defaultConfig), []);

  const ctx: HeaderContextState = {
    config,
    updateConfig,
    resetConfig,
    lastVisitedUrls: {},
    addToHistory: () => {},
  };

  return React.createElement(
    HeaderContext.Provider,
    { value: ctx },
    React.createElement(
      "div",
      { className: "min-h-screen bg-background" },
      // Stub header bar — 視覚確認専用
      !config.hideHeader &&
        React.createElement(
          "header",
          {
            className:
              "sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background px-4",
          },
          config.showBackButton &&
            React.createElement(
              "button",
              {
                type: "button",
                "aria-label": "戻る",
                className:
                  "inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted",
              },
              React.createElement(ChevronLeft, { className: "h-5 w-5" }),
            ),
          React.createElement(
            "h1",
            { className: "truncate text-base font-semibold" },
            config.title ?? "(無題)",
          ),
          config.action &&
            React.createElement(
              "div",
              { className: "ml-auto flex items-center gap-2" },
              config.action,
            ),
        ),
      React.createElement(Story),
    ),
  );
};
