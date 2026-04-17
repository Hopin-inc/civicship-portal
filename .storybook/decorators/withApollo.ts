import type { Decorator } from "@storybook/nextjs-vite";
import type { MockedResponse } from "@apollo/client/testing";
import { MockedProvider } from "@apollo/client/testing";
import React from "react";

/**
 * Story ごとに Apollo クライアントのレスポンスをモックする decorator。
 * 使用側で `parameters.apollo.mocks` に `MockedResponse[]` を指定する。
 *
 * 例:
 * ```tsx
 * export const WithData: Story = {
 *   parameters: {
 *     apollo: {
 *       mocks: [{ request: { query: GetUserDoc }, result: { data: ... } }],
 *     },
 *   },
 * };
 * ```
 */
export const withApollo: Decorator = (Story, context) => {
  const mocks = (context.parameters?.apollo?.mocks ?? []) as MockedResponse[];
  return React.createElement(
    MockedProvider,
    { mocks, addTypename: true },
    React.createElement(Story),
  );
};
