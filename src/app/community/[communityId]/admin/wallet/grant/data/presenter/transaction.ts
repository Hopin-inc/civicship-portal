import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlTransaction,
  GqlUser,
  GqlWalletType,
  Maybe,
} from "@/types/graphql";

export function presentTransaction({
  transaction,
  currentUserId,
  listType,
  community,
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  listType: "donate" | "grant";
  /**
   * コミュニティ財布行 (CONTRIBUTION) の表示名/アイコン。
   * portalConfig (title / squareLogoPath) を正として統一するため呼び出し側から渡す。
   * 取引の community.name / community.image は nullable なため config を優先する。
   */
  community?: { name: string; image: string };
}) {
  const didIssuanceRequests = resolveDidIssuanceRequests({ currentUserId, transaction, listType });

  return listType === "grant"
    ? presentGrantTransaction({ transaction, didIssuanceRequests })
    : presentDonateTransaction({ transaction, currentUserId, didIssuanceRequests, community });
}

const resolveDidIssuanceRequests = ({
  transaction,
  currentUserId,
  listType,
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  listType: "donate" | "grant";
}): GqlDidIssuanceRequest[] => {
  const { fromWallet, toWallet } = transaction;
  const fromUser = fromWallet?.user;
  const toUser = toWallet?.user;

  if (listType === "donate") {
    if (fromUser?.id !== currentUserId) {
      return fromUser?.didIssuanceRequests ?? [];
    }
    if (toUser?.id !== currentUserId) {
      return toUser?.didIssuanceRequests ?? [];
    }
    return [];
  }

  if (listType === "grant") {
    if (fromWallet?.type === GqlWalletType.Member) {
      return fromUser?.didIssuanceRequests ?? [];
    }
    if (toWallet?.type === GqlWalletType.Member) {
      return toUser?.didIssuanceRequests ?? [];
    }
    return [];
  }

  return [];
};

function presentDonateTransaction({
  transaction,
  currentUserId,
  didIssuanceRequests,
  community,
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  didIssuanceRequests: GqlDidIssuanceRequest[];
  community?: { name: string; image: string };
}) {
  const fromUser = transaction.fromWallet?.user;
  const toUser = transaction.toWallet?.user;

  const isReceive = toUser?.id === currentUserId;
  const otherUser = isReceive ? fromUser : toUser;

  // 送付先がコミュニティ財布 (CONTRIBUTION) の場合、相手はユーザーではなくコミュニティ。
  // 表示名/アイコンは portalConfig を正として統一し、無い場合のみ取引の community 値へフォールバック。
  const toCommunity = transaction.toWallet?.type === GqlWalletType.Community
    ? transaction.toWallet?.community
    : undefined;

  const otherName = toCommunity
    ? community?.name || toCommunity.name || ""
    : otherUser?.name ?? "";
  const otherImage = toCommunity
    ? community?.image || toCommunity.image || ""
    : otherUser?.image ?? "";

  return buildPresentedTransaction({
    transaction,
    isReceive,
    otherUser,
    otherName,
    otherImage,
    isCommunity: !!toCommunity,
    actionType: "donation",
    didIssuanceRequests,
  });
}

function presentGrantTransaction({
  transaction,
  didIssuanceRequests,
}: {
  transaction: GqlTransaction;
  didIssuanceRequests: GqlDidIssuanceRequest[];
}) {
  const fromWallet = transaction.fromWallet;
  const toWallet = transaction.toWallet;
  const fromUser = fromWallet?.user;
  const toUser = toWallet?.user;

  const isReceive = fromWallet?.type !== GqlWalletType.Community;
  const otherUser = isReceive ? fromUser : toUser;

  const otherName = isReceive
    ? fromUser?.name
    : (toWallet?.user?.name ?? toWallet?.community?.name ?? "");

  return buildPresentedTransaction({
    transaction,
    isReceive,
    otherUser,
    otherName,
    actionType: "grant",
    didIssuanceRequests,
  });
}

function buildPresentedTransaction({
  transaction,
  isReceive,
  otherUser,
  otherName,
  otherImage,
  isCommunity = false,
  actionType,
  didIssuanceRequests,
}: {
  transaction: GqlTransaction;
  isReceive: boolean;
  otherUser?: Maybe<GqlUser>;
  otherName: string;
  otherImage?: string;
  /** 相手がコミュニティ財布 (CONTRIBUTION) かどうか */
  isCommunity?: boolean;
  actionType: "donation" | "grant";
  didIssuanceRequests: GqlDidIssuanceRequest[];
}) {
  const rawPoint = isReceive ? transaction.toPointChange : transaction.fromPointChange;
  const point = Math.abs(rawPoint ?? 0);
  const sign = isReceive ? "+" : "-";
  const pointColor = isReceive ? "text-green-500" : "";

  const didValue = didIssuanceRequests.find(
    (req) => req.status === GqlDidIssuanceStatus.Completed,
  )?.didValue;

  const isDidPending = didIssuanceRequests.some(
    (req) => req.status === GqlDidIssuanceStatus.Pending,
  );

  return {
    id: transaction.id,
    isReceive,
    otherUser,
    otherName,
    otherImage: otherImage ?? otherUser?.image ?? "",
    isCommunity,
    actionType,
    point,
    sign,
    pointColor,
    didValue,
    isDidPending,
    createdAt: transaction.createdAt,
    comment: transaction.comment,
  };
}
