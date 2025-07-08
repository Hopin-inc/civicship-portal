import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    image
    bio
    currentPrefecture
    phoneNumber
    nftWallet {
      id
      walletAddress
    }
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
    evaluationStatus
    place {
      ...PlaceFields
    }
    participants {
      ...UserFields
    }
  }
`;
