'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface WalletUsageSectionProps {
  title: string;
  message: string;
}

const WalletUsageSection: React.FC<WalletUsageSectionProps> = ({
  title,
  message
}) => {
  return (
    <div className="mt-6 mb-6">
      <h2 className="text-[22px] font-bold mb-4">{title}</h2>
      <div className="bg-background rounded-[20px] p-4 border border-input">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-2">リリース準備中</p>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletUsageSection;
