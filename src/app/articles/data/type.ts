import { GqlArticleCategory } from "@/types/graphql";
import { OpportunityCard } from "@/app/activities/data/type";

export type TArticleCard = {
  id: string;
  title: string;
  category: GqlArticleCategory;
  introduction: string;

  thumbnail: string;

  publishedAt: string;
};

export type TArticleDetail = TArticleCard & {
  body: string;

  authors: TArticleRelatedUser[];
  relatedUsers: TArticleRelatedUser[];

  hostedOpportunitiesByAuthors: OpportunityCard[];
  relatedArticles: TArticleCard[];
};

export type TArticleRelatedUser = {
  id: string;
  name: string;
  image: string;
  bio: string;
};

export type TAuthorIcon = {
  name: string;
  image: string | null;
};

export type TArticleWithAuthor = TArticleCard & {
  author: TAuthorIcon;
};
