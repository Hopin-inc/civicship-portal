"use client";

import React from "react";
import PlaceToggleButton from "../ToggleButton";
import PlaceCardsSheet from "./PlaceCardsSheet";
import MapComponent from "./MapComponent";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceCard, IPlacePin } from "@/app/places/data/type";

interface PlaceMapViewProps {
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
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
  return (
    <div className="relative h-full w-full">
      <MapComponent
        placePins={placePins}
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={onPlaceSelect}
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
            className="fixed bottom-[210px] inset-x-0 left-0 right-0 z-50 max-w-[444px] w-full h-16 flex items-center px-4 justify-between mx-auto"
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
          <motion.div
            key="toggle-button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[80px] right-4 z-50"
          >
            <PlaceToggleButton isMapMode={true} onClick={toggleMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceMapView;
