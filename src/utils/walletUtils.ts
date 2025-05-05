import { GqlTransactionReason } from '@/types/graphql';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const getTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName?: string | null,
  toUserName?: string | null
): string => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return `${fromUserName}さんからのプレゼント`;
    case GqlTransactionReason.Grant:
      return `${fromUserName}さんからのポイント付与`;
    case GqlTransactionReason.Onboarding:
      return 'オンボーディングボーナス';
    case GqlTransactionReason.PointIssued:
      return 'ポイント発行';
    case GqlTransactionReason.PointReward:
      return 'ポイント報酬';
    case GqlTransactionReason.TicketPurchased:
      return `${toUserName}さんのチケットを購入`;
    case GqlTransactionReason.TicketRefunded:
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
