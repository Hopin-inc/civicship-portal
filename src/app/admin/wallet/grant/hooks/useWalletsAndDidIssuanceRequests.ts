import { useMemo } from "react";
import { GqlWalletType, GqlTransaction, useGetTransactionsQuery, GqlDidIssuanceRequest } from "@/types/graphql";
import { ApolloError } from "@apollo/client";
import { presentTransaction } from "../data/presenter/transaction";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

type PresentedTransaction = ReturnType<typeof presentTransaction>;

interface UseWalletsAndDidIssuanceRequestsProps {
  userId?: string;
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

export function useWalletsAndDidIssuanceRequests({ userId, listType, keyword }: UseWalletsAndDidIssuanceRequestsProps): {
  loading: boolean;
  error: ApolloError | undefined;
  allTransactions: any[];
  presentedTransactions: PresentedTransaction[];
} {

  const walletTypeFilter =
    listType === "grant"
      ? {
          or: [
            { fromWalletType: GqlWalletType.Community },
            { toWalletType: GqlWalletType.Community },
          ],
        }
      : {
          and: [
            { fromWalletType: GqlWalletType.Member },
            { toWalletType: GqlWalletType.Member },
          ],
        };

  const { data, error, loading,refetch, fetchMore } = useGetTransactionsQuery({
    variables: { 
      filter: {
        communityId: COMMUNITY_ID,
        ...walletTypeFilter,
        and: [
         {
          or: [
            { fromUserName: keyword },
            { toUserName: keyword },
            { fromDidValue: keyword },
            { toDidValue: keyword },
          ]
         }
        ],
        not: {
          and: [
            { fromUserId: userId },
            { toUserId: userId }
          ]
        }
      },
      first: 500, 
      withDidIssuanceRequests: true
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
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
        didIssuanceRequests: getDidIssuanceRequests(userId ?? "", t),
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