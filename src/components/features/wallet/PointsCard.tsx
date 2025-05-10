'use client';

import React from 'react';
import Image from 'next/image';

interface PointsCardProps {
  currentPoint: number;
  isLoading: boolean;
}

export const PointsCard: React.FC<PointsCardProps> = ({
  currentPoint,
  isLoading
}) => {
  return (
    <div className="bg-background rounded-[32px] px-12 py-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] mt-8 mb-8">
      <div className="flex flex-col items-center mb-12">
        <div className="text-sm text-muted-foreground mb-2">NEO88 残高</div>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline">
            <span className="text-[40px] font-bold leading-none tracking-tight">
              {isLoading ? '...' : currentPoint.toLocaleString()}
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
  );
};

export default PointsCard;
