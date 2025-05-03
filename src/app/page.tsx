'use client';

import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIP_LIST } from '@/graphql/queries/membership';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaceList } from './components/features/places/PlaceList';
import PlaceCardsSheet from './components/features/places/PlaceCardsSheet';
import type { ComponentProps } from 'react';
import { useMemo, useEffect } from 'react';
import { List, MapPin } from 'lucide-react';
import { useLoading } from '@/hooks/useLoading';

type MapComponentProps = {
  memberships: any[];
  selectedPlaceId?: string | null;
  onPlaceSelect?: (placeId: string) => void;
};

interface Place {
  placeId: string;
  placeName: string;
  placeImage: string;
  latitude: number;
  longitude: number;
}

interface ParticipationView {
  participated: {
    totalParticipatedCount: number;
    geo: Place[];
  };
  hosted: {
    totalParticipantCount: number;
    geo: Place[];
  };
}

interface Membership {
  node: {
    id: string;
    bio?: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
    participationView: ParticipationView;
  };
}

const MapComponent = dynamic<ComponentProps<React.ComponentType<MapComponentProps>>>(
  () => import('./components/features/places/MapComponent').then((mod) => mod.default),
  { ssr: false }
);

export default function PlacesPage() {
  const { data, loading, error } = useQuery(GET_MEMBERSHIP_LIST);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlaceId = searchParams.get('placeId');
  const mode = searchParams.get('mode') || 'map';

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  console.log('GET_MEMBERSHIP_LIST', data)

  const handlePlaceSelect = (placeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('placeId', placeId);
    router.push(`/places?${params.toString()}`);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('placeId');
    router.push(`/places?${params.toString()}`);
  };

  const toggleMode = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', mode === 'map' ? 'list' : 'map');
    params.delete('placeId'); // モード切り替え時に選択状態をリセット
    router.push(`/places?${params.toString()}`);
  };

  const memberships = (data?.memberships?.edges || []) as Membership[];
  
  const places = useMemo(() => {
    const allPlaces: Array<{
      placeId: string;
      title: string;
      address: string;
      participantCount: number;
      description: string;
      image: string;
      bio?: string;
      userId: string;
      activeOpportunityCount: number;
    }> = [];

    memberships.forEach(({ node }) => {
      // アクティブな募集数を計算
      const activeOpportunityCount = node.user.opportunitiesCreatedByMe?.edges
        .filter(edge => edge.node.publishStatus === 'PUBLIC')
        .length || 0;

      // 主催したイベントの場所
      node.participationView.hosted.geo.forEach((location: Place) => {
        const participatedGeo = node.participationView.participated.geo;
        if (!participatedGeo || participatedGeo.length === 0) return;

        allPlaces.push({
          placeId: location.placeId,
          title: node.user.name,
          address: participatedGeo[0].placeName,
          participantCount: node.participationView.hosted.totalParticipantCount,
          description: "イベントの説明",
          image: location.placeImage,
          bio: node.bio,
          userId: node.user.id,
          activeOpportunityCount
        });
      });
    });

    return allPlaces;
  }, [memberships]);
  
  if (error) return <div>Error: {error.message}</div>;

  if (mode === 'list') {
    return (
      <div className="h-screen w-full">
        <div className="relative h-full w-full">
          <PlaceList 
            memberships={memberships} 
            isMapMode={false}
          />
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={toggleMode}
              className="w-[104px] h-[48px] rounded-full bg-[#4169E1] text-white flex items-center justify-center gap-1.5 hover:bg-[#3154c4] transition-colors shadow-lg"
            >
              <MapPin className="h-4 w-4" />
              地図
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="relative h-full w-full">
        <MapComponent 
          memberships={memberships} 
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
        />
        {!selectedPlaceId && (
          <>
            <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 z-50">
              <button 
                onClick={toggleMode}
                className="w-[104px] h-[48px] rounded-full bg-white text-[#4169E1] flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors shadow-xl border border-gray-100"
              >
                <List className="h-4 w-4" />
                一覧
              </button>
            </div>
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
            onClose={handleClose}
            onPlaceSelect={handlePlaceSelect}
          />
        )}
      </div>
    </div>
  );
}
