import { gql } from "@apollo/client";
import { VOTE_TOPIC_FRAGMENT } from "./fragment";

export const CREATE_VOTE_TOPIC = gql`
  mutation CreateVoteTopic(
    $input: VoteTopicCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    voteTopicCreate(input: $input, permission: $permission) {
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
  mutation DeleteVoteTopic($id: ID!, $permission: CheckCommunityPermissionInput!) {
    voteTopicDelete(id: $id, permission: $permission) {
      ... on VoteTopicDeleteSuccess {
        voteTopicId
      }
    }
  }
`;
