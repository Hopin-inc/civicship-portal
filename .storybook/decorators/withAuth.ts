import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";

/**
 * 認証済みユーザーのモック。`useAuth()` を直接叩く story は
 * 現状 src/contexts/AuthProvider.tsx が AuthContext を export して
 * いないため完全には差し替えられない。
 *
 * ここでは「認証情報を見ない component（大半の UI パーツ）」が
 * 実行時エラーにならないよう、空の context を提供する軽量版。
 *
 * 将来的に完全な useAuth() モックが必要になったら:
 *  - src/contexts/AuthProvider.tsx から AuthContext を export する
 *  - その AuthContext.Provider でラップする
 * へ切り替える。
 */
const MockAuthContext = React.createContext<unknown>({});

export const withAuth: Decorator = (Story) =>
  React.createElement(
    MockAuthContext.Provider,
    { value: {} },
    React.createElement(Story),
  );
