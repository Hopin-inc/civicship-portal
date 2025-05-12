// 'use client';
//
// import { useState, useEffect, useMemo } from 'react';
// import { toast } from 'sonner';
// import { useGetTransactionsQuery } from "@/types/graphql";
// import { AppTransaction } from "@/types/transaction";
// import { presenterTransaction } from "@/presenters/transaction";
//
// export const useTransactionHistoryController = (userId: string) => {
//   const [transactions, setTransactions] = useState<AppTransaction[]>([]);
//
//   const { data, loading, error } = useGetTransactionsQuery({
//     variables: { filter: { fromUserId: userId, toUserId: userId } },
//   });
//
//   useEffect(() => {
//     const formatted = data?.transactions.edges?.map(tx => {
//       const presented: AppTransaction = presenterTransaction(tx, mainWallet.id);
//       return {
//         id: presented.id,
//         amount: presented.transferPoints,
//         description: presented.description,
//         date: presented.transferredAt,
//         isIncome: presented.transferPoints > 0
//       };
//     });
//     setTransactions(formatted);
//   }, [data, userId]);
//
//   const formattedError = useMemo(() => {
//     if (error) {
//       console.error('Error fetching transaction history:', error);
//       toast.error('取引履歴の取得に失敗しました');
//       return formatError(error);
//     }
//     return null;
//   }, [error]);
//
//   return {
//     transactions,
//     isLoading: loading,
//     error: formattedError
//   };
// };
