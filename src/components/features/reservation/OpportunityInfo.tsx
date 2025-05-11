'use client';

import React from 'react';
import Image from 'next/image';
import { ActivityDetail } from "@/types/opportunity";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | null;
}

export const OpportunityInfo: React.FC<OpportunityInfoProps> = ({ 
  opportunity,
}) => {
  return (
    <div className="px-4 mt-8 mb-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="title-lg font-bold leading-tight mb-4">
            {opportunity?.title ?? ""}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={opportunity?.host?.image ?? "/placeholder-avatar.png"}
                alt={opportunity?.host?.name ?? "ホスト"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl">{opportunity?.host?.name ?? "ホスト"}</span>
          </div>
        </div>

        <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={opportunity?.images?.[0] || "/placeholder.png"}
            alt={opportunity?.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityInfo;
