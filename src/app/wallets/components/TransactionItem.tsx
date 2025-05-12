'use client';

import React from 'react';
import { formatCurrency } from '@/app/wallets/data/presenter';
import { AppTransaction } from "@/app/wallets/data/type";

interface TransactionItemProps {
  transaction: AppTransaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction
}) => {
  const isPositive = transaction.transferPoints > 0;
  
  return (
    <div className="bg-background rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">{transaction.transferredAt}</p>
        </div>
        <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{formatCurrency(transaction.transferPoints)} pt
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
