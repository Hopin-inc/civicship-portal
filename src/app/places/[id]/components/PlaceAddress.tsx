"use client";
import { BaseDetail } from "@/app/places/data/type";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const PlaceAddress = ({ detail }: { detail: BaseDetail }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <h3 className="text-display-sm">主な拠点</h3>
      <div>
        <p className="text-body-md font-bold">{detail.name}</p>
        <p className="text-body-sm text-caption mb-2">{detail.address}</p>
        {!isLoaded ? (
          <div className="w-full h-[300px] bg-muted flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "250px", borderRadius: "8px" }}
            center={{ lat: detail.latitude, lng: detail.longitude }}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              disableDefaultUI: true,
              scrollwheel: true,
              zoomControl: true,
            }}
          >
            <Marker position={{ lat: detail.latitude, lng: detail.longitude }} />
          </GoogleMap>
        )}
      </div>
    </div>
  );
};
