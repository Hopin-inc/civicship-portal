import { useMemo } from "react";
import { GqlWalletType, useGetDidIssuanceRequestsQuery, GqlTransaction, useGetTransactionsQuery } from "@/types/graphql";
import { ApolloError } from "@apollo/client";
import { presentTransaction } from "../data/presenter/transaction";

type PresentedTransaction = ReturnType<typeof presentTransaction>;

interface UseWalletsAndDidIssuanceRequestsProps {
  userId?: string;
  listType: "donate" | "grant";
  keyword?: string;
}
  // 検索条件を生成する関数
const createSearchFilter = (userId: string | undefined, keyword: string | undefined) => {
  if (!userId || !keyword) {
    return { or: [{ fromUserId: userId }, { toUserId: userId }] };
  }

  return {
    or: [
      // 自分が送信者で、相手の名前で検索
      {
        and: [
          { fromUserId: userId },
          { toUserName: keyword }
        ]
      },
      // 自分が受信者で、相手の名前で検索
      {
        and: [
          { toUserId: userId },
          { fromUserName: keyword }
        ]
      },
      // 自分が送信者で、相手のDIDで検索
      {
        and: [
          { fromUserId: userId },
          { toDidValue: keyword }
        ]
      },
      // 自分が受信者で、相手のDIDで検索
      {
        and: [
          { toUserId: userId },
          { fromDidValue: keyword }
        ]
      }
    ]
  };
};

export function useWalletsAndDidIssuanceRequests({ userId, listType, keyword }: UseWalletsAndDidIssuanceRequestsProps): {
  loading: boolean;
  error: ApolloError | undefined;
  allTransactions: any[];
  presentedTransactions: PresentedTransaction[];
} {
  const { data, error, loading,refetch, fetchMore } = useGetTransactionsQuery({
    variables: { 
      filter: createSearchFilter(userId, keyword),
      first: 500, 
      withDidIssuanceRequests: true
    },
    fetchPolicy: "network-only",
  });


  const allTransactions = useMemo<GqlTransaction[]>(() => {
    return (
      data?.transactions?.edges
        ?.flatMap(edge => edge?.node)
        .filter(
          (t): t is GqlTransaction =>
            !!t &&
            t.fromWallet !== null &&
            t.fromWallet?.type !== GqlWalletType.Community &&
            t.toWallet?.type !== GqlWalletType.Community
        ) ?? []
    );
  }, [data]);

  const presentedTransactions = useMemo<PresentedTransaction[]>(() => {
    return allTransactions.map( t =>
      presentTransaction({
        transaction: t,
        currentUserId: userId,
        didIssuanceRequests: t.fromWallet?.user?.didIssuanceRequests ?? [],
        listType,
      })
    );
  }, [allTransactions, userId, listType]);

  return {
    loading,
    error,
    allTransactions,
    presentedTransactions,
  };
}