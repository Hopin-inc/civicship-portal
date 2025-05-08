'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Ticket } from 'lucide-react';
import { Opportunity } from "@/types";

interface ActivityDetailsHeaderProps {
  opportunity: Opportunity;
  availableTickets: number;
}

const ActivityDetailsHeader: React.FC<ActivityDetailsHeaderProps> = ({ 
  opportunity, 
  availableTickets 
}) => {
  return (
    <div className="relative w-full bg-background rounded-b-3xl shadow-md pb-6 max-w-mobile-l mx-auto w-full">
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={opportunity.images?.[0] || "/placeholder.png"}
          alt={opportunity.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{opportunity.place?.name || "場所未定"}</span>
          </div>
        </div>
      </div>

      {opportunity.isReservableWithTicket && availableTickets > 0 && (
        <div className="flex items-center gap-2 bg-[#EEF0FF] rounded-lg px-4 py-3">
          <Ticket className="w-5 h-5 text-[#4361EE]" />
          <p className="text-[#4361EE] font-medium">利用できるチケット {availableTickets}枚</p>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailsHeader;
