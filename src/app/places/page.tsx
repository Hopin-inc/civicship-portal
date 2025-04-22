'use client';

import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIP_LIST } from '@/graphql/queries/membership';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { PlaceList } from '../components/features/places/PlaceList';
import type { ComponentProps } from 'react';

type MapComponentProps = {
  memberships: any[];
};

const MapComponent = dynamic<ComponentProps<React.ComponentType<MapComponentProps>>>(
  () => import('../components/features/places/MapComponent').then((mod) => mod.default),
  { ssr: false }
);

export default function PlacesPage() {
  const { data, loading, error } = useQuery(GET_MEMBERSHIP_LIST);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'map';
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const memberships = data?.memberships?.edges || [];

  return (
    <div className="h-screen w-full">
      <div className="relative h-full w-full">
        <MapComponent memberships={memberships} />
        {mode === 'list' && <PlaceList memberships={memberships} />}
      </div>
    </div>
  );
}
