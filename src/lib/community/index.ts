// Community Store
export { useCommunityStore } from "./community-store";

// Client-side utility (use in Client Components)
export { getCommunityIdClient } from "./get-community-id-client";

// Server-side utilities (use in Server Components / API routes)
// Import directly from "./get-community-id-server" to avoid webpack issues
// export { getCommunityIdFromHeader, getCommunityIdFromHeaderOptional } from "./get-community-id-server";
