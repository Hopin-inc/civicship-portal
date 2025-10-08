import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";

export async function fetchProfileServer(): Promise<GqlUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  if (!hasSession) {
    return null;
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(FETCH_PROFILE_SERVER_QUERY, {}, { Authorization: `Bearer ${session}` });

    return res.currentUser?.user ?? null;
  } catch (error) {
    logger.error("⚠️ Failed to fetch user (SSR flexible):", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return null;
  }
}

const FETCH_PROFILE_SERVER_QUERY = `
  query fetchProfileServer {
    currentUser {
      user {
        id
        name
        image
        bio
        currentPrefecture
        phoneNumber
        urlFacebook
        urlInstagram
        urlX

        portfolios (first: 10) {}
          id
          title
          thumbnailUrl
          source
          category
          date
          reservationStatus
          evaluationStatus
          place {
            id
            name
          }
          participants {
            id
            image
          }
        }

        nftInstances {
          totalCount
          edges {
            node {
              id
              instanceId
              name
              imageUrl
              createdAt
            }
          }
        }

        wallets {
          id
          type
          currentPointView {
            currentPoint
          }
          community {
            id
          }
        }

        opportunitiesCreatedByMe {
          id
          title
          community {
            id
            name
          }
          place {
            id
            name
          }
        }
      }
    }
  }
`;
