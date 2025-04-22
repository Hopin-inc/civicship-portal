import React from 'react';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import Image from 'next/image';
import { Share2, X, MapPin, Users } from 'lucide-react';

interface PlaceListProps {
  memberships: any[];
  onClose?: () => void;
}

export function PlaceList({ memberships, onClose }: PlaceListProps) {
  return (
    <Sheet defaultOpen>
      <SheetContent side="bottom" className="h-[100dvh] overflow-y-auto px-0">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-b">
          <h1 className="text-lg font-semibold">NEO88系</h1>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-16 pb-20">
          {memberships.map((membership, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={membership.node.placeImage || '/images/placeholder.jpg'}
                  alt={membership.node.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
                    <Image
                      src={membership.node.userImage || '/images/placeholder.jpg'}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{membership.node.name}</h3>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{membership.node.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>17人</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white rounded-full py-3 font-bold">
                  もっと見る
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button className="w-full rounded-full bg-white border border-gray-300 px-4 py-2 text-sm flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            地図
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 