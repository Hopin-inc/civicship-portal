'use client';

import React from 'react';
import { Membership } from '../../../../hooks/usePlaces';
import { PlaceList } from './PlaceList';
import PlaceToggleButton from './PlaceToggleButton';

interface PlaceListViewProps {
  memberships: Membership[];
  toggleMode: () => void;
}

const PlaceListView: React.FC<PlaceListViewProps> = ({ memberships, toggleMode }) => {
  return (
    <div className="relative h-full w-full">
      <PlaceList 
        memberships={memberships} 
        isMapMode={false}
      />
      <PlaceToggleButton isMapMode={false} onClick={toggleMode} />
    </div>
  );
};

export default PlaceListView;
