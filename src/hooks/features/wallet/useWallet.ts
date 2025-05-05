'use client';

import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { formatWalletData, getTransactionDescription, formatTransactionDate } from '@/utils/walletUtils';
import { useLoading } from "@/hooks";

const GET_WALLET = gql`
  query GetWallet($userId: ID!) {
    user(id: $userId) {
      id
      wallets {
        edges {
          node {
            id
            currentPointView {
              currentPoint
            }
            tickets {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_TRANSACTION_HISTORY = gql`
  query GetTransactionHistory($userId: ID!, $first: Int) {
    user(id: $userId) {
      id
      wallets {
        edges {
          node {
            id
            transactions(first: $first) {
              edges {
                node {
                  id
                  reason
                  createdAt
                }
                cursor
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    }
  }
`;

interface Transaction {
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
 * Custom hook for fetching and managing wallet data
 * @param userId Optional user ID. If not provided, fetches current user's wallet
 */
export const useWallet = (userId?: string) => {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { setIsLoading } = useLoading();
  const [currentPoint, setCurrentPoint] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const targetId = userId || authUser?.id;
  
  const { data, loading, error } = useQuery(GET_WALLET, {
    variables: { userId: targetId ?? '' },
    skip: !targetId,
    fetchPolicy: 'cache-and-network',
  });
  
  const { 
    data: transactionData, 
    loading: transactionLoading, 
    error: transactionError,
    fetchMore
  } = useQuery(GET_TRANSACTION_HISTORY, {
    variables: { 
      userId: targetId ?? '',
      first: 10,
      after: null
    },
    skip: !targetId,
    fetchPolicy: 'cache-and-network',
  });
  
  useEffect(() => {
    setIsLoading(loading || transactionLoading);
  }, [loading, transactionLoading, setIsLoading]);
  
  useEffect(() => {
    if (data) {
      const { currentPoint } = formatWalletData(data);
      setCurrentPoint(currentPoint);
    }
  }, [data]);
  
  useEffect(() => {
    if (transactionData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges) {
      const edges = transactionData.user.wallets.edges[0].node.transactions.edges;
      const formattedTransactions = edges.map((edge: any) => {
        const node = edge.node;
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
      });
      
      setTransactions(formattedTransactions);
      setHasMore(transactionData.user.wallets.edges[0].node.transactions.pageInfo.hasNextPage);
    }
  }, [transactionData]);
  
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    
    setIsLoadingMore(true);
    
    try {
      const lastTransaction = transactions[transactions.length - 1];
      const lastCursor = transactionData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges?.find(
        (edge: any) => edge.node.id === lastTransaction.id
      )?.cursor;
      
      const { data: moreData } = await fetchMore({
        variables: {
          userId: targetId,
          first: 10,
          after: lastCursor
        }
      });
      
      if (moreData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges) {
        const edges = moreData.user.wallets.edges[0].node.transactions.edges;
        const newTransactions = edges.map((edge: any) => {
          const node = edge.node;
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
        });
        
        setTransactions(prev => [...prev, ...newTransactions]);
        setHasMore(moreData.user.wallets.edges[0].node.transactions.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more transactions:', error);
      toast.error('取引履歴の読み込みに失敗しました');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const handleError = () => {
    if (error || transactionError) {
      console.error('Error fetching wallet data:', error || transactionError);
      toast.error('ウォレットデータの取得に失敗しました');
    }
  };
  
  useEffect(() => {
    handleError();
  }, [error, transactionError]);
  
  const [ticketCount, setTicketCount] = useState(0);
  
  useEffect(() => {
    if (data) {
      const { currentPoint, ticketCount } = formatWalletData(data);
      setCurrentPoint(currentPoint);
      setTicketCount(ticketCount);
    }
  }, [data]);
  
  return {
    currentPoint,
    ticketCount,
    transactions,
    isLoading: loading || transactionLoading,
    isLoadingMore,
    hasMore,
    error: error || transactionError,
    loadMore
  };
};

export default useWallet;
