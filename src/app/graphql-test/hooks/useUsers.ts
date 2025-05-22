"use client";

import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_MEMBERSHIP_LIST } from "@/graphql/account/membership/query";

interface User {
  id: string;
  name: string;
}

export const useUsers = () => {
  const client = useApolloClient();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await client.query({
          query: GET_MEMBERSHIP_LIST,
          variables: { first: 50 },
          fetchPolicy: "network-only",
        });
        
        if (data?.memberships?.edges) {
          const userMap = new Map<string, User>();
          
          data.memberships.edges.forEach((edge: any) => {
            const user = edge.node.user;
            if (user && user.id && !userMap.has(user.id)) {
              userMap.set(user.id, {
                id: user.id,
                name: user.name || `User ${user.id}`,
              });
            }
          });
          
          setUsers(Array.from(userMap.values()));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [client]);

  return {
    users,
    isLoading,
    error,
  };
};
