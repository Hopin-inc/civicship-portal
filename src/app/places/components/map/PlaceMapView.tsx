"use client";

import React, { useRef } from "react";
import PlaceToggleButton from "../ToggleButton";
import PlaceCardsSheet from "./PlaceCardsSheet";
import MapComponent from "./MapComponent";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceCard, IPlacePin } from "@/app/places/data/type";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Initial map center coordinates for Shikoku
const INITIAL_CENTER = { lat: 33.0, lng: 133.5 };
const INITIAL_ZOOM = 8.0;

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
  // Reference to store the Google Map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to clear the selected place and reset map view
  const handleClearSelection = () => {
    // Clear the selected place
    onPlaceSelect("");

    // Reset map to initial position if we have a map reference
    if (mapRef.current) {
      mapRef.current.setZoom(INITIAL_ZOOM);
      mapRef.current.setCenter(INITIAL_CENTER);
    }
  };

  // Function to store the map reference
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <div className="relative h-full w-full">
      {selectedPlaceId && (
        <div className="absolute top-8 left-4 z-50">
          <Button
            onClick={handleClearSelection}
            variant="secondary"
            size="sm"
            className="shadow-md"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
        </div>
      )}

      <MapComponent
        placePins={placePins}
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={onPlaceSelect}
        onMapLoad={handleMapLoad}
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
