import { gql } from "@apollo/client";
import { VOTE_TOPIC_FRAGMENT } from "./fragment";

export const CREATE_VOTE_TOPIC = gql`
  mutation CreateVoteTopic($input: VoteTopicCreateInput!) {
    voteTopicCreate(input: $input) {
      ... on VoteTopicCreateSuccess {
        voteTopic {
          ...VoteTopicFields
        }
      }
    }
  }
  ${VOTE_TOPIC_FRAGMENT}
`;

export const DELETE_VOTE_TOPIC = gql`
  mutation DeleteVoteTopic($id: ID!) {
    voteTopicDelete(id: $id) {
      ... on VoteTopicDeleteSuccess {
        voteTopicId
      }
    }
  }
`;

export const VOTE_CAST = gql`
  mutation VoteCast($input: VoteCastInput!) {
    voteCast(input: $input) {
      ... on VoteCastSuccess {
        ballot {
          id
          option {
            id
            label
          }
          power
          createdAt
        }
      }
    }
  }
`;

export const UPDATE_VOTE_TOPIC = gql`
  mutation UpdateVoteTopic($id: ID!, $input: VoteTopicUpdateInput!) {
    voteTopicUpdate(id: $id, input: $input) {
      ... on VoteTopicUpdateSuccess {
        voteTopic {
          ...VoteTopicFields
        }
      }
    }
  }
  ${VOTE_TOPIC_FRAGMENT}
`;
