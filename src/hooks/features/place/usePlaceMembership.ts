import { useQuery } from '@apollo/client';
import { GET_SINGLE_MEMBERSHIP } from '@/graphql/queries/membership';
import { Opportunity } from '@/types';

export type TransformedOpportunity = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  image?: string;
  images: Array<{ url: string; caption: string }>;
  slots?: {
    edges?: Array<{
      node?: {
        participations?: {
          edges?: Array<{
            node?: {
              user?: {
                id: string;
                name: string;
                image?: string | null;
              } | null;
            } | null;
          }> | null;
        } | null;
      } | null;
    }> | null;
  } | null;
};

export const usePlaceMembership = (communityId: string, userId: string) => {
  const { data, loading, error } = useQuery(GET_SINGLE_MEMBERSHIP, {
    variables: {
      communityId,
      userId,
    },
  });

  const transformOpportunity = (opp: any): TransformedOpportunity => {
    return {
      id: opp.id,
      title: opp.title,
      description: opp.description,
      startsAt: opp.createdAt,
      image: opp.images?.[0],
      images: (opp.images || []).map((url: string) => ({
        url,
        caption: opp.title,
      })),
      slots: opp.slots,
    };
  };

  const transformedOpportunities = data?.membership?.user?.opportunitiesCreatedByMe?.edges
    ?.map((edge: any) => edge?.node)
    .filter(Boolean)
    .map(transformOpportunity);

  const featuredArticle = data?.membership?.user?.articlesAboutMe?.edges?.[0]?.node;

  return {
    membership: data?.membership,
    opportunities: transformedOpportunities || [],
    featuredArticle: featuredArticle ? {
      id: featuredArticle.id,
      title: featuredArticle.title,
      introduction: featuredArticle.introduction,
      thumbnail: featuredArticle.thumbnail,
      createdAt: featuredArticle.createdAt,
    } : null,
    loading,
    error,
  };
};  