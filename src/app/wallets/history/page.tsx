'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { WalletTransactionsDocument } from '@/graphql/queries/wallet';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TransactionReason } from '@/gql/graphql';
import { useParams } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';

const getTransactionDescription = (
  reason: TransactionReason,
  fromUserName?: string | null,
  toUserName?: string | null
): string => {
  switch (reason) {
    case TransactionReason.Donation:
      return `${fromUserName}さんからのプレゼント`;
    case TransactionReason.Grant:
      return `${fromUserName}さんからのポイント付与`;
    case TransactionReason.Onboarding:
      return 'オンボーディングボーナス';
    case TransactionReason.PointIssued:
      return 'ポイント発行';
    case TransactionReason.PointReward:
      return 'ポイント報酬';
    case TransactionReason.TicketPurchased:
      return `${toUserName}さんのチケットを購入`;
    case TransactionReason.TicketRefunded:
      return 'チケットの払い戻し';
    default:
      return '取引';
  }
};

export default function HistoryPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: 'ポイント履歴',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const { data, loading, error } = useQuery(WalletTransactionsDocument, {
    variables: { 
      filter: {
        fromWalletId: userId,
        toWalletId: userId,
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const transactions = data?.transactions?.edges
    ?.map(edge => edge?.node)
    .filter(Boolean) ?? [];

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden">
      {transactions.map((transaction) => {
        if (!transaction) return null;

        const isIncome = transaction.toPointChange != null && transaction.toPointChange > 0;
        const amount = isIncome ? transaction.toPointChange : transaction.fromPointChange;
        const description = getTransactionDescription(
          transaction.reason,
          transaction.fromWallet?.user?.name,
          transaction.toWallet?.user?.name
        );

        return (
          <div
            key={transaction.id}
            className="p-4 border-b border-gray-200 last:border-b-0"
          >
            <p className="text-sm text-gray-600 mb-1">
              {format(new Date(transaction.createdAt), 'yyyy年M月d日', { locale: ja })}
            </p>
            <div className="flex justify-between items-center">
              <p>{description}</p>
              <p
                className={`font-bold ${
                  isIncome ? 'text-blue-500' : 'text-red-500'
                }`}
              >
                {isIncome ? `+${amount}` : amount}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
