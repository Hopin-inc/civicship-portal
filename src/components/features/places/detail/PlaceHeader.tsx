'use client';

import React from 'react';
import { MapPin, Users } from 'lucide-react';

interface PlaceHeaderProps {
  address: string;
  participantCount: number;
  name: string;
  headline: string;
  bio?: string;
}

const PlaceHeader: React.FC<PlaceHeaderProps> = ({
  address,
  participantCount,
  name,
  headline,
  bio
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b max-w-mobile-l mx-auto w-full h-16 flex flex-col justify-center px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">{address}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">
            {participantCount}人
          </span>
        </div>
      </div>

      <h1 className="text-lg font-bold text-center truncate mb-1">{name}</h1>
      <h2 className="text-base text-center mb-1">{headline}</h2>
      {bio && <p className="text-gray-600 mb-6">{bio}</p>}
    </header>
  );
};

export default PlaceHeader;
