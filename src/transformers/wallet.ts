'use client';

import { format } from 'date-fns';
import { TransactionReason } from '../gql/graphql';

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
  reason: TransactionReason;
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
  reason: TransactionReason,
  fromUserName?: string | null,
  toUserName?: string | null
): string => {
  switch (reason) {
    case TransactionReason.Donation:
      return fromUserName ? `${fromUserName}さんからのプレゼント` : 'ポイントギフト';
    case TransactionReason.Grant:
      return fromUserName ? `${fromUserName}さんからのポイント付与` : 'ポイント受取';
    case TransactionReason.Onboarding:
      return 'オンボーディングボーナス';
    case TransactionReason.PointIssued:
      return 'ポイント発行';
    case TransactionReason.PointReward:
      return 'ポイント報酬';
    case TransactionReason.TicketPurchased:
      return toUserName ? `${toUserName}さんのチケットを購入` : 'チケット購入';
    case TransactionReason.TicketRefunded:
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
