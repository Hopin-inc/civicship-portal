import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserQuery, GqlCurrentUserQueryVariables } from "@/types/graphql";

export async function getCurrentUserServer() {
  const res = await executeServerGraphQLQuery<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>(
    GET_CURRENT_USER_SERVER_QUERY,
    {},
  );
  console.log(res);
  return res.currentUser ?? null;
}

const GET_CURRENT_USER_SERVER_QUERY = `
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          status
          role
          user {
            id
            name
          }
          community {
            id
            name
          }
          role
          status
        }
      }
    }
  }
`;
