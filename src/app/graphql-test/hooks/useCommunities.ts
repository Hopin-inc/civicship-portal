"use client";

import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_COMMUNITIES } from "@/graphql/account/community/query";

interface Community {
  id: string;
  name: string;
}

export const useCommunities = () => {
  const client = useApolloClient();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await client.query({
          query: GET_COMMUNITIES,
          fetchPolicy: "network-only",
        });
        
        if (data?.communities?.edges) {
          const communityList = data.communities.edges.map((edge: any) => ({
            id: edge.node.id,
            name: edge.node.name,
          }));
          setCommunities(communityList);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch communities"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [client]);

  return {
    communities,
    isLoading,
    error,
  };
};
