"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import CategoryBadge from "../../components/CategoryBadge";
import ArticleRecommendations from "./ArticleRecommendations";
import { TArticleDetail, TArticleWithAuthor } from "@/app/articles/data/type";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
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
      prose-h1:text-2xl prose-h1:py-2 prose-h1:mb-6
      prose-h2:text-xl prose-h2:py-2 prose-h2:mb-6
      prose-h3:text-lg prose-h3:font-bold prose-h3:py-2 prose-h3:mb-4
      prose-h4:text-base prose-h4:font-semibold prose-h4:py-2 prose-h4:mb-4
      prose-h5:text-sm prose-h5:font-semibold prose-h5:py-2 prose-h5:mb-4
      prose-strong:text-foreground prose-b:text-foreground prose-em:text-foreground prose-i:text-foreground prose-a:text-primary prose-a:hover:text-primary-hover
      prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
      prose-ul:space-y-3 prose-ul:list-disc prose-ul:px-0 prose-ul:ml-0
      prose-ol:space-y-3 prose-ol:list-decimal prose-ol:px-0 prose-ol:ml-6
      prose-blockquote:border-l-4 prose-blockquote:border-input prose-blockquote:pl-4 prose-blockquote:italic
      prose-pre:bg-gray-800 prose-pre:text-white prose-pre:py-4 prose-pre:px-6 prose-pre:rounded-lg prose-pre:my-4
      prose-code:bg-gray-600 prose-code:text-white prose-code:px-1 prose-code:rounded-sm
      prose-table:table-auto prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-table:border prose-table:text-left
      prose-hr:border-t-2 prose-hr:border-gray-300
      prose-sub:text-sm prose-sub:align-baseline prose-sup:text-sm prose-sup:align-baseline prose-mark:bg-yellow-100 prose-mark:text-black
      prose-details:bg-gray-100 prose-details:rounded prose-details:px-4 prose-details:py-2 prose-summary:list-decimal prose-summary:font-semibold prose-summary:text-primary
      prose-ins:bg-blue-100 prose-ins:text-black prose-cite:text-primary prose-abbr:underline prose-abbr:text-primary prose-kbd:bg-gray-500 prose-kbd:text-white
      prose-del:text-red-500 prose-del:line-through"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
};

export default ArticleDetail;
