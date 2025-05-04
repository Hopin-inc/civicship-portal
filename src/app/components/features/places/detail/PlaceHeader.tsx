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
    <div className="px-4 mt-6">
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

      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <h2 className="text-xl mb-4">{headline}</h2>
      {bio && <p className="text-gray-600 mb-6">{bio}</p>}
    </div>
  );
};

export default PlaceHeader;
