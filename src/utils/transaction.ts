import {
  GqlDidIssuanceStatus,
  GqlTransaction,
  GqlTransactionReason,
  GqlWallet,
  GqlWalletType,
} from "@/types/graphql";
import { AppTransaction } from "@/app/wallets/features/shared/type";
import { currentCommunityConfig, getSquareLogoPath } from "@/lib/communities/metadata";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP").format(amount);
};

export const getNameFromWallet = (wallet: GqlWallet | null | undefined): string => {
  if (!wallet) return "";
  const communityName = currentCommunityConfig.title;
  switch (wallet.type) {
    case GqlWalletType.Member:
      return wallet.user?.name ?? "";
    case GqlWalletType.Community:
      return communityName;
    default:
      return "";
  }
};

interface TransactionDescriptionData {
  actionType?: "donation" | "grant" | "payment" | "return" | "refund";
  direction?: "to" | "from";
  name: string;
  isSpecialCase: boolean;
}

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName: string,
  toUserName: string,
  signedPoints: number,
): TransactionDescriptionData => {
  const isOutgoing = signedPoints < 0;

  switch (reason) {
    case GqlTransactionReason.Donation:
      return {
        actionType: "donation",
        direction: isOutgoing ? "to" : "from",
        name: isOutgoing ? toUserName : fromUserName,
        isSpecialCase: false,
      };

    case GqlTransactionReason.Grant:
      return {
        actionType: "grant",
        direction: isOutgoing ? "to" : "from",
        name: isOutgoing ? toUserName : fromUserName,
        isSpecialCase: false,
      };

    case GqlTransactionReason.PointIssued:
      return {
        name: "issued",
        isSpecialCase: true,
      };

    case GqlTransactionReason.PointReward:
    case GqlTransactionReason.TicketPurchased:
    case GqlTransactionReason.OpportunityReservationCreated:
      return {
        actionType: "payment",
        direction: isOutgoing ? "to" : "from",
        name: isOutgoing ? toUserName : fromUserName,
        isSpecialCase: !toUserName && !fromUserName,
      };

    case GqlTransactionReason.TicketRefunded:
      return {
        actionType: "return",
        direction: isOutgoing ? "from" : "to",
        name: isOutgoing ? toUserName : fromUserName,
        isSpecialCase: false,
      };

    case GqlTransactionReason.Onboarding:
      return {
        name: "onboarding",
        isSpecialCase: true,
      };

    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return {
        actionType: "refund",
        direction: "from",
        name: fromUserName,
        isSpecialCase: !fromUserName,
      };

    default:
      return {
        name: "move",
        isSpecialCase: true,
      };
  }
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
