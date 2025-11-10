import { OpportunityPlace } from "@/components/domains/opportunities/types";
import AddressMap from "@/components/shared/AddressMap";

export const PlaceSection = ({ place }: { place: OpportunityPlace }) => {
    if (!place) return null;
  
    return (
      <section className="pt-6 pb-8 mt-0">
        <h2 className="text-display-md text-foreground mb-4">集合場所</h2>
        <div>
          <p className="text-body-md font-bold">{place.name}</p>
          <p className="text-body-sm text-caption mb-2">{place.address}</p>
          <AddressMap
            address={place.address}
            markerTitle={place.name || "集合場所"}
            height={300}
            latitude={place.latitude}
            longitude={place.longitude}
            placeId={place.id}
          />
          {place?.description && (
            <p className="text-body-sm text-caption mt-4">{place.description}</p>
          )}
        </div>
      </section>
    );
  };