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

  authors: User[];
  relatedUsers: User[];

  hostedOpportunitiesByAuthors: OpportunityCard[];
  relatedArticles: ArticleCard[];
}

type User = {
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