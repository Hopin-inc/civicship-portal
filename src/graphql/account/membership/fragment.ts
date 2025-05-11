import { gql } from "@apollo/client";

export const MEMBERSHIP_FRAGMENT = gql`
  fragment MembershipFields on Membership {
    headline
    bio

    role
    status
    reason
  }
`;

export const HOSTED_GEO_FRAGMENT = gql`
  fragment HostedGeoFields on MembershipHostedMetrics {
    totalParticipantCount
    geo {
      placeId
      placeName
      placeImage
      latitude
      longitude
      address
    }
  }
`;
