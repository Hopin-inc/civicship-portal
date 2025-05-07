'use client';

import React from 'react';
import { formatCurrency } from '@/transformers/wallet';

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

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction
}) => {
  const isPositive = transaction.amount > 0;
  
  return (
    <div className="bg-background rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">{transaction.date}</p>
        </div>
        <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{formatCurrency(transaction.amount)} pt
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
