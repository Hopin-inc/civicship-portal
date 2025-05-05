'use client';

import React from 'react';
import Image from 'next/image';

interface TicketDetailProfileProps {
  hostName: string;
  hostImage: string;
}

/**
 * Profile component for the ticket detail page
 */
export const TicketDetailProfile: React.FC<TicketDetailProfileProps> = ({
  hostName,
  hostImage
}) => {
  return (
    <div className="text-center mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl mb-1">
          {hostName}さんから
        </h2>
        <p>招待チケットが届きました</p>
      </div>

      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden relative">
          <Image
            src={hostImage || "/placeholder-profile.jpg"}
            alt={`${hostName}のプロフィール`}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailProfile;
