import { gql } from "@apollo/client";

export const PARTICIPATION_FRAGMENT = gql`
  fragment ParticipationFields on Participation {
    id
    status
    reason
    
    images
    description
  }
`;
