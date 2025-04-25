import React, { useRef, useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import Image from 'next/image';
import { Share2, X, MapPin, Users, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

    const hostedPlaces = participationView.hosted.geo.map(place => ({
      ...place,
      participantCount: participationView.hosted.totalParticipantCount
    }));
    
    const participatedPlaces = participationView.participated.geo.map(place => ({
      ...place,
      participantCount: participationView.participated.totalParticipatedCount
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
                      
                      <button className="w-full bg-white text-gray-900 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                        もっと見る
                      </button>
                    </div>
                  </div>
                ))
            ))}
          </div>
        </div>
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleMapClick}
            className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border-2 border-[#4361ee] bg-white transition-colors text-[#4361ee] min-w-[200px]"
          >
            <span className="text-lg font-medium">地図</span>
            <Map className="w-6 h-6" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 