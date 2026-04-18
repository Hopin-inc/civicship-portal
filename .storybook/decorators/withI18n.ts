import type { Decorator } from "@storybook/nextjs-vite";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { nestMessages } from "../../src/lib/i18n/nestMessages";

import common from "../../src/messages/ja/common.json";
import navigation from "../../src/messages/ja/navigation.json";
import transactions from "../../src/messages/ja/transactions.json";
import users from "../../src/messages/ja/users.json";
import adminVotes from "../../src/messages/ja/adminVotes.json";

const messages = nestMessages({
  ...common,
  ...navigation,
  ...transactions,
  ...users,
  ...adminVotes,
});

/**
 * next-intl の翻訳を供給する。`useTranslations()` が全 story で動く。
 * 足りない名前空間があれば import を追加する。
 */
export const withI18n: Decorator = (Story) =>
  React.createElement(
    NextIntlClientProvider,
    { locale: "ja", messages, timeZone: "Asia/Tokyo" },
    React.createElement(Story),
  );
