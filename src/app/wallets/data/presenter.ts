'use client';

import { GqlTransaction, GqlTransactionReason, GqlWallet, GqlWalletType } from "@/types/graphql";
import { AppTransaction, AvailableTicket, UserAsset } from "@/app/wallets/data/type";import useHeaderConfig from "@/hooks/useHeaderConfig";

export const presenterUserAsset = (wallet: GqlWallet | undefined | null): UserAsset => {
  const walletId = wallet?.id ?? '';
  const currentPoint = wallet?.currentPointView?.currentPoint ?? 0;

  const tickets: AvailableTicket[] = (wallet?.tickets ?? []).map(ticket => ({
    id: ticket.id,
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
  return new Intl.NumberFormat('ja-JP').format(amount);
};


export const presenterTransaction = (
  node: GqlTransaction | null | undefined,
  walletId: string,
): AppTransaction | null  => {
  if(!node) return null;
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
    transferPoints: signedPoint,
    transferredAt: node.createdAt ? new Date(node.createdAt).toISOString() : '',
    description: formatTransactionDescription(node.reason, from, to, signedPoint),
  };
};

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName: string,
  toUserName: string,
  signedPoints: number
): string => {
  const isOutgoing = signedPoints < 0;

  switch (reason) {
    case GqlTransactionReason.Donation:
      return isOutgoing
        ? `${toUserName}さんにプレゼントを贈りました`
        : `${fromUserName}さんからプレゼントを受け取りました`;

    case GqlTransactionReason.Grant:
      return isOutgoing
        ? `${toUserName}さんにポイントを付与しました`
        : `${fromUserName}からポイントを受け取りました`;

    case GqlTransactionReason.PointIssued:
      return `ポイントを発行しました`;

    case GqlTransactionReason.PointReward:
      return isOutgoing
        ? `${toUserName}さんにポイントを送りました`
        : `${fromUserName}さんからポイントを獲得しました`;

    case GqlTransactionReason.TicketPurchased:
      return isOutgoing
        ? `${toUserName}さんのチケットを購入しました`
        : `${fromUserName}さんがチケットを購入しました`;

    case GqlTransactionReason.TicketRefunded:
      return isOutgoing
        ? `${toUserName}さんのチケットを払い戻さました`
        : `${fromUserName}さんのチケットを払い戻しました`;

    case GqlTransactionReason.Onboarding:
      return `オンボーディングボーナスを受け取りました`;

    default:
      return `ポイントが移動しました`;
  }
};

const getNameFromWallet = (wallet: GqlWallet | null | undefined): string => {
  if (!wallet) return '';
  switch (wallet.type) {
    case GqlWalletType.Member:
      return wallet.user?.name ?? '';
    case GqlWalletType.Community:
      return wallet.community?.name ?? '';
    default:
      return '';
  }
};

