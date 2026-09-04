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

export const VOTE_TOPIC_USER_FRAGMENT = gql`
  fragment VoteTopicUserFields on VoteTopic {
    ...VoteTopicFields
    myBallot {
      id
      option {
        id
        label
      }
      power
      createdAt
    }
    myEligibility {
      eligible
      currentPower
      reason
    }
  }
  ${VOTE_TOPIC_FRAGMENT}
`;
