"use client";

import { ApolloProvider as ApolloClientProvider } from "@apollo/client";
import { apolloClient, createApolloClient } from "@/lib/apollo";
import { useCommunityContext } from "@/contexts/CommunityContext";
import { getAuthForCommunity, getEnvCommunityId } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";
import { useMemo } from "react";

const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  const { communityId } = useCommunityContext();

  const client = useMemo(() => {
    if (getEnvCommunityId() || !communityId) {
      return apolloClient;
    }

    const authConfig = getAuthForCommunity(communityId as CommunityId);
    return createApolloClient({
      communityId,
      tenantId: authConfig.tenantId,
      apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    });
  }, [communityId]);

  return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>;
};

export default ApolloProvider;
