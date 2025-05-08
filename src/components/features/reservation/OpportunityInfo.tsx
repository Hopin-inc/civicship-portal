'use client';

import React from 'react';
import Image from 'next/image';
import type { Opportunity } from '@/types';

interface OpportunityInfoProps {
  opportunity: Opportunity;
  pricePerPerson: number;
}

/**
 * Component to display opportunity information
 */
export const OpportunityInfo: React.FC<OpportunityInfoProps> = ({ 
  opportunity, 
  pricePerPerson 
}) => {
  return (
    <div className="px-4 mt-8 mb-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="title-lg font-bold leading-tight mb-4">
            {opportunity.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder-avatar.png"
                alt="田中 太郎"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl">田中 太郎</span>
          </div>
        </div>

        <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={opportunity.images?.[0] || "/placeholder.png"}
            alt={opportunity.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityInfo;
