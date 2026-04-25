import type { Decorator } from "@storybook/nextjs-vite";
import { withI18n } from "./withI18n";
import { withHeader } from "./withHeader";
import { withPageShell } from "./withPageShell";
import { withCommunityConfig } from "./withCommunityConfig";
import { withApollo } from "./withApollo";
import { withAuth } from "./withAuth";

export { withI18n, withHeader, withPageShell, withCommunityConfig, withApollo, withAuth };

/**
 * 全 story に共通で適用するグローバル decorator。
 * 外側から順に適用されるので、配列の後ろほど内側のラッパーになる。
 *
 * Apollo を含めない理由: モックが必要な story だけが opt-in で
 * `decorators: [withApollo]` を付けるほうが意図が明確になる。
 */
export const globalDecorators: Decorator[] = [
  withI18n,
  withCommunityConfig,
  withHeader,
  withAuth,
];
