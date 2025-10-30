import { TranslationKey } from "@/types/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

const WALLET_ACTION_KEY_MAP = {
  donation: {
    to: "wallets.action.donation.to",
    from: "wallets.action.donation.from",
  },
  grant: {
    to: "wallets.action.grant.to",
    from: "wallets.action.grant.from",
  },
} as const;

const TRANSACTION_ACTION_KEY_MAP = {
  donation: {
    to: "transactions.action.donation.to",
    from: "transactions.action.donation.from",
  },
  grant: {
    to: "transactions.action.grant.to",
    from: "transactions.action.grant.from",
  },
  payment: {
    to: "transactions.action.payment.to",
    from: "transactions.action.payment.from",
  },
  return: {
    to: "transactions.action.return.to",
    from: "transactions.action.return.from",
  },
  refund: {
    to: "transactions.action.refund.to",
    from: "transactions.action.refund.from",
  },
} as const;

export function getWalletActionKey(
  actionType: keyof typeof WALLET_ACTION_KEY_MAP,
  isReceive: boolean
): TranslationKey {
  const direction = isReceive ? "from" : "to";
  return WALLET_ACTION_KEY_MAP[actionType][direction] as TranslationKey;
}

export function getTransactionActionKey(
  actionType: keyof typeof TRANSACTION_ACTION_KEY_MAP,
  isReceive: boolean
): TranslationKey {
  const direction = isReceive ? "from" : "to";
  return TRANSACTION_ACTION_KEY_MAP[actionType][direction] as TranslationKey;
}

export function formatDateTime(
  isoString: string | null | undefined,
  locale: string,
  unknownKey: string = "transactions.date.unknown"
): string {
  if (!isoString) return unknownKey;

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return unknownKey;

  const dtf = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return dtf.format(date);
}

export function useLocaleDateTimeFormat(): (
  isoString: string | null | undefined
) => string {
  const locale = useLocale();
  const t = useTranslations();

  return useCallback(
    (isoString: string | null | undefined) => {
      const unknownText = t("transactions.date.unknown");
      if (!isoString) return unknownText;

      const date = new Date(isoString);
      if (isNaN(date.getTime())) return unknownText;

      return formatDateTime(isoString, locale, unknownText);
    },
    [locale, t]
  );
}

export function resolveLocalePath(
  pathTemplate: string,
  locale: string,
  fallbackLocale: string = "ja"
): string {
  const baseLocale = locale.split("-")[0];
  return pathTemplate.replace("{locale}", baseLocale || fallbackLocale);
}
