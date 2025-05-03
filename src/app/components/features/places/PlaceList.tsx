import React, { useRef, useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import Image from 'next/image';
import { Share2, X, MapPin, Users, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Place {
  placeId: string;
  placeName: string;
  placeImage: string;
  latitude: number;
  longitude: number;
  activeOpportunityCount?: number;
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
      opportunitiesCreatedByMe?: {
        edges: Array<{
          node: {
            id: string;
            publishStatus: string;
          };
        }>;
      };
    };
    participationView?: ParticipationView;
  };
}

interface PlaceListProps {
  memberships: Membership[];
  onClose?: () => void;
  isMapMode?: boolean;
  selectedPlaceId?: string | null;
}

export function PlaceList({ memberships, onClose, isMapMode = false, selectedPlaceId }: PlaceListProps) {
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(isMapMode ? '80px' : '100dvh');
  let startY = 0;
  let startHeight = 0;

  useEffect(() => {
    setSheetHeight(isMapMode ? '80px' : '100dvh');
  }, [isMapMode]);

  useEffect(() => {
    if (selectedPlaceId && isMapMode) {
      setSheetHeight('50dvh');
    } else if (isMapMode) {
      setSheetHeight('80px');
    }
  }, [selectedPlaceId, isMapMode]);

  const handlePlaceClick = (placeId: string, userId: string) => {
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  const handleMapClick = () => {
    router.push('/places?mode=map');
  };

  const getAllPlaces = (membership: Membership) => {
    const participationView = membership.node.participationView;
    if (!participationView) return [];

    const activeOpportunityCount = membership.node.user.opportunitiesCreatedByMe?.edges
      .filter(edge => edge.node.publishStatus === 'PUBLIC')
      .length || 0;

    const hostedPlaces = participationView.hosted.geo.map(place => ({
      ...place,
      participantCount: participationView.hosted.totalParticipantCount,
      activeOpportunityCount
    }));
    
    const participatedPlaces = participationView.participated.geo.map(place => ({
      ...place,
      participantCount: participationView.participated.totalParticipatedCount,
      activeOpportunityCount
    }));

    return [...hostedPlaces, ...participatedPlaces];
  };

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || !isMapMode) return;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startHeight = sheet.clientHeight;
      sheet.style.transition = 'none';
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      const newHeight = Math.max(100, startHeight + deltaY);
      sheet.style.height = `${newHeight}px`;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const windowHeight = window.innerHeight;
      sheet.style.transition = 'height 0.3s ease';
      
      if (sheet.clientHeight > windowHeight * 0.3) {
        router.push('/places?mode=list');
      } else {
        sheet.style.height = selectedPlaceId ? '50dvh' : '100px';
      }
    };

    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove);
    sheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [router, isMapMode, selectedPlaceId]);

  const totalPlaces = memberships.reduce((total, membership) => 
    total + getAllPlaces(membership).length, 0);

  if (isMapMode) {
    return (
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-[20px] transition-[height] duration-300 ease-in-out z-40"
        style={{ height: sheetHeight }}
      >
        <div className="flex items-center justify-center h-1.5 w-12 mx-auto mt-6 mb-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        <div className="text-center py-1.5 text-gray-600 text-sm px-6">
          {selectedPlaceId ? "選択された拠点の情報" : `${totalPlaces}箇所の拠点が表示されています`}
        </div>
      </div>
    );
  }

  return (
    <Sheet defaultOpen onOpenChange={() => router.push('/places?mode=map')}>
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
                  <div
                    key={place.placeId}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-[345px] mx-auto"
                    onClick={() => handlePlaceClick(place.placeId, membership.node.user.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.placeImage}
                        alt={place.placeName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700 text-sm">{place.placeName}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700 text-sm">{place.participantCount}人</span>
                        </div>
                      </div>
                      
                      <h2 className="text-lg font-bold mb-2 line-clamp-2">{place.placeName}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{membership.node.bio || ''}</p>
                      
                      <div className="flex items-center justify-between">
                        {place.activeOpportunityCount !== undefined && place.activeOpportunityCount > 0 && (
                          <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700 text-sm font-medium">{place.activeOpportunityCount}件の募集中</span>
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
                ))
            ))}
          </div>
        </div>
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={handleMapClick}
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
}        