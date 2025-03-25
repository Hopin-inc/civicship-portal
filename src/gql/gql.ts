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
