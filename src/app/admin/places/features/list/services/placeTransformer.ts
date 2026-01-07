/**
 * GraphQLレスポンスをPlaceDataに変換
 */

import { PlaceData } from "../../shared/types/place";

/**
 * GraphQLのPlaceノードをPlaceDataに変換
 */
export const transformPlaceFromGraphQL = (node: any): PlaceData => {
  return {
    id: node.id,
    name: node.name,
    address: node.address,
    latitude: Number(node.latitude),
    longitude: Number(node.longitude),
    cityCode: node.city?.code || "",
    cityName: node.city?.name,
    googlePlaceId: node.googlePlaceId || undefined,
    isManual: node.isManual || false,
    mapLocation: node.mapLocation,
    image: node.image || undefined,
    opportunityCount: node.currentPublicOpportunityCount || 0,
  };
};
