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
  "\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n":
    types.CurrentUserDocument,
  "\n  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {\n    opportunity(id: $id, permission: $permission) {\n      id\n      title\n      description\n      body\n      category\n      capacity\n      pointsToEarn\n      feeRequired\n      requireApproval\n      publishStatus\n      image\n      files\n      createdAt\n      updatedAt\n      community {\n        id\n        name\n        image\n      }\n      createdByUser {\n        id\n        name\n        image\n        articlesAboutMe(first: 1) {\n          edges {\n            node {\n              id\n              title\n              introduction\n              thumbnail\n              createdAt\n            }\n          }\n        }\n      }\n      place {\n        id\n        name\n        address\n        latitude\n        longitude\n        city {\n          name\n          state {\n            name\n          }\n        }\n      }\n      slots {\n        edges {\n          node {\n            id\n            startsAt\n            endsAt\n            participations {\n              edges {\n                node {\n                  id\n                  status\n                  user {\n                    id\n                    name\n                    image\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.GetOpportunityDocument,
  "\n  query GetUserWithDetails($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      image\n      bio\n      sysRole\n      urlFacebook\n      urlInstagram\n      urlWebsite\n      urlX\n      urlYoutube\n    }\n  }\n":
    types.GetUserWithDetailsDocument,
  "\n  query GetUserActivities($id: ID!, $articlesFirst: Int, $articlesCursor: String) {\n    user(id: $id) {\n      id\n      articlesAboutMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n      articlesWrittenByMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n    }\n  }\n":
    types.GetUserActivitiesDocument,
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
  source: "\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  query currentUser {\n    currentUser {\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {\n    opportunity(id: $id, permission: $permission) {\n      id\n      title\n      description\n      body\n      category\n      capacity\n      pointsToEarn\n      feeRequired\n      requireApproval\n      publishStatus\n      image\n      files\n      createdAt\n      updatedAt\n      community {\n        id\n        name\n        image\n      }\n      createdByUser {\n        id\n        name\n        image\n        articlesAboutMe(first: 1) {\n          edges {\n            node {\n              id\n              title\n              introduction\n              thumbnail\n              createdAt\n            }\n          }\n        }\n      }\n      place {\n        id\n        name\n        address\n        latitude\n        longitude\n        city {\n          name\n          state {\n            name\n          }\n        }\n      }\n      slots {\n        edges {\n          node {\n            id\n            startsAt\n            endsAt\n            participations {\n              edges {\n                node {\n                  id\n                  status\n                  user {\n                    id\n                    name\n                    image\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {\n    opportunity(id: $id, permission: $permission) {\n      id\n      title\n      description\n      body\n      category\n      capacity\n      pointsToEarn\n      feeRequired\n      requireApproval\n      publishStatus\n      image\n      files\n      createdAt\n      updatedAt\n      community {\n        id\n        name\n        image\n      }\n      createdByUser {\n        id\n        name\n        image\n        articlesAboutMe(first: 1) {\n          edges {\n            node {\n              id\n              title\n              introduction\n              thumbnail\n              createdAt\n            }\n          }\n        }\n      }\n      place {\n        id\n        name\n        address\n        latitude\n        longitude\n        city {\n          name\n          state {\n            name\n          }\n        }\n      }\n      slots {\n        edges {\n          node {\n            id\n            startsAt\n            endsAt\n            participations {\n              edges {\n                node {\n                  id\n                  status\n                  user {\n                    id\n                    name\n                    image\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetUserWithDetails($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      image\n      bio\n      sysRole\n      urlFacebook\n      urlInstagram\n      urlWebsite\n      urlX\n      urlYoutube\n    }\n  }\n",
): (typeof documents)["\n  query GetUserWithDetails($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      image\n      bio\n      sysRole\n      urlFacebook\n      urlInstagram\n      urlWebsite\n      urlX\n      urlYoutube\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetUserActivities($id: ID!, $articlesFirst: Int, $articlesCursor: String) {\n    user(id: $id) {\n      id\n      articlesAboutMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n      articlesWrittenByMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetUserActivities($id: ID!, $articlesFirst: Int, $articlesCursor: String) {\n    user(id: $id) {\n      id\n      articlesAboutMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n      articlesWrittenByMe(first: $articlesFirst, cursor: $articlesCursor) {\n        edges {\n          node {\n            id\n          }\n          cursor\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
