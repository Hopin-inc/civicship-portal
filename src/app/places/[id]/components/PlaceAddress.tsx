"use client";
import { BaseDetail } from "@/app/places/data/type";

const PlaceAddress = ({ detail }: { detail: BaseDetail }) => {
  const mapUrl = detail.latitude && detail.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${detail.latitude},${detail.longitude}`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(detail.address)}`;

  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <h3 className="text-display-sm">主な拠点</h3>
      <div>
        <p className="text-body-md font-bold">{detail.name}</p>
        <p className="text-body-sm text-caption mb-2">{detail.address}</p>
        <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
            lang={"JP"}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceAddress;
