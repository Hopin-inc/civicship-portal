'use client';

import { FC, useEffect } from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_USER_WALLET } from '@/graphql/queries/user';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';

const WalletsPage: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { updateConfig } = useHeader();
  const { data, loading } = useQuery(GET_USER_WALLET, {
    variables: { id: user?.id ?? '' },
    skip: !user?.id,
  });

  useEffect(() => {
    updateConfig({
      title: '保有ポイント',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const currentPoint = data?.user?.wallets?.edges?.[0]?.node?.currentPointView?.currentPoint ?? 0;

  const handleHistoryClick = () => {
    router.push('/wallets/history');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-6">
      {/* Points Card */}
      <div className="bg-white rounded-[32px] px-12 py-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] mt-8 mb-8">
        <div className="flex flex-col items-center mb-12">
          <div className="text-sm text-gray-500 mb-2">NEO88 残高</div>
          <div className="flex items-center gap-3">
            <div className="flex items-baseline">
              <span className="text-[40px] font-bold leading-none tracking-tight">
                {loading ? '...' : currentPoint.toLocaleString()}
              </span>
              <span className="text-base ml-0.5">pt</span>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <Image
            src="/images/neo88-logo.jpg"
            alt="NEO88"
            width={80}
            height={24}
            className="opacity-60"
          />
        </div>
      </div>

      {/* History Button */}
      <div className="flex justify-center mb-10">
        <button 
          onClick={handleHistoryClick}
          className="flex items-center justify-center gap-1.5 w-[104px] h-[48px] rounded-full bg-white border border-gray-200"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="text-base">履歴</span>
        </button>
      </div>

      {/* Points Information */}
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

      {/* Action Button */}
      <button className="w-full py-4 rounded-full bg-[#0066F5] text-white font-medium text-base mb-8">
        投稿してみる
      </button>

      {/* Points Usage */}
      <div className="mt-6 mb-6">
        <h2 className="text-[22px] font-bold mb-4">ポイントを使う</h2>
        <div className="bg-white rounded-[20px] p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-2">リリース準備中</p>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                ポイントを使ってサービスを利用できるようになったら、LINEからお伝えします💪
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <h2 className="text-[22px] font-bold mb-4">ポイントをもらう</h2>
        <div className="bg-white rounded-[20px] p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-2">リリース準備中</p>
              <p className="text-gray-500 text-[15px] leading-relaxed">
              ポイントをもらえるお手伝いに参加できるようになったら、LINEからお伝えします💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsPage;
