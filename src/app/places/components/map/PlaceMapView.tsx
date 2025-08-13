"use client";

import React, { useRef } from "react";
import PlaceToggleButton from "../ToggleButton";
import PlaceCardsSheet from "./DynamicPlaceCardsSheet";
import MapComponent from "./DynamicMapComponent";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceCard, IPlacePin } from "@/app/places/data/type";

interface PlaceMapViewProps {
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string | null) => void;
  toggleMode: () => void;
  placePins: IPlacePin[];
  places: IPlaceCard[];
}

const PlaceMapView: React.FC<PlaceMapViewProps> = ({
  selectedPlaceId,
  onPlaceSelect,
  toggleMode,
  placePins,
  places,
}) => {
  const recenterRef = useRef<() => void>();
  const handleRecenterReady = (fn: () => void) => {
    recenterRef.current = fn;
  };
  React.useEffect(() => {
    recenterRef.current = undefined;
  }, [selectedPlaceId]);

  return (
    <div className="relative h-full w-full">
      <MapComponent
        placePins={placePins}
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={onPlaceSelect}
        onRecenterReady={handleRecenterReady}
      />
      <AnimatePresence mode="wait">
        {selectedPlaceId ? (
          <motion.div
            key="place-cards"
            layout
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-[32px] inset-x-0 left-0 right-0 z-50 w-full flex items-center px-4 justify-center mx-auto"
            onAnimationComplete={() => {
              if (recenterRef.current) recenterRef.current();
            }}
          >
            <div className="relative w-full max-w-lg overflow-hidden mx-auto">
              <PlaceCardsSheet
                places={places}
                selectedPlaceId={selectedPlaceId}
                onPlaceSelect={onPlaceSelect}
              />
            </div>
          </motion.div>
        ) : (
          <PlaceToggleButton isMapMode={true} onClick={toggleMode} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceMapView;
