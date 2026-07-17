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
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

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
  refetch: () => void;
} {
  const { communityId } = useCommunityConfig();
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
              or: [
                // 従来: メンバー間送付 (DONATION)
                {
                  and: [
                    { fromWalletType: GqlWalletType.Member },
                    { toWalletType: GqlWalletType.Member },
                  ],
                },
                // 追加: 自分からコミュニティ財布への送付 (CONTRIBUTION)
                {
                  and: [
                    { toWalletType: GqlWalletType.Community },
                    { reason: GqlTransactionReason.Contribution },
                  ],
                },
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

  // donate は currentUserId で自分の送受信に絞る。currentUserId 未確定のまま実行すると
  // { fromUserId: undefined } が変数シリアライズで落ちて or:[{},{}] = 全件ヒットになり、
  // 他メンバーの取引が一瞬表示されうるためクエリ自体を待機させる。
  const isWaitingForCurrentUser = listType === "donate" && !currentUserId;

  const { data, error, loading, refetch } = useGetTransactionsQuery({
    variables: {
      filter: {
        communityId,
        and: [walletTypeFilter, ...(keywordFilter ? [keywordFilter] : [])],
      },
      first: 100,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    skip: isWaitingForCurrentUser,
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
    // 待機中は空状態のちらつきを避けるため loading を維持する
    loading: loading || isWaitingForCurrentUser,
    error,
    allTransactions,
    presentedTransactions,
    refetch,
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
