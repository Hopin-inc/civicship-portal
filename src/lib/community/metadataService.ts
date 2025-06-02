import { apolloClient } from "@/lib/apollo";
import { GET_COMMUNITY_METADATA } from "@/graphql/account/community/query";
import { COMMUNITY_ID } from "@/utils";

export interface CommunityMetadata {
  id: string;
  name: string;
  description: string;
  siteUrl: string;
  ogImageUrl: string;
  faviconUrl?: string;
}

export const getCommunityMetadata = async (communityId: string = COMMUNITY_ID): Promise<CommunityMetadata> => {
  try {
    const { data } = await apolloClient.query({
      query: GET_COMMUNITY_METADATA,
      variables: { id: communityId }
    });
    
    return {
      id: data.community.id,
      name: data.community.name,
      description: data.community.description || "四国にふれる。わたし、ふるえる。",
      siteUrl: data.community.siteUrl || "https://www.neo88.app",
      ogImageUrl: data.community.ogImageUrl || "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
      faviconUrl: data.community.faviconUrl
    };
  } catch (error) {
    console.warn(`Failed to fetch community metadata for ${communityId}, using fallback values:`, error);
    
    return {
      id: "neo88",
      name: "NEO四国88祭",
      description: "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
      siteUrl: "https://www.neo88.app",
      ogImageUrl: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg"
    };
  }
};

export const getCommunityName = (communityId: string = COMMUNITY_ID): string => {
  const communityNames: Record<string, string> = {
    "neo88": "NEO四国88祭"
  };
  
  return communityNames[communityId] || communityId;
};
