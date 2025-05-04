import { TransactionReason } from '@/gql/graphql';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const getTransactionDescription = (
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

export const formatTransactionDate = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy年M月d日', { locale: ja });
};

export const formatWalletData = (data: any) => {
  const currentPoint = data?.user?.wallets?.edges?.[0]?.node?.currentPointView?.currentPoint ?? 0;
  const ticketCount = data?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length ?? 0;
  return { currentPoint, ticketCount };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};
