'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Membership } from '../../../../hooks/usePlaces';
import PlaceToggleButton from './PlaceToggleButton';
import { PlaceList } from './PlaceList';
import PlaceCardsSheet from './PlaceCardsSheet';

const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => mod.default),
  { ssr: false }
);

interface PlaceMapViewProps {
  memberships: Membership[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  onClose: () => void;
  toggleMode: () => void;
  places: Array<{
    placeId: string;
    title: string;
    address: string;
    participantCount: number;
    description: string;
    image: string;
    bio?: string;
    userId: string;
    activeOpportunityCount?: number;
  }>;
}

const PlaceMapView: React.FC<PlaceMapViewProps> = ({
  memberships,
  selectedPlaceId,
  onPlaceSelect,
  onClose,
  toggleMode,
  places
}) => {
  return (
    <div className="relative h-full w-full">
      <MapComponent 
        memberships={memberships as any} 
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={onPlaceSelect}
      />
      {!selectedPlaceId && (
        <>
          <PlaceToggleButton isMapMode={true} onClick={toggleMode} />
          <PlaceList 
            memberships={memberships} 
            isMapMode={true} 
            selectedPlaceId={selectedPlaceId}
          />
        </>
      )}
      {selectedPlaceId && (
        <PlaceCardsSheet
          places={places}
          selectedPlaceId={selectedPlaceId}
          onClose={onClose}
          onPlaceSelect={onPlaceSelect}
        />
      )}
    </div>
  );
};

export default PlaceMapView;
