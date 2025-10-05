import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables } from "@/types/graphql";
import { cookies } from "next/headers";

export async function getUserServer() {
  const session = (await cookies()).get("session")?.value;

  const res = await executeServerGraphQLQuery<
    GqlCurrentUserServerQuery,
    GqlCurrentUserServerQueryVariables
  >(GET_CURRENT_USER_SERVER_QUERY, {}, session ? { Authorization: `Bearer ${session}` } : {});
  return res.currentUser?.user ?? null;
}

const GET_CURRENT_USER_SERVER_QUERY = `
  query currentUserServer {
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
