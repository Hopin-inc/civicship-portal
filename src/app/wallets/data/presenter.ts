"use client";

import { GqlTransaction, GqlTransactionReason, GqlWallet, GqlWalletType } from "@/types/graphql";
import { AppTransaction, AvailableTicket, UserAsset } from "@/app/wallets/data/type";

export const presenterUserAsset = (wallet: GqlWallet | undefined | null): UserAsset => {
  const walletId = wallet?.id ?? "";
  const currentPointView = wallet?.currentPointView;
  const currentPoint = BigInt(currentPointView?.currentPoint ?? "0");

  const tickets: AvailableTicket[] = (wallet?.tickets ?? []).map((ticket) => ({
    id: ticket.id,
    status: ticket.status,
    reason: ticket.reason,
  }));

  return {
    points: {
      walletId,
      currentPoint,
    },
    tickets,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP").format(amount);
};

export const presenterTransaction = (
  node: GqlTransaction | null | undefined,
  walletId: string,
): AppTransaction | null => {
  if (!node) return null;
  const from = getNameFromWallet(node.fromWallet);
  const to = getNameFromWallet(node.toWallet);
  const rawPoint = node.fromPointChange ?? 0;
  const isOutgoing = node.fromWallet?.id === walletId;
  const signedPoint = isOutgoing ? -Math.abs(rawPoint) : Math.abs(rawPoint);

  return {
    id: node.id,
    reason: node.reason,
    from,
    to,
    source: "",
    transferPoints: signedPoint,
    transferredAt: node.createdAt ? new Date(node.createdAt).toISOString() : "",
    description: formatTransactionDescription(node.reason, from, to, signedPoint),
  };
};

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName: string,
  toUserName: string,
  signedPoints: number,
): string => {
  const isOutgoing = signedPoints < 0;

  switch (reason) {
    case GqlTransactionReason.Donation:
      return isOutgoing ? `${toUserName}さんに譲渡` : `${fromUserName}さんから譲渡`;

    case GqlTransactionReason.Grant:
      return isOutgoing ? `${toUserName}さんに支給` : `${fromUserName}から支給`;

    case GqlTransactionReason.PointIssued:
      return `発行`;

    case GqlTransactionReason.PointReward:
      return isOutgoing ? `${toUserName}さんに支払い` : `${fromUserName}さんから支払い`;

    case GqlTransactionReason.TicketPurchased:
      return isOutgoing ? `${toUserName}さんに支払い` : `${fromUserName}さんから支払い`;

    case GqlTransactionReason.TicketRefunded:
      return isOutgoing ? `${toUserName}さんから返品` : `${fromUserName}さんに返品`;

    case GqlTransactionReason.Onboarding:
      return `初回ボーナス`;

    default:
      return `ポイント移動`;
  }
};

const getNameFromWallet = (wallet: GqlWallet | null | undefined): string => {
  if (!wallet) return "";
  switch (wallet.type) {
    case GqlWalletType.Member:
      return wallet.user?.name ?? "";
    case GqlWalletType.Community:
      return wallet.community?.name ?? "";
    default:
      return "";
  }
};
