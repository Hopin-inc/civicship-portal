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
  error: ApolloError | undefined;
  allTransactions: any[];
  presentedTransactions: PresentedTransaction[];
  loading: boolean;
} {
  const { data, error, refetch, fetchMore } = useGetTransactionsQuery({
    variables: { 
      filter: createSearchFilter(userId, keyword),
      first: 500 
    },
    fetchPolicy: "network-only",
  });

  const userIds = useMemo(() => {
    const ids =
      data?.transactions?.edges
        ?.flatMap(edge => edge?.node)
        .flatMap(t => [
          t?.fromWallet?.user?.id,
          t?.toWallet?.user?.id
        ])
        .filter((id): id is string => !!id) ?? [];
    return Array.from(new Set(ids));
  }, [data]);

  const { data: walletDidIssuanceRequests, loading: walletDidIssuanceRequestsLoading } = useGetDidIssuanceRequestsQuery({
    variables: { userIds },
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
        didIssuanceRequests: walletDidIssuanceRequests ?? { users: { edges: [] } },
        listType,
      })
    );
  }, [allTransactions, userId, walletDidIssuanceRequests, listType]);

  return {
    error,
    loading: walletDidIssuanceRequestsLoading,
    allTransactions,
    presentedTransactions,
  };
}