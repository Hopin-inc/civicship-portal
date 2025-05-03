'use client';

import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PlaceCardProps {
  placeId: string;
  placeName: string;
  placeImage: string;
  participantCount: number;
  bio?: string;
  activeOpportunityCount?: number;
  onClick: (placeId: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  placeId,
  placeName,
  placeImage,
  participantCount,
  bio,
  activeOpportunityCount,
  onClick
}) => {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-[345px] mx-auto"
      onClick={() => onClick(placeId)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={placeImage}
          alt={placeName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 text-sm">{placeName}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 text-sm">{participantCount}人</span>
          </div>
        </div>
        
        <h2 className="text-lg font-bold mb-2 line-clamp-2">{placeName}</h2>
        {bio && <p className="text-gray-600 text-sm line-clamp-2 mb-4">{bio}</p>}
        
        <div className="flex items-center justify-between">
          {activeOpportunityCount !== undefined && activeOpportunityCount > 0 && (
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700 text-sm font-medium">{activeOpportunityCount}件の募集中</span>
            </div>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-shrink-0 py-2.5 px-6 rounded-lg text-sm"
          >
            もっと見る
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
