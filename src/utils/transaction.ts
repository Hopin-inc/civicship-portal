import {
  GqlDidIssuanceStatus,
  GqlTransaction,
  GqlTransactionReason,
  GqlWallet,
  GqlWalletType,
} from "@/types/graphql";
import type { AppTransaction, TransactionDescriptionData } from "@/app/wallets/features/shared/type";
import { currentCommunityConfig, getSquareLogoPath } from "@/lib/communities/metadata";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP").format(amount);
};

export const getNameFromWallet = (wallet: GqlWallet | null | undefined): string => {
  if (!wallet) return "";
  switch (wallet.type) {
    case GqlWalletType.Member:
      return wallet.user?.name ?? "";
    case GqlWalletType.Community:
      // wallet.community.nameを使用し、なければcurrentCommunityConfigにフォールバック
      const communityName = wallet.community?.name ?? currentCommunityConfig.title;
      console.log('[DEBUG] getNameFromWallet for Community:', {
        walletId: wallet.id,
        communityData: wallet.community,
        communityName: wallet.community?.name,
        fallbackName: currentCommunityConfig.title,
        result: communityName,
      });
      return communityName;
    default:
      return "";
  }
};

type TransactionActionMapping = {
  actionType?: "donation" | "grant" | "payment" | "return" | "refund";
  specialName?: "issued" | "onboarding" | "move";
};

export const mapReasonToAction = (reason: GqlTransactionReason): TransactionActionMapping => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return { actionType: "donation" };
    case GqlTransactionReason.Grant:
      return { actionType: "grant" };
    case GqlTransactionReason.PointIssued:
      return { specialName: "issued" };
    case GqlTransactionReason.PointReward:
    case GqlTransactionReason.TicketPurchased:
    case GqlTransactionReason.OpportunityReservationCreated:
      return { actionType: "payment" };
    case GqlTransactionReason.TicketRefunded:
      return { actionType: "return" };
    case GqlTransactionReason.Onboarding:
      return { specialName: "onboarding" };
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return { actionType: "refund" };
    default:
      return { specialName: "move" };
  }
};

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName: string,
  toUserName: string,
  signedPoints: number,
): TransactionDescriptionData => {
  const isOutgoing = signedPoints < 0;
  const mapping = mapReasonToAction(reason);

  if (mapping.specialName) {
    return {
      name: mapping.specialName,
      // isSpecialCase: true indicates system-level transactions that don't follow the typical "from/to" pattern
      // (e.g., point issuance, onboarding bonus)
      isSpecialCase: true,
    };
  }

  if (mapping.actionType === "refund") {
    return {
      actionType: "refund",
      direction: "from",
      name: fromUserName,
      isSpecialCase: !fromUserName,
    };
  }

  if (mapping.actionType === "return") {
    return {
      actionType: "return",
      direction: isOutgoing ? "from" : "to",
      name: isOutgoing ? toUserName : fromUserName,
      isSpecialCase: false,
    };
  }

  const actionType = mapping.actionType!;
  return {
    actionType,
    direction: isOutgoing ? "to" : "from",
    name: isOutgoing ? toUserName : fromUserName,
    isSpecialCase: !toUserName && !fromUserName,
  };
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

  const counterparty = isOutgoing ? node.toWallet : node.fromWallet;
  const image =
    node.reason === GqlTransactionReason.PointIssued
      ? getSquareLogoPath()
      : counterparty?.type === GqlWalletType.Community
        ? getSquareLogoPath()
        : (counterparty?.user?.image ?? PLACEHOLDER_IMAGE);

  const descriptionData = formatTransactionDescription(node.reason, from, to, signedPoint);

  return {
    id: node.id,
    reason: node.reason,
    from,
    to,
    source: "",
    comment: node.comment ?? "",
    transferPoints: signedPoint,
    transferredAt: node.createdAt ? new Date(node.createdAt).toISOString() : "",
    description: "",
    descriptionData,
    didValue:
      node.toWallet?.user?.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      )?.didValue ?? null,
    image,
  };
};
