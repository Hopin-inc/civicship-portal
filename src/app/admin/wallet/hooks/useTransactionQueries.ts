import {
  GqlTransactionFilterInput,
  useGetTransactionLazyQuery,
  useGetTransactionsLazyQuery,
} from "@/types/graphql";

export const useTransactionQueries = () => {
  const [
    fetchTransactions,
    { data: transactionsData, loading: loadingTransactions, error: transactionsError },
  ] = useGetTransactionsLazyQuery({
    fetchPolicy: "network-only",
  });

  const [
    fetchTransaction,
    { data: transactionData, loading: loadingTransaction, error: transactionError },
  ] = useGetTransactionLazyQuery({
    fetchPolicy: "network-only",
  });

  const getTransactions = (filter: GqlTransactionFilterInput = {}) => {
    return fetchTransactions({ variables: { filter } });
  };

  const getTransaction = (id: string) => {
    if (!id) throw new Error("Transaction ID is required");
    return fetchTransaction({ variables: { id } });
  };

  return {
    getTransactions,
    getTransaction,
    transactionsData,
    transactionData,
    loadingTransactions,
    loadingTransaction,
    transactionsError,
    transactionError,
  };
};
