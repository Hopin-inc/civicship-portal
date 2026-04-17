import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";

/**
 * ⚠ 現状は実質 no-op の decorator。
 *
 * 実体の `useAuth()` (`src/contexts/AuthProvider.tsx`) は `AuthContext` を
 * ファイル内で閉じており、外部に export していない。このため
 * Storybook 側で別の context を Provider しても、`useAuth()` からは
 * 参照されない（`useContext(<別のContext>)` になるので必ず undefined で throw する）。
 *
 * この decorator は将来ちゃんとモックできるようにするための「置き場所」として
 * 残している。現状、`useAuth()` を直接呼ぶコンポーネントの story を
 * 書きたい場合は以下のいずれかの対応が必要:
 *
 *  - `src/contexts/AuthProvider.tsx` から `AuthContext` を export し、
 *    ここで `AuthContext.Provider` を使うように書き換える
 *  - `@storybook/nextjs-vite` の Vite 設定で `@/contexts/AuthProvider`
 *    を mocks/AuthProvider.js に alias する
 *  - コンポーネント側を props 経由で auth 値を受け取る設計にする
 */
const NoopAuthContext = React.createContext<unknown>({});

export const withAuth: Decorator = (Story) =>
  React.createElement(
    NoopAuthContext.Provider,
    { value: {} },
    React.createElement(Story),
  );
