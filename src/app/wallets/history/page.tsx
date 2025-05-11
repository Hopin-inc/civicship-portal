'use client';

import React, { useEffect } from 'react';
import { useTransactionHistory } from '@/hooks/features/wallet/useTransactionHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useHeader } from '@/components/providers/HeaderProvider';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { TransactionItem } from '@/components/features/wallet/TransactionItem';

export default function HistoryPage() {
  const { user } = useAuth();
  const { updateConfig } = useHeader();
  const { transactions, isLoading, error } = useTransactionHistory(user?.id ?? '');

  useEffect(() => {
    updateConfig({
      title: 'ポイント履歴',
      showBackButton: true,
      showLogo: false,
      // showBottomNav is not a valid property in HeaderConfig

    });
  }, [updateConfig]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState 
          message="取引履歴の取得に失敗しました" 
        />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-muted-foreground text-center">
          取引履歴はありません
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background rounded-lg overflow-hidden p-4">
      <h1 className="text-xl font-bold mb-6">取引履歴</h1>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
