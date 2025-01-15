/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n":
    types.CreateUserDocument,
  "\n  mutation deleteUser {\n    deleteUser {\n      user {\n        id\n      }\n    }\n  }\n":
    types.DeleteUserDocument,
  "\n  mutation opportunityCreate($input: OpportunityCreateInput!) {\n    opportunityCreate(input: $input) {\n      ...on OpportunityCreateSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.OpportunityCreateDocument,
  "\n  mutation opportunityEditContent($id: ID!, $input: OpportunityEditContentInput!) {\n    opportunityEditContent(id: $id, input: $input) {\n      ...on OpportunityEditContentSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.OpportunityEditContentDocument,
  "\n  mutation opportunityDelete($id: ID!) {\n    opportunityDelete(id: $id) {\n      ...on OpportunityDeleteSuccess {\n        opportunityId\n      }\n    }\n  }\n":
    types.OpportunityDeleteDocument,
  "\n    mutation participationInvite($id: ID!, $input: ParticipationInviteInput!) {\n        participationInvite(id: $id, input: $input) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationInviteDocument,
  "\n    mutation participationCancelInvitation($id: ID!) {\n        participationCancelInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationCancelInvitationDocument,
  "\n    mutation participationApproveInvitation($id: ID!) {\n        participationApproveInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationApproveInvitationDocument,
  "\n    mutation participationDenyInvitation($id: ID!) {\n        participationDenyInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationDenyInvitationDocument,
  "\n    mutation participationApply($input: ParticipationApplyInput!) {\n        participationApply(input: $input) {\n            ...on ParticipationApplySuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationApplyDocument,
  "\n    mutation participationCancelApplication($id: ID!) {\n        participationCancelApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationCancelApplicationDocument,
  "\n    mutation participationApproveApplication($id: ID!) {\n        participationApproveApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationApproveApplicationDocument,
  "\n    mutation participationDenyApplication($id: ID!) {\n        participationDenyApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationDenyApplicationDocument,
  "\n    mutation participationApprovePerformance($id: ID!) {\n        participationApprovePerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationApprovePerformanceDocument,
  "\n    mutation participationDenyPerformance($id: ID!) {\n        participationDenyPerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n":
    types.ParticipationDenyPerformanceDocument,
  "\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n":
    types.CurrentUserDocument,
  "\n  query opportunities($filter: OpportunityFilterInput, $sort: OpportunitySortInput, $cursor: String, $first: Int) {\n      opportunities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {\n          edges {\n              node {\n                  id\n                  title\n                  description\n                  category\n                  requireApproval\n                  pointsPerParticipation\n                  publishStatus\n                  startsAt\n                  endsAt\n                  createdBy {\n                      id\n                      name\n                  }\n                  community {\n                      id\n                      name\n                      city {\n                          code\n                          name\n                          state {\n                              code\n                              name\n                          }\n                      }\n                      wallets {\n                          id\n                          user {\n                              id\n                              name\n                          }\n                          currentPointView {\n                              walletId\n                              currentPoint\n                          }\n                      }\n                  }\n                  city {\n                      code\n                      name\n                      state {\n                          code\n                          name\n                      }\n                  }\n                  participations {\n                      id\n                      user {\n                          id\n                          name\n                      }\n                  }\n              }\n          }\n          pageInfo {\n              endCursor\n              hasNextPage\n          }\n      }\n  }\n":
    types.OpportunitiesDocument,
  "\n    query opportunity($id: ID!) {\n        opportunity(id: $id) {\n            id\n            title\n            description\n            category\n            requireApproval\n            pointsPerParticipation\n            publishStatus\n            startsAt\n            endsAt\n            createdBy {\n                id\n                name\n            }\n            community {\n                id\n                name\n                city {\n                    code\n                    name\n                    state {\n                        code\n                        name\n                    }\n                }\n                wallets {\n                    id\n                    user {\n                        id\n                        name\n                    }\n                    currentPointView {\n                        walletId\n                        currentPoint\n                    }\n                }\n            }\n            city {\n                code\n                name\n                state {\n                    code\n                    name\n                }\n            }\n            participations {\n                id\n                user {\n                    id\n                    name\n                }\n            }\n        }\n    }\n":
    types.OpportunityDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation deleteUser {\n    deleteUser {\n      user {\n        id\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation deleteUser {\n    deleteUser {\n      user {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation opportunityCreate($input: OpportunityCreateInput!) {\n    opportunityCreate(input: $input) {\n      ...on OpportunityCreateSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation opportunityCreate($input: OpportunityCreateInput!) {\n    opportunityCreate(input: $input) {\n      ...on OpportunityCreateSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation opportunityEditContent($id: ID!, $input: OpportunityEditContentInput!) {\n    opportunityEditContent(id: $id, input: $input) {\n      ...on OpportunityEditContentSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation opportunityEditContent($id: ID!, $input: OpportunityEditContentInput!) {\n    opportunityEditContent(id: $id, input: $input) {\n      ...on OpportunityEditContentSuccess {\n        opportunity {\n          id\n          title\n          description\n          category\n          startsAt\n          endsAt\n          pointsPerParticipation\n          publishStatus\n          community {\n            id\n            name\n          }\n          city {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation opportunityDelete($id: ID!) {\n    opportunityDelete(id: $id) {\n      ...on OpportunityDeleteSuccess {\n        opportunityId\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation opportunityDelete($id: ID!) {\n    opportunityDelete(id: $id) {\n      ...on OpportunityDeleteSuccess {\n        opportunityId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationInvite($id: ID!, $input: ParticipationInviteInput!) {\n        participationInvite(id: $id, input: $input) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationInvite($id: ID!, $input: ParticipationInviteInput!) {\n        participationInvite(id: $id, input: $input) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationCancelInvitation($id: ID!) {\n        participationCancelInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationCancelInvitation($id: ID!) {\n        participationCancelInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationApproveInvitation($id: ID!) {\n        participationApproveInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationApproveInvitation($id: ID!) {\n        participationApproveInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationDenyInvitation($id: ID!) {\n        participationDenyInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationDenyInvitation($id: ID!) {\n        participationDenyInvitation(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationApply($input: ParticipationApplyInput!) {\n        participationApply(input: $input) {\n            ...on ParticipationApplySuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationApply($input: ParticipationApplyInput!) {\n        participationApply(input: $input) {\n            ...on ParticipationApplySuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationCancelApplication($id: ID!) {\n        participationCancelApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationCancelApplication($id: ID!) {\n        participationCancelApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationApproveApplication($id: ID!) {\n        participationApproveApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationApproveApplication($id: ID!) {\n        participationApproveApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationDenyApplication($id: ID!) {\n        participationDenyApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationDenyApplication($id: ID!) {\n        participationDenyApplication(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationApprovePerformance($id: ID!) {\n        participationApprovePerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationApprovePerformance($id: ID!) {\n        participationApprovePerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    mutation participationDenyPerformance($id: ID!) {\n        participationDenyPerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    mutation participationDenyPerformance($id: ID!) {\n        participationDenyPerformance(id: $id) {\n            ...on ParticipationSetStatusSuccess {\n                participation {\n                    id\n                    status\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query opportunities($filter: OpportunityFilterInput, $sort: OpportunitySortInput, $cursor: String, $first: Int) {\n      opportunities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {\n          edges {\n              node {\n                  id\n                  title\n                  description\n                  category\n                  requireApproval\n                  pointsPerParticipation\n                  publishStatus\n                  startsAt\n                  endsAt\n                  createdBy {\n                      id\n                      name\n                  }\n                  community {\n                      id\n                      name\n                      city {\n                          code\n                          name\n                          state {\n                              code\n                              name\n                          }\n                      }\n                      wallets {\n                          id\n                          user {\n                              id\n                              name\n                          }\n                          currentPointView {\n                              walletId\n                              currentPoint\n                          }\n                      }\n                  }\n                  city {\n                      code\n                      name\n                      state {\n                          code\n                          name\n                      }\n                  }\n                  participations {\n                      id\n                      user {\n                          id\n                          name\n                      }\n                  }\n              }\n          }\n          pageInfo {\n              endCursor\n              hasNextPage\n          }\n      }\n  }\n",
): (typeof documents)["\n  query opportunities($filter: OpportunityFilterInput, $sort: OpportunitySortInput, $cursor: String, $first: Int) {\n      opportunities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {\n          edges {\n              node {\n                  id\n                  title\n                  description\n                  category\n                  requireApproval\n                  pointsPerParticipation\n                  publishStatus\n                  startsAt\n                  endsAt\n                  createdBy {\n                      id\n                      name\n                  }\n                  community {\n                      id\n                      name\n                      city {\n                          code\n                          name\n                          state {\n                              code\n                              name\n                          }\n                      }\n                      wallets {\n                          id\n                          user {\n                              id\n                              name\n                          }\n                          currentPointView {\n                              walletId\n                              currentPoint\n                          }\n                      }\n                  }\n                  city {\n                      code\n                      name\n                      state {\n                          code\n                          name\n                      }\n                  }\n                  participations {\n                      id\n                      user {\n                          id\n                          name\n                      }\n                  }\n              }\n          }\n          pageInfo {\n              endCursor\n              hasNextPage\n          }\n      }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    query opportunity($id: ID!) {\n        opportunity(id: $id) {\n            id\n            title\n            description\n            category\n            requireApproval\n            pointsPerParticipation\n            publishStatus\n            startsAt\n            endsAt\n            createdBy {\n                id\n                name\n            }\n            community {\n                id\n                name\n                city {\n                    code\n                    name\n                    state {\n                        code\n                        name\n                    }\n                }\n                wallets {\n                    id\n                    user {\n                        id\n                        name\n                    }\n                    currentPointView {\n                        walletId\n                        currentPoint\n                    }\n                }\n            }\n            city {\n                code\n                name\n                state {\n                    code\n                    name\n                }\n            }\n            participations {\n                id\n                user {\n                    id\n                    name\n                }\n            }\n        }\n    }\n",
): (typeof documents)["\n    query opportunity($id: ID!) {\n        opportunity(id: $id) {\n            id\n            title\n            description\n            category\n            requireApproval\n            pointsPerParticipation\n            publishStatus\n            startsAt\n            endsAt\n            createdBy {\n                id\n                name\n            }\n            community {\n                id\n                name\n                city {\n                    code\n                    name\n                    state {\n                        code\n                        name\n                    }\n                }\n                wallets {\n                    id\n                    user {\n                        id\n                        name\n                    }\n                    currentPointView {\n                        walletId\n                        currentPoint\n                    }\n                }\n            }\n            city {\n                code\n                name\n                state {\n                    code\n                    name\n                }\n            }\n            participations {\n                id\n                user {\n                    id\n                    name\n                }\n            }\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
