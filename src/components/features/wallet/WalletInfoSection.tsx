'use client';

import React from 'react';
import { Info } from 'lucide-react';

export const WalletInfoSection: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-bold mb-4">ポイントとは</h2>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-base">NEO88に関わる支払いで使えるようになるポイントです。</p>
        </li>
        <li className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-base">現時点では、体験に参加したり、当日の様子を投稿することでポイントを獲得できます。</p>
        </li>
      </ul>
    </div>
  );
};

export default WalletInfoSection;
