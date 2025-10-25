import { headers } from "next/headers";
import { getEnvCommunityId, normalizeCommunityId, type CommunityId } from "./runtime-auth";

export function getCommunityIdFromRequest(): CommunityId {
  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";
  const envCommunityId = getEnvCommunityId();
  return normalizeCommunityId(envCommunityId, host);
}
