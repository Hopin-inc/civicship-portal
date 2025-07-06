import { useMemo } from "react";
import {
  GqlDidIssuanceRequest,
  GqlTransaction,
  GqlTransactionFilterInput,
  GqlTransactionReason,
  GqlWalletType,
  useGetTransactionsQuery,
} from "@/types/graphql";
import { ApolloError } from "@apollo/client";
import { presentTransaction } from "../data/presenter/transaction";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

type PresentedTransaction = ReturnType<typeof presentTransaction>;

interface UseWalletsAndDidIssuanceRequestsProps {
  currentUserId?: string;
  listType: "donate" | "grant";
  keyword?: string;
}

const getDidIssuanceRequests = (userID: string, GqlTransaction: GqlTransaction) => {
  const fromUser = GqlTransaction.fromWallet?.user;
  const toUser = GqlTransaction.toWallet?.user;

  let targetRequests: GqlDidIssuanceRequest[] = [];
  if (fromUser && fromUser.id !== userID) {
    targetRequests = fromUser.didIssuanceRequests ?? [];
  } else if (toUser && toUser.id !== userID) {
    targetRequests = toUser.didIssuanceRequests ?? [];
  }

  return targetRequests;
};

export function useWalletsAndDidIssuanceRequests({
  currentUserId,
  listType,
  keyword,
}: UseWalletsAndDidIssuanceRequestsProps): {
  loading: boolean;
  error: ApolloError | undefined;
  allTransactions: any[];
  presentedTransactions: PresentedTransaction[];
} {
  const walletTypeFilter: GqlTransactionFilterInput =
    listType === "grant"
      ? {
          and: [
            {
              or: [
                { fromWalletType: GqlWalletType.Community },
                { toWalletType: GqlWalletType.Community },
              ],
            },
            {
              not: {
                reason: GqlTransactionReason.PointIssued,
              },
            },
          ],
        }
      : {
          and: [
            {
              or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
            },
            {
              and: [
                { fromWalletType: GqlWalletType.Member },
                { toWalletType: GqlWalletType.Member },
              ],
            },
          ],
        };

  const keywordFilter: GqlTransactionFilterInput | undefined = keyword
    ? {
        or: [
          { fromUserName: keyword },
          { toUserName: keyword },
          { fromDidValue: keyword },
          { toDidValue: keyword },
        ],
      }
    : undefined;

  const { data, error, loading } = useGetTransactionsQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        ...walletTypeFilter,
        ...(keywordFilter ? { and: [keywordFilter] } : {}),
      },
      first: 100,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const allTransactions = useMemo<GqlTransaction[]>(() => {
    return (
      data?.transactions?.edges
        ?.flatMap((edge) => edge?.node)
        .filter(
          (t): t is GqlTransaction => !!t && t.fromWallet !== null,
          // t.fromWallet?.type !== GqlWalletType.Community &&
          // t.toWallet?.type !== GqlWalletType.Community
        ) ?? []
    );
  }, [data]);

  const presentedTransactions = useMemo<PresentedTransaction[]>(() => {
    return allTransactions.map((transaction) =>
      presentTransaction({
        transaction,
        currentUserId,
        didIssuanceRequests: getDidIssuanceRequests(currentUserId ?? "", transaction),
        listType,
      }),
    );
  }, [allTransactions, currentUserId, listType]);

  return {
    loading,
    error,
    allTransactions,
    presentedTransactions,
  };
}
