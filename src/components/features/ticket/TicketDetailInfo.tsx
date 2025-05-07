'use client';

import React from 'react';

interface TicketDetailInfoProps {
  ticketCount: number;
  purpose: string;
}

/**
 * Component to display ticket information details
 */
export const TicketDetailInfo: React.FC<TicketDetailInfoProps> = ({
  ticketCount,
  purpose
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex">
        <span className="text-muted-foreground w-16">枚数</span>
        <span>{ticketCount}枚</span>
      </div>
      
      <div className="flex">
        <span className="text-gray-600 w-16">用途</span>
        <span className="whitespace-pre-line flex-1">{purpose}</span>
      </div>
    </div>
  );
};

export default TicketDetailInfo;
