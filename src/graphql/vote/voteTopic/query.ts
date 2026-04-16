import { gql } from "@apollo/client";

/**
 * 投票一覧（admin）向けの軽量 fragment。
 * 詳細ページでは別途 `VOTE_TOPIC_FRAGMENT` を使う。
 */
export const VOTE_TOPIC_LIST_ITEM_FRAGMENT = gql`
  fragment VoteTopicListItemFields on VoteTopic {
    id
    title
    startsAt
    endsAt
    phase
    options {
      id
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

export const GET_VOTE_TOPICS = gql`
  query GetVoteTopics($communityId: ID!, $cursor: String, $first: Int) {
    voteTopics(communityId: $communityId, cursor: $cursor, first: $first) {
      edges {
        cursor
        node {
          ...VoteTopicListItemFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${VOTE_TOPIC_LIST_ITEM_FRAGMENT}
`;
