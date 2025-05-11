import { useGetSingleMembershipQuery } from "@/types/graphql";
import { presenterArticleWithAuthor } from "@/presenters/article";
import { presenterActivityCard } from "@/presenters/opportunity";

export const usePlaceMembership = (communityId: string, userId: string) => {
  const { data, loading, error } = useGetSingleMembershipQuery({
    variables: { communityId, userId },
  });

  const membership = data?.membership;
  const user = membership?.user;

  const opportunities = (user?.opportunitiesCreatedByMe || []).map(presenterActivityCard);

  const featuredArticle = user?.articlesAboutMe?.[0]
    ? presenterArticleWithAuthor(user.articlesAboutMe[0])
    : null;

  return {
    membership,
    opportunities,
    featuredArticle,
    loading,
    error,
  };
};
