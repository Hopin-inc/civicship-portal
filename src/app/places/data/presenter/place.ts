import { GqlPlace, Maybe } from "@/types/graphql";
import { OpportunityPlace } from "@/app/activities/data/type";

export function presenterPlace(place?: Maybe<GqlPlace>): OpportunityPlace {
  return {
    id: place?.id || "",
    name: place?.name || "",
    description: "",
    address: place?.address || "",
    latitude: place?.latitude ?? undefined,
    longitude: place?.longitude ?? undefined,
  };
}
