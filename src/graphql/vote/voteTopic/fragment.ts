import { gql } from "@apollo/client";

export const VOTE_TOPIC_FRAGMENT = gql`
  fragment VoteTopicFields on VoteTopic {
    id
    title
    description
    startsAt
    endsAt
    phase
    createdAt
    updatedAt
    options {
      id
      label
      orderIndex
      voteCount
      totalPower
    }
    gate {
      id
      type
      requiredRole
      nftToken {
        id
        name
      }
    }
    powerPolicy {
      id
      type
      nftToken {
        id
        name
      }
    }
  }
`;
