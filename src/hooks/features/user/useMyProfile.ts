import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/hooks";
import { useGetUserWithDetailsAndPortfoliosQuery } from "@/types/graphql";
import { useEffect, useMemo } from "react";
import { presenterAppUserSelf } from "@/presenters";

export const useMyProfile = () => {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id;
  const { setIsLoading } = useLoading();

  const result = useGetUserWithDetailsAndPortfoliosQuery({
    variables: { id: currentUserId ?? '' },
    skip: !currentUserId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setIsLoading(result.loading);
  }, [result.loading, setIsLoading]);

  const userData = useMemo(() => {
    const user = result.data?.user;
    return user ? presenterAppUserSelf(user) : null;
  }, [result.data]);

  return {
    userData,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
