import { GqlArticleCategory } from "@/types/graphql";
import { OpportunityCard } from "@/types/opportunity";

export type ArticleCard = {
  id: string;
  title: string;
  category: GqlArticleCategory
  introduction: string;

  thumbnail: string;

  publishedAt: string;
};

export type ArticleDetail = ArticleCard & {
  body: string;

  authors: ArticleRelatedUser[];
  relatedUsers: ArticleRelatedUser[];

  hostedOpportunitiesByAuthors: OpportunityCard[];
  relatedArticles: ArticleCard[];
}

export type ArticleRelatedUser = {
  id: string;
  name: string;
  image: string;
  bio: string;
}

type AuthorIcon = {
  name: string;
  image: string | null;
}

export type ArticleWithAuthor = ArticleCard & {
  author: AuthorIcon;
};