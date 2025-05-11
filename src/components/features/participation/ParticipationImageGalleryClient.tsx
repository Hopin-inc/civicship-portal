'use client';

import React from 'react';
import { AsymmetricImageGrid } from "@/components/ui/asymmetric-image-grid";
import { Button } from "@/components/ui/button";
import { formatImageData } from '@/presenters/participation';

interface ParticipationImageGalleryClientProps {
  images: string[];
}

export const ParticipationImageGalleryClient = ({
  images,
}: ParticipationImageGalleryClientProps) => {
  if (!images || images.length === 0) return null;

  const allImages = formatImageData(images);
  const displayImages = allImages.slice(0, 3);
  const remainingCount = Math.max(0, allImages.length - 3);

  const handleViewAllImages = () => {
    console.log(`残りの画像枚数: ${remainingCount}枚`);
  };

  return (
    <div className="mb-6">
      <div className="max-w-3xl">
        <div className="space-y-4">
          <AsymmetricImageGrid images={displayImages} />
          {remainingCount > 0 && (
            <Button
              variant="secondary"
              className="w-full border-[#4361EE] text-[#4361EE] hover:bg-[#4361EE] hover:text-white"
              onClick={handleViewAllImages}
            >
              {remainingCount + 3}枚の写真をすべて見る
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
