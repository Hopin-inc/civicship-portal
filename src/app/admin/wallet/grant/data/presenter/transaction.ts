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
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  listType: "donate" | "grant";
}) {
  const didIssuanceRequests = resolveDidIssuanceRequests({ currentUserId, transaction, listType });

  return listType === "grant"
    ? presentGrantTransaction({ transaction, didIssuanceRequests })
    : presentDonateTransaction({ transaction, currentUserId, didIssuanceRequests });
}

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

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
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  didIssuanceRequests: GqlDidIssuanceRequest[];
}) {
  const fromUser = transaction.fromWallet?.user;
  const toUser = transaction.toWallet?.user;

  const isReceive = toUser?.id === currentUserId;
  const otherUser = isReceive ? fromUser : toUser;
  const otherName = otherUser?.name ?? "";

  return buildPresentedTransaction({
    transaction,
    isReceive,
    otherUser,
    label: {
      text: `${otherName}${isReceive ? "から受取" : "に譲渡"}`,
      smallText: isReceive ? "から受取" : "に譲渡",
    },
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
    label: {
      text: `${otherName}${isReceive ? "から受取" : "に支給"}`,
      smallText: isReceive ? "から受取" : "に支給",
    },
    didIssuanceRequests,
  });
}

function buildPresentedTransaction({
  transaction,
  isReceive,
  otherUser,
  label,
  didIssuanceRequests,
}: {
  transaction: GqlTransaction;
  isReceive: boolean;
  otherUser?: Maybe<GqlUser>;
  label: { text: string; smallText: string };
  didIssuanceRequests: GqlDidIssuanceRequest[];
}) {
  const rawPoint = isReceive ? transaction.toPointChange : transaction.fromPointChange;
  const point = Math.abs(rawPoint ?? 0);
  const sign = isReceive ? "+" : "-";
  const pointColor = isReceive ? "text-green-500" : "";

  const didValue = didIssuanceRequests.find(
    (req) => req.status === GqlDidIssuanceStatus.Completed,
  )?.didValue;

  return {
    isReceive,
    otherUser,
    point,
    sign,
    pointColor,
    label,
    didValue: truncateDid(didValue, 20),
    createdAt: transaction.createdAt,
  };
}
