import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables } from "@/types/graphql";
import { cookies } from "next/headers";

export async function getUserServer(): Promise<{
  user: NonNullable<GqlCurrentUserServerQuery["currentUser"]>["user"] | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
}> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  const lineAuthenticated = cookieStore.get("line_authenticated")?.value === "true";
  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

  if (!lineAuthenticated) {
    return { user: null, lineAuthenticated: false, phoneAuthenticated: false };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(GET_CURRENT_USER_SERVER_QUERY, {}, session ? { Authorization: `Bearer ${session}` } : {});
    return {
      user: res.currentUser?.user ?? null,
      lineAuthenticated,
      phoneAuthenticated,
    };
  } catch (error) {
    return { user: null, lineAuthenticated, phoneAuthenticated };
  }
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
