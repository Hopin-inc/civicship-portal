import {
  useGetUserProfileQuery,
  useGetUserWithDetailsAndPortfoliosQuery,
} from '@/types/graphql';

export type UnifiedUserProfileQueryResult =
  | ReturnType<typeof useGetUserProfileQuery>
  | ReturnType<typeof useGetUserWithDetailsAndPortfoliosQuery>;

export const useUserProfileQuery = (
  userId?: string,
  authUserId?: string
): UnifiedUserProfileQueryResult => {
  const targetId = userId || authUserId;
  const isMe = !userId || userId === authUserId;

  const commonOptions = {
    variables: { id: targetId ?? '' },
    skip: !targetId,
    fetchPolicy: 'cache-and-network' as const,
  };

  const resultSelf = useGetUserWithDetailsAndPortfoliosQuery({
    ...commonOptions,
    skip: !isMe || !targetId,
  });

  const resultOther = useGetUserProfileQuery({
    ...commonOptions,
    skip: isMe || !targetId,
  });

  return isMe ? resultSelf : resultOther;

};
