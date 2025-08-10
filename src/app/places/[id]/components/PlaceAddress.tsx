"use client";
import { IPlaceDetail } from "@/app/places/data/type";
import AddressMap from "@/components/shared/DynamicAddressMap";

const PlaceAddress = ({ detail }: { detail: IPlaceDetail }) => {
  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <h3 className="text-display-sm">主な拠点</h3>
      <div>
        <p className="text-body-md font-bold">{detail.name}</p>
        <p className="text-body-sm text-caption mb-2">{detail.address}</p>
        <AddressMap address={detail.address} markerTitle={detail.name} height={250} latitude={detail.latitude} longitude={detail.longitude} placeId={detail.id}/>
      </div>
    </div>
  );
};

export default PlaceAddress;
