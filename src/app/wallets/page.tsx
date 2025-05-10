'use client';

import React, { useEffect } from 'react';
import { useWallet } from '@/hooks/features/wallet/useWallet';
import { useHeader } from '@/contexts/HeaderContext';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { WalletCard } from '@/components/features/wallet/WalletCard';
import { WalletHistoryButton } from '@/components/features/wallet/WalletHistoryButton';
import { WalletInfoSection } from '@/components/features/wallet/WalletInfoSection';
import { WalletActionButton } from '@/components/features/wallet/WalletActionButton';
import { WalletUsageSection } from '@/components/features/wallet/WalletUsageSection';

export default function WalletsPage() {
  const { currentPoint, isLoading, error } = useWallet();
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: '保有ポイント',
      showBackButton: true,
      showLogo: false,
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
        <ErrorState message="ウォレット情報の取得に失敗しました" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-6">
      <WalletCard currentPoint={currentPoint} isLoading={isLoading} />
      
      <WalletHistoryButton />
      
      <WalletInfoSection />
      
      <WalletActionButton>
        投稿してみる
      </WalletActionButton>
      
      <WalletUsageSection 
        title="ポイントを使う"
        message="ポイントを使ってサービスを利用できるようになったら、LINEからお伝えします💪"
      />
      
      <WalletUsageSection 
        title="ポイントをもらう"
        message="ポイントをもらえるお手伝いに参加できるようになったら、LINEからお伝えします💪"
      />
    </div>
  );
}
