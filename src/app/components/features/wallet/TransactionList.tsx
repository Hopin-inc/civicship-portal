'use client';

import React, { useRef } from 'react';
import { TransactionItem } from './TransactionItem';

interface Transaction {
  id: string;
  amount: number;
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

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore
}) => {
  const lastTransactionRef = useRef<HTMLDivElement>(null);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <p className="text-gray-500">取引履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">取引履歴</h2>
      
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            ref={index === transactions.length - 1 ? lastTransactionRef : null}
          >
            <TransactionItem transaction={transaction} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoadingMore ? '読み込み中...' : 'もっと見る'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
