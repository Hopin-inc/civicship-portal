import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import HeaderProvider from "../../src/components/providers/HeaderProvider";

/**
 * 実物の HeaderProvider でラップする。`useHeader()` がエラーにならないよう
 * する目的で、state の初期値はコンポーネント内部の default を使う。
 *
 * HeaderProvider は `usePathname()` を参照する副作用があるが、
 * `@storybook/nextjs-vite` が router を mock するので story 実行時には問題ない。
 */
export const withHeader: Decorator = (Story) =>
  React.createElement(HeaderProvider, null, React.createElement(Story));
