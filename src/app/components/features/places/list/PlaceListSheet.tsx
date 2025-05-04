'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import PlaceCard from './PlaceCard';
import { Membership } from '@/hooks/usePlaces';

interface PlaceListSheetProps {
  memberships: Membership[];
  selectedPlaceId?: string | null;
  onMapClick: () => void;
  getAllPlaces: (membership: Membership) => any[];
}

const PlaceListSheet: React.FC<PlaceListSheetProps> = ({
  memberships,
  selectedPlaceId,
  onMapClick,
  getAllPlaces
}) => {
  const router = useRouter();

  const handlePlaceClick = (placeId: string, userId: string) => {
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  return (
    <Sheet defaultOpen onOpenChange={onMapClick}>
      <SheetContent 
        side="bottom" 
        className="h-[100dvh] overflow-y-auto px-6 mx-auto max-w-lg"
      >
        <div className="pt-16 pb-24">
          <div className="grid gap-4">
            {memberships.map((membership) => (
              getAllPlaces(membership)
                .filter(place => !selectedPlaceId || place.placeId === selectedPlaceId)
                .map((place) => (
                  <PlaceCard
                    key={place.placeId}
                    placeId={place.placeId}
                    placeName={place.placeName}
                    placeImage={place.placeImage}
                    participantCount={place.participantCount}
                    bio={membership.node.bio}
                    activeOpportunityCount={place.activeOpportunityCount}
                    onClick={() => handlePlaceClick(place.placeId, membership.node.user.id)}
                  />
                ))
            ))}
          </div>
        </div>
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={onMapClick}
            variant="secondary"
            className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border-2 border-[#4361ee] text-[#4361ee] min-w-[200px]"
          >
            <span className="text-lg font-medium">地図</span>
            <Map className="w-6 h-6" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlaceListSheet;
