"use client";

import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_MEMBERSHIP_LIST } from "@/graphql/account/membership/query";

interface User {
  id: string;
  name: string;
}

export const useUsersByCommunity = (communityId: string) => {
  const client = useApolloClient();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!communityId) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data } = await client.query({
          query: GET_MEMBERSHIP_LIST,
          variables: { 
            first: 50,
            filter: { communityId }
          },
          fetchPolicy: "network-only",
        });
        
        if (data?.memberships?.edges) {
          const userList = data.memberships.edges
            .filter((edge: any) => edge.node.user)
            .map((edge: any) => ({
              id: edge.node.user.id,
              name: edge.node.user.name || `User ${edge.node.user.id}`,
            }));
          
          setUsers(userList);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [client, communityId]);

  return {
    users,
    isLoading,
    error,
  };
};
