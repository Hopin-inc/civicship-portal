'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { IconWrapper } from './IconWrapper';

interface NotesSectionProps {
  requireApproval?: boolean;
}

/**
 * Component to display reservation notes and warnings
 */
export const NotesSection: React.FC<NotesSectionProps> = ({ 
  requireApproval = false 
}) => {
  return (
    <div className="rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">留意事項</h3>
      <div className="space-y-4">
        {requireApproval && (
          <div className="flex items-center gap-3">
            <IconWrapper color="warning">
              <AlertCircle size={18} strokeWidth={1.5} />
            </IconWrapper>
            <p className="text-sm flex-1">ホストによる確認後に、予約が確定します。</p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-sm flex-1">
            実施確定または中止のどちらの場合でも、公式LINEから14日前までにご連絡します。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-sm flex-1">当日は現金をご用意下さい。</p>
        </div>
        <div className="flex items-center gap-3">
          <IconWrapper color="warning">
            <AlertCircle size={18} strokeWidth={1.5} />
          </IconWrapper>
          <p className="text-sm flex-1">キャンセルは開催日の7日前まで可能です。</p>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
