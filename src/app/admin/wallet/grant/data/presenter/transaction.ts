import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlTransaction,
  GqlWalletType,
  Maybe,
} from "@/types/graphql";

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

function getTransactionLabel({
  listType,
  otherUserName,
  isReceive,
}: {
  listType?: "donate" | "grant";
  otherUserName?: Maybe<string> | undefined;
  isReceive: boolean;
}) {
  if (isReceive) {
    return {
      text: `${otherUserName ?? ""}から受取`,
      smallText: "から受取",
    };
  }
  switch (listType) {
    case "donate":
      return {
        text: `${otherUserName ?? ""}に譲渡`,
        smallText: "に譲渡",
      };
    case "grant":
      return {
        text: `${otherUserName ?? ""}に支給`,
        smallText: "に支給",
      };
    default:
      return {
        text: "",
        smallText: "",
      };
  }
}

export function presentTransaction({
  transaction,
  currentUserId,
  didIssuanceRequests,
  listType,
}: {
  transaction: GqlTransaction;
  currentUserId?: string;
  didIssuanceRequests: GqlDidIssuanceRequest[];
  listType: "donate" | "grant";
}) {
  const fromUser = transaction.fromWallet?.user;
  const toUser = transaction.toWallet?.user;
  const fromWallet = transaction.fromWallet;
  const toWallet = transaction.toWallet;

  const isReceive =
    listType === "grant"
      ? fromWallet?.type !== GqlWalletType.Community
      : toWallet?.user?.id === currentUserId;

  const otherName = isReceive
    ? fromWallet?.community?.name
    : (toWallet?.user?.name ?? toWallet?.community?.name);

  const otherUser =
    listType === "grant"
      ? isReceive
        ? undefined // コミュニティはユーザーなし
        : toUser
      : isReceive
        ? fromUser
        : toUser;

  const rawPoint = isReceive ? transaction.toPointChange : transaction.fromPointChange;
  const point = Math.abs(rawPoint ?? 0);
  const sign = isReceive ? "+" : "-";
  const pointColor = isReceive ? "text-green-500" : "";

  const label = getTransactionLabel({
    listType,
    otherUserName: otherName,
    isReceive,
  });

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
