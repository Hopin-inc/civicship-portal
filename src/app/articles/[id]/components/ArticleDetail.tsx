"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import CategoryBadge from "../../components/CategoryBadge";
import { ArticleRecommendations } from "./ArticleRecommendations";
import { TArticleDetail, TArticleWithAuthor } from "@/app/articles/data/type";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";

type ArticleDetailProps = {
  article: TArticleDetail;
  recommendedArticles?: TArticleWithAuthor[];
};

const ArticleDetail = ({ article, recommendedArticles }: ArticleDetailProps) => {
  return (
    <div className="max-w-[375px] mx-auto pt-10 pb-32 px-2">
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
        <ArticleRecommendations title="おすすめの記事" articles={recommendedArticles} />
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
        <div className="absolute top-4 left-4">
          <CategoryBadge category={category} />
        </div>
      </div>

      <div className="relative -mt-8 bg-background rounded-2xl shadow-md mx-4">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div className="text-muted-foreground text-sm">
            公開: {format(new Date(publishedAt), "yyyy年M月d日", { locale: ja })}
          </div>
        </div>

        <div className="h-px bg-muted" />
      </div>
    </div>
  );
};

const ArticleBody = ({ markdown }: { markdown: string }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    convertMarkdownToHtml(markdown)
      .then(setHtml)
      .catch((error) => console.error("Error converting markdown:", error));
  }, [markdown]);

  return (
    <article className="px-4 py-6">
      <div
        className="prose prose-slate max-w-none
          prose-h1:text-2xl prose-h1:border-l-4 prose-h1:border-[#4361EE] prose-h1:pl-4 prose-h1:py-2 prose-h1:mb-6
          prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-[#4361EE] prose-h2:pl-4 prose-h2:py-2 prose-h2:mb-6
          prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground prose-p:mb-4
          prose-a:text-primary
          prose-strong:text-foreground
          prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-input prose-blockquote:pl-4 prose-blockquote:italic"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
};

export default ArticleDetail;
