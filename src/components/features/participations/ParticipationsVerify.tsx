import React from 'react';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {IconWrapper} from '@/components/features/reservation/IconWrapper';

// Figmaから抽出した体験リスト（仮データ）
const experiences = [
  {
    title: '棚田でおにぎりづくり体験　最後は藁でしめ縄作り！',
    date: '2025/7/25に参加',
  },
  {
    title: '伝統建築の町並みで写真散歩　最後は自家製プリントで写真展！',
    date: '2025/7/25に参加',
  },
  {
    title: '牧場でチーズ作り体験　最後はできたてモッツァレラで乾杯！',
    date: '2025/7/25に参加',
  },
  {
    title: '渓谷で天然石拾い　最後はアクセサリー作り体験！',
    date: '2025/7/25に参加',
  },
];

const ParticipationsVerify: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto p-6 rounded-2xl border-none shadow-lg bg-background">
      {/* Infoエリア */}
      <div className="flex items-center gap-2 mb-6">
        <IconWrapper>
          <Info className="w-5 h-5 text-primary" />
        </IconWrapper>
        <span className="text-sm text-foreground">
          アプリを通じて参加した関わりの主催者に、実際に参加したかを確認できる機能です
        </span>
      </div>
      {/* 体験リスト */}
      <div className="space-y-4">
        {experiences.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-xl border bg-[#EFF6FF] border-blue-100"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-blue-600 text-blue-600 focus:ring-blue-500"
              disabled
            />
            <div>
              <div className="font-medium text-gray-900 text-base leading-tight">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ParticipationsVerify;      