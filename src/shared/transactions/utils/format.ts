import { GqlTransaction, GqlTransactionReason, GqlDidIssuanceStatus } from "@/types/graphql";
import { getNameFromWallet, mapReasonToAction } from "@/utils/transaction";

interface FormatTransactionDescriptionOptions {
  transaction?: GqlTransaction;
  perspectiveWalletId?: string;
  useReceivedPhrasing?: boolean;
  locale?: string;
}

export const formatTransactionDescription = (
  reason: GqlTransactionReason,
  from: string,
  to: string,
  t: (key: string, values?: Record<string, string>) => string,
  options: FormatTransactionDescriptionOptions = {},
): { displayName: string | null; displayAction: string | null; to: string } => {
  const { transaction, perspectiveWalletId, useReceivedPhrasing = false, locale = 'ja' } = options;
  const mapping = mapReasonToAction(reason);

  if (mapping.specialName) {
    return {
      displayName: null,
      displayAction: t(`transactions.name.${mapping.specialName}`),
      to: to,
    };
  }

  const actionType = mapping.actionType!;

  if (perspectiveWalletId && transaction) {
    const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
    const counterpartyName = isOutgoing ? to : from;
    const direction = isOutgoing ? "to" : "from";

    if (locale === 'en') {
      const baseKey = direction === 'from' 
        ? `transactions.action.${actionType}.from.default`
        : `transactions.action.${actionType}.${direction}`;
      
      const combinedKey =
        !isOutgoing && useReceivedPhrasing
          ? `transactions.action.${actionType}.from.received`
          : baseKey;

      return {
        displayName: null,
        displayAction: t(combinedKey, { name: counterpartyName }),
        to: to,
      };
    }

    const actionKey =
      !isOutgoing && useReceivedPhrasing
        ? `transactions.parts.action.${actionType}.from.received.action`
        : `transactions.parts.action.${actionType}.${direction}.action`;

    return {
      displayName: t(`transactions.parts.action.${actionType}.${direction}.name`, {
        name: counterpartyName,
      }),
      displayAction: t(actionKey),
      to: to,
    };
  }

  if (locale === 'en') {
    return {
      displayName: null,
      displayAction: t(`transactions.action.${actionType}.from.default`, { name: from }),
      to: to,
    };
  }

  return {
    displayName: t(`transactions.parts.action.${actionType}.from.name`, { name: from }),
    displayAction: t(`transactions.parts.action.${actionType}.from.action`),
    to: to,
  };
};

export const getTransactionInfo = (transaction: GqlTransaction, perspectiveWalletId?: string) => {
  // デバッグ: Onboardingの場合にfromWalletの構造を確認
  if (transaction.reason === 'ONBOARDING') {
    console.log('[DEBUG] Onboarding transaction:', {
      id: transaction.id,
      fromWallet: transaction.fromWallet,
      fromWalletType: transaction.fromWallet?.type,
      fromWalletCommunity: transaction.fromWallet?.community,
      fromWalletCommunityName: transaction.fromWallet?.community?.name,
    });
  }

  const from = getNameFromWallet(transaction.fromWallet);
  const to = getNameFromWallet(transaction.toWallet);
  const rawAmount = Math.abs(transaction.fromPointChange ?? 0);

  let amount = rawAmount;
  let isPositive = false;
  if (perspectiveWalletId) {
    const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
    amount = isOutgoing ? -rawAmount : rawAmount;
    isPositive = amount > 0;
  }

  let didValue: string | null = null;
  if (perspectiveWalletId) {
    const counterpartyWallet =
      transaction.fromWallet?.id === perspectiveWalletId
        ? transaction.toWallet
        : transaction.fromWallet;
    didValue =
      counterpartyWallet?.user?.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      )?.didValue ?? null;
  } else {
    didValue =
      transaction.toWallet?.user?.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      )?.didValue ?? null;
  }

  return {
    from,
    to,
    amount,
    isPositive,
    reason: transaction.reason,
    comment: transaction.comment ?? "",
    transferredAt: transaction.createdAt ? new Date(transaction.createdAt).toISOString() : "",
    didValue,
  };
};
