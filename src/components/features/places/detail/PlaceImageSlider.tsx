'use client';

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface PlaceImageSliderProps {
  images: Array<{url: string; alt: string}>;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex?: (index: number) => void;
}

const PlaceImageSlider: React.FC<PlaceImageSliderProps> = ({
  images,
  currentIndex,
  onNext,
  onPrev,
  onSelectIndex
}) => {
  if (!images.length) return null;

  return (
    <div className="relative mx-auto" style={{ width: "100%", height: "480px" }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]?.url || "/images/place-detail.jpg"}
            alt={images[currentIndex]?.alt || `スライド ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <Button
                key={index}
                onClick={() => onSelectIndex && onSelectIndex(index)}
                variant="link"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceImageSlider;
