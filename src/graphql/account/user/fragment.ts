import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    image
    bio
    currentPrefecture
    phoneNumber

    urlFacebook
    urlInstagram
    urlX
  }
`;

export const USER_PORTFOLIO_FRAGMENT = gql`
  fragment UserPortfolioFields on Portfolio {
    id
    title
    thumbnailUrl
    source
    category
    date
    reservationStatus
    place {
      ...PlaceFields
    }
    participants {
      ...UserFields
    }
  }
`;
