'use client';

import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityNavigationButtonsProps {
  title: string;
  onBack: () => void;
}

const ActivityNavigationButtons: React.FC<ActivityNavigationButtonsProps> = ({
  title,
  onBack
}) => {
  const handleShare = () => {
     if (navigator.share) {
       navigator
         .share({
           title: title,
           url: window.location.href,
         })
         .catch((err) => console.error("共有に失敗しました", err));
     }
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={onBack}
          variant="tertiary"
          size="icon"
          className="rounded-full bg-white/90 shadow-md h-14 w-14 border border-input"
          aria-label="戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute top-6 right-4 z-50">
        <Button onClick={handleShare} variant="icon-only" size="icon" aria-label="シェア">
          <Share2 className="h-5 w-5 text-white" />
        </Button>
      </div>
    </>
  );
};

export default ActivityNavigationButtons;
