"use client";

import { GET_TRANSACTIONS, GET_TRANSACTION } from "@/graphql/transaction/query";
import { testApolloClient } from "../lib/apollo";

interface TransactionFilterInput {
  userId?: string;
  fromUserId?: string;
  toUserId?: string;
}

export const useTransactionQueries = () => {
  const getTransactions = async (filter: TransactionFilterInput = {}) => {
    const { data } = await testApolloClient.query({
      query: GET_TRANSACTIONS,
      variables: { filter },
      fetchPolicy: "network-only",
    });

    return data;
  };

  const getTransaction = async (id: string) => {
    if (!id) {
      throw new Error("Transaction ID is required");
    }

    const { data } = await testApolloClient.query({
      query: GET_TRANSACTION,
      variables: { id },
      fetchPolicy: "network-only",
    });

    return data;
  };

  return {
    getTransactions,
    getTransaction,
  };
};
