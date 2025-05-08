import { FC, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PlaceCardsSheetProps {
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
  selectedPlaceId: string | null;
  onClose: () => void;
  onPlaceSelect: (placeId: string) => void;
}

const PlaceCardsSheet: FC<PlaceCardsSheetProps> = ({ places, selectedPlaceId, onClose, onPlaceSelect }) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 選択されたPlaceが変更された時に、そのPlaceまでスクロール
  useEffect(() => {
    if (selectedPlaceId && scrollContainerRef.current) {
      const selectedCard = scrollContainerRef.current.querySelector(`[data-place-id="${selectedPlaceId}"]`) as HTMLElement;
      if (selectedCard) {
        selectedCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedPlaceId]);

  // スクロール終了時に最も中央に近いカードを選択
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    // スクロールのデバウンス処理
    const container = scrollContainerRef.current;
    clearTimeout((container as any).dataset.scrollTimeout);
    (container as any).dataset.scrollTimeout = setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestCard: HTMLElement | null = null;
      let minDistance = Infinity;

      const cards = container.querySelectorAll<HTMLElement>('[data-place-id]');
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      if (closestCard && (closestCard as HTMLElement).dataset.placeId) {
        const placeId = (closestCard as HTMLElement).dataset.placeId;
        if (placeId !== selectedPlaceId && placeId) {
          onPlaceSelect(placeId);
        }
      }
    }, 150) as any;
  };

  const handlePlaceClick = (placeId: string) => {
    onPlaceSelect(placeId);
    const place = places.find(p => p.placeId === placeId);
    if (place) {
      router.push(`/places/${placeId}?userId=${place.userId}`);
    }
  };

  if (!places.length) return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-4 left-0 right-0 z-50 mx-4"
    >
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-auto hide-scrollbar snap-x snap-mandatory max-w-[510px] mx-auto"
        onScroll={handleScroll}
      >
        <div className="flex gap-4 pb-2 px-2">
          {places.map((place) => (
            <motion.div
              key={place.placeId}
              data-place-id={place.placeId}
              className={`flex-none w-[345px] bg-background rounded-2xl shadow-lg transform transition-transform duration-200 snap-center ${
                selectedPlaceId === place.placeId ? 'scale-[1.02]' : 'scale-100'
              }`}
              onClick={() => handlePlaceClick(place.placeId)}
            >
              <div className="relative h-40 rounded-t-2xl overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 345px"
                />
              </div>

              <div className="p-4 flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-foreground text-sm truncate max-w-[180px]">{place.address}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{place.participantCount}人</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold mb-2 line-clamp-2">{place.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{place.bio || place.description}</p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div>
                    {place.activeOpportunityCount !== undefined && place.activeOpportunityCount > 0 && (
                      <span className="text-gray-700 text-sm">
                        <strong>{place.activeOpportunityCount}件</strong>の関わり方を募集中
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="py-2 px-6 rounded-lg text-sm"
                  >
                    もっと見る
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PlaceCardsSheet;
