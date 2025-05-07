'use client';

import { format } from 'date-fns';
import { GqlTransactionReason } from '@/types/graphql';

export interface WalletData {
  user?: {
    id: string;
    wallets?: {
      edges: Array<{
        node: {
          id: string;
          currentPointView?: {
            currentPoint: number;
          };
          tickets?: {
            edges: Array<{
              node: {
                id: string;
              };
            }>;
          };
        };
      }>;
    };
  };
}

export interface TransactionNode {
  id: string;
  amount: number;
  reason: GqlTransactionReason;
  createdAt: string;
  fromUser?: {
    id: string;
    name: string;
  } | null;
  toUser?: {
    id: string;
    name: string;
  } | null;
}

export interface Transaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
  description: string;
  date: string;
  fromUser?: {
    id: string;
    name: string;
  } | null;
  toUser?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Formats wallet data from GraphQL response
 */
export const formatWalletData = (data: WalletData) => {
  const walletNode = data?.user?.wallets?.edges?.[0]?.node;
  const currentPoint = walletNode?.currentPointView?.currentPoint ?? 0;
  const ticketCount = walletNode?.tickets?.edges?.length ?? 0;
  
  return {
    currentPoint,
    ticketCount
  };
};

/**
 * Gets a human-readable description for a transaction based on its reason
 */
export const getTransactionDescription = (
  reason: GqlTransactionReason,
  fromUserName?: string | null,
  toUserName?: string | null
): string => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return fromUserName ? `${fromUserName}さんからのプレゼント` : 'ポイントギフト';
    case GqlTransactionReason.Grant:
      return fromUserName ? `${fromUserName}さんからのポイント付与` : 'ポイント受取';
    case GqlTransactionReason.Onboarding:
      return 'オンボーディングボーナス';
    case GqlTransactionReason.PointIssued:
      return 'ポイント発行';
    case GqlTransactionReason.PointReward:
      return 'ポイント報酬';
    case GqlTransactionReason.TicketPurchased:
      return toUserName ? `${toUserName}さんのチケットを購入` : 'チケット購入';
    case GqlTransactionReason.TicketRefunded:
      return 'チケットの払い戻し';
    default:
      return '取引';
  }
};

/**
 * Formats a transaction date for display
 */
export const formatTransactionDate = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy年M月d日');
};

/**
 * Transforms a transaction node from GraphQL to a UI-friendly format
 */
export const transformTransaction = (node: TransactionNode): Transaction => {
  return {
    id: node.id,
    amount: node.amount,
    reason: node.reason,
    createdAt: node.createdAt,
    description: getTransactionDescription(
      node.reason,
      node.fromUser?.name,
      node.toUser?.name
    ),
    date: formatTransactionDate(node.createdAt),
    fromUser: node.fromUser,
    toUser: node.toUser
  };
};

/**
 * Formats a currency amount for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};
