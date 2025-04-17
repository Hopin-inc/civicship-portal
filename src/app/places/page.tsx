'use client';

import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIPS } from '@/graphql/queries/memberships';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MapComponent = dynamic<any>(() => import('../components/features/places/MapComponent'), { ssr: false });

export default function PlacesPage() {
  const { data, loading, error } = useQuery(GET_MEMBERSHIPS);

  console.log('GET_MEMBERSHIPS', data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="h-screen w-full">
      <div className="relative h-full w-full">
        <MapComponent memberships={data?.memberships?.edges || []} />
      </div>
    </div>
  );
}
