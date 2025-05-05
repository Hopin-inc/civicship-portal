'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WalletHeaderProps {
  currentPoint: number;
  onSendPoints?: () => void;
  onReceivePoints?: () => void;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  currentPoint,
  onSendPoints,
  onReceivePoints
}) => {
  const formattedPoints = new Intl.NumberFormat('ja-JP').format(currentPoint);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-600 mb-1">現在のポイント</h2>
          <div className="text-3xl font-bold">{formattedPoints} <span className="text-lg">pt</span></div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {onSendPoints && (
            <Button 
              onClick={onSendPoints}
              variant="secondary"
              className="flex items-center justify-center"
            >
              <span className="mr-1">送る</span>
            </Button>
          )}
          
          {onReceivePoints && (
            <Button 
              onClick={onReceivePoints}
              className="flex items-center justify-center"
            >
              <span className="mr-1">受け取る</span>
            </Button>
          )}
          
          <Link href="/wallets/history">
            <Button 
              variant="secondary"
              className="flex items-center justify-center"
            >
              <span className="mr-1">履歴</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
