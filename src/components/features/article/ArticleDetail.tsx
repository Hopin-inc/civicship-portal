'use client';

import Image from "next/image";
import { Article } from "../../../types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { convertMarkdownToHtml } from "../../../utils/markdownUtils";
import { CategoryBadge } from "./CategoryBadge";
import { ArticleRecommendations } from "./ArticleRecommendations";

type ArticleDetailProps = {
  article: Article;
  recommendedArticles?: Article[];
  relatedArticles?: Article[];
};

export const ArticleDetail = ({
  article,
  recommendedArticles = [],
  relatedArticles = [],
}: ArticleDetailProps) => {
  const [contentHtml, setContentHtml] = useState<string>("");

  useEffect(() => {
    convertMarkdownToHtml(article.content)
      .then((html) => {
        setContentHtml(html);
      })
      .catch((error) => console.error("Error converting markdown:", error));
  }, [article.content]);

  return (
    <div className="max-w-[375px] mx-auto pt-10 pb-32 px-2">
      <div className="bg-background relative rounded-[8px]">
        <div className="relative w-full h-[210px]">
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <CategoryBadge type={article.type} />
          </div>
        </div>

        <div className="relative -mt-8 bg-background rounded-2xl shadow-md mx-4">
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
            <div className="text-muted-foreground text-sm">
              公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
            </div>
          </div>

          <div className="h-px bg-muted" />

          <div className="px-4 py-4">
            <p className="text-foreground text-base leading-relaxed">{article.description}</p>
          </div>
        </div>
      </div>

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
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {recommendedArticles.length > 0 && (
        <ArticleRecommendations 
          title="おすすめの記事"
          articles={recommendedArticles}
        />
      )}

      {relatedArticles.length > 0 && (
        <ArticleRecommendations 
          title="関連する記事"
          articles={relatedArticles}
        />
      )}
    </div>
  );
};

export default ArticleDetail;
