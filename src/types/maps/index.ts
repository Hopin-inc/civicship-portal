import { ContentType } from "../index";

export interface Geo {
  latitude: number;
  longitude: number;
  placeId: string;
  placeImage: string;
  placeName: string;
}

export interface MarkerData {
  position: {
    lat: number;
    lng: number;
  };
  id: string;
  placeImage: string;
  userImage: string;
  contentType: ContentType;
  name: string;
  placeId: string;
  participantCount: number;
}

export interface PlaceData {
  placeId: string;
  title: string;
  address: string;
  participantCount: number;
  description: string;
  image: string;
  bio?: string;
  userId: string;
  activeOpportunityCount?: number;
}

export interface MapComponentProps {
  memberships: Array<{
    node: {
      user: {
        id: string;
        image: string;
        name: string;
        opportunitiesCreatedByMe?: {
          edges: Array<{
            node: {
              id: string;
              publishStatus: string;
            };
          }>;
        };
      };
      bio?: string;
      participationView: {
        participated: {
          geo: Geo[];
          totalParticipatedCount: number;
        };
        hosted: {
          geo: Geo[];
          totalParticipantCount: number;
        };
      };
    };
  }>;
  selectedPlaceId?: string | null;
  onPlaceSelect?: (placeId: string) => void;
}
