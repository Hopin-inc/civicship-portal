"use client";

import React from "react";
import PlaceToggleButton from "../PlaceToggleButton";
import PlaceCardsSheet from "../PlaceCardsSheet";
import { BaseCardInfo } from "@/app/places/data/type";
import MapComponent from "./MapComponent";
import { AnimatePresence, motion } from "framer-motion";

interface PlaceMapViewProps {
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  toggleMode: () => void;
  places: BaseCardInfo[];
}

const PlaceMapView: React.FC<PlaceMapViewProps> = ({
  selectedPlaceId,
  onPlaceSelect,
  toggleMode,
  places,
}) => {
  return (
    <div className="relative h-full w-full">
      <MapComponent
        places={places}
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
            className="fixed bottom-8 left-0 right-0 z-50 mx-4"
          >
            <PlaceCardsSheet
              places={places}
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={onPlaceSelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="toggle-button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-4 z-50"
          >
            <PlaceToggleButton isMapMode={true} onClick={toggleMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceMapView;
