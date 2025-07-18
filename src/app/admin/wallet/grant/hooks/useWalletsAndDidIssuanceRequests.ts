import { useMemo } from "react";
import {
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

export function useWalletsAndDidIssuanceRequests({
  currentUserId,
  listType,
  keyword,
}: UseWalletsAndDidIssuanceRequestsProps): {
  loading: boolean;
  error: ApolloError | undefined;
  allTransactions: GqlTransaction[];
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
        and: [walletTypeFilter, ...(keywordFilter ? [keywordFilter] : [])],
      },
      first: 100,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const allTransactions = useMemo<GqlTransaction[]>(() => {
    return (
      data?.transactions?.edges
        ?.flatMap((edge) => edge?.node)
        .filter(
          (t): t is GqlTransaction =>
            !!t && t.fromWallet !== null && !shouldExcludeSelfTransaction(t, currentUserId),
        ) ?? []
    );
  }, [data, currentUserId]);

  const presentedTransactions = useMemo<PresentedTransaction[]>(() => {
    return allTransactions.map((transaction) =>
      presentTransaction({
        transaction,
        currentUserId,
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

function shouldExcludeSelfTransaction(
  transaction: GqlTransaction,
  currentUserId?: string,
): boolean {
  const fromUserId = transaction.fromWallet?.user?.id;
  const toUserId = transaction.toWallet?.user?.id;

  return currentUserId != null && fromUserId === currentUserId && toUserId === currentUserId;
}
