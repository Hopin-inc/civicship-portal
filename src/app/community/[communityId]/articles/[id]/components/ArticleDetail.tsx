"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import CategoryBadge from "../../components/CategoryBadge";
import ArticleRecommendations from "./ArticleRecommendations";
import { TArticleDetail, TArticleWithAuthor } from "@/app/community/[communityId]/articles/data/type";
import { ActivitiesCarouselSection } from "./ActivitiesCarouselSection";
import { Calendar } from "lucide-react";

type ArticleDetailProps = {
  article: TArticleDetail;
  recommendedArticles?: TArticleWithAuthor[];
};

const ArticleDetail = ({ article, recommendedArticles }: ArticleDetailProps) => {
  return (
    <div className="max-w-[375px] mx-auto pb-32">
      <ArticleHeader
        title={article.title}
        thumbnail={article.thumbnail}
        category={article.category}
        publishedAt={article.publishedAt}
      />
      {/*//TODO 作成者を追加*/}
      <ArticleBody markdown={article.body} />
      <ActivitiesCarouselSection
        title="おすすめの体験"
        opportunities={article.hostedOpportunitiesByAuthors}
      />
      {recommendedArticles && recommendedArticles.length > 0 && (
        <ArticleRecommendations title="関連する記事" articles={recommendedArticles} />
      )}
    </div>
  );
};

const ArticleHeader = ({
  title,
  thumbnail,
  category,
  publishedAt,
}: Pick<TArticleDetail, "title" | "thumbnail" | "category" | "publishedAt">) => {
  return (
    <div className="bg-background relative rounded-[8px]">
      <div className="relative w-full h-[210px]">
        <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <div className="relative -mt-8 bg-background rounded-2xl">
        <div className="px-4 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-x-1">
            <CategoryBadge category={category} />
          </div>
          <h1 className="text-display-lg">{title}</h1>
          <div className="text-caption flex items-center gap-x-1">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{format(new Date(publishedAt), "yyyy/M/d", { locale: ja })}</span>
          </div>
        </div>
        <div className="h-px bg-muted" />
      </div>
    </div>
  );
};

const ArticleBody = ({ markdown }: { markdown: string }) => {
  return (
    <article className="px-4 py-6">
      <MarkdownContent>{markdown}</MarkdownContent>
    </article>
  );
};

export default ArticleDetail;
