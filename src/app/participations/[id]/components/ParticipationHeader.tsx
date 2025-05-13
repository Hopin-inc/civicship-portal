'use client';

import React from 'react';
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Opportunity } from '@/app/participations/[id]/data/type';

interface ParticipationHeaderProps {
  opportunity: Opportunity;
}

export const ParticipationHeader: React.FC<ParticipationHeaderProps> = ({
  opportunity,
}) => {
  return (
    <div className="flex gap-6 mb-6 max-w-mobile-l mx-auto w-full">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">{opportunity.title}</h1>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {opportunity.createdByUser?.image ? (
              <AvatarImage
                src={opportunity.createdByUser.image}
                alt={opportunity.createdByUser.name || ""}
              />
            ) : null}
            <AvatarFallback>
              {opportunity.createdByUser?.name ? opportunity.createdByUser.name.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg">{opportunity.createdByUser?.name ?? "未設定"}</span>
        </div>
      </div>

      {opportunity.images && opportunity.images.length > 0 && (
        <div className="w-[108px] h-[108px] flex-shrink-0">
          <div className="relative w-full h-full">
            <Image
              src={opportunity.images[0]}
              alt={opportunity.title}
              fill
              className="object-cover rounded-lg"
              sizes="108px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipationHeader;
