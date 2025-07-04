import { GqlUser, GqlTransaction, GqlDidIssuanceStatus, GqlGetDidIssuanceRequestsQuery } from "@/types/graphql";

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
  otherUserName?: string;
  isReceive: boolean;
}) {
  if(isReceive) {
    return {
      text: `${otherUserName ?? ""}から受取`,
      smallText: "から受取"
    };
  }
  switch (listType) {
    case "donate":
      return {
        text: `${otherUserName ?? ""}に譲渡`,
        smallText: "に譲渡"
      };
    case "grant":
      return {
        text: `${otherUserName ?? ""}に支給`,
        smallText: "に支給"
      };
    default:
      return {
        text: "",
        smallText: ""
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
  currentUserId: string | undefined;
  didIssuanceRequests: GqlGetDidIssuanceRequestsQuery;
  listType: "donate" | "grant";
}) {
  const isReceive = transaction.toWallet?.user?.id === currentUserId;
  const otherUser: GqlUser | undefined =
    (isReceive ? transaction.fromWallet?.user : transaction.toWallet?.user) || undefined;
  const point = isReceive ? transaction.toPointChange ?? 0 : Math.abs(transaction.fromPointChange ?? 0);
  const sign = isReceive ? "+" : "-";
  const pointColor = isReceive ? "text-green-500" : "";
  const label = getTransactionLabel({ listType, otherUserName: otherUser?.name, isReceive });

  const didValue = didIssuanceRequests?.users?.edges
    ?.find((edge) => edge?.node?.id === otherUser?.id)
    ?.node?.didIssuanceRequests
    ?.find((request) => request?.status === GqlDidIssuanceStatus.Completed)
    ?.didValue;

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