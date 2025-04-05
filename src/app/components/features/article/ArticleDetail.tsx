import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import xss from "xss";
import { useEffect, useState } from "react";
import { useHeader } from "@/contexts/HeaderContext";

type ArticleDetailProps = {
  article: Article;
  recommendedArticles?: Article[];
  relatedArticles?: Article[];
};

const CategoryBadge = ({ type }: { type: Article["type"] }) => {
  const categoryLabels = {
    interview: "インタビュー",
    activity_report: "活動報告",
    column: "コラム",
  };

  return (
    <div className="inline-block bg-[#4361EE] text-white px-4 py-1 rounded-md text-sm font-medium">
      {categoryLabels[type]}
    </div>
  );
};

const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  const options = {
    whiteList: {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      p: [],
      a: ["href"],
      strong: [],
      em: [],
      ul: [],
      ol: [],
      li: [],
      blockquote: [],
      code: [],
      pre: [],
      img: ["src", "alt"],
      table: [],
      thead: [],
      tbody: [],
      tr: [],
      th: [],
      td: [],
    },
  };

  return xss(String(result), options);
};

export const ArticleDetail = ({
  article,
  recommendedArticles = [],
  relatedArticles = [],
}: ArticleDetailProps) => {
  const [contentHtml, setContentHtml] = useState<string>("");
  const { updateConfig } = useHeader();

  useEffect(() => {
    convertMarkdownToHtml(article.content)
      .then((html) => {
        console.log("Converted HTML:", html);
        setContentHtml(html);
      })
      .catch((error) => console.error("Error converting markdown:", error));
  }, [article.content]);

  useEffect(() => {
    // Update header with author name
    updateConfig({
      title: `${article.author?.name || 'ユーザー'}さんの記事`,
      showBackButton: true,
      showLogo: false,
      showSearchForm: false,
    });

    // Cleanup function to reset header when component unmounts
    return () => {
      updateConfig({
        showBackButton: false,
        showLogo: true,
        showSearchForm: false,
      });
    };
  }, [article.author?.name, updateConfig]);

  return (
    <div className="max-w-[375px] mx-auto pt-10 pb-32 px-2">
      <div className="bg-white relative rounded-[8px]">
        {/* {article.thumbnail && ( */}
          <div className="relative w-full h-[210px]">
            <Image src={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop"} alt={article.title} fill className="object-cover" />
            <div className="absolute top-4 left-4">
              <CategoryBadge type={article.type} />
            </div>
          </div>
        {/* )} */}

        <div className="relative -mt-8 bg-white rounded-2xl shadow-md mx-4">
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
            <div className="text-gray-600 text-sm">
              公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="px-4 py-4">
            <p className="text-gray-700 text-base leading-relaxed">{article.description}</p>
          </div>
        </div>
      </div>

      <article className="px-4 py-6">
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-strong:text-gray-900 prose-img:rounded-lg prose-img:shadow-lg prose-p:my-4 prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {recommendedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">おすすめの記事</h2>
          <div className="grid grid-cols-1 gap-6">
            {recommendedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">関連する記事</h2>
          <div className="grid grid-cols-1 gap-6">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={
              article.thumbnail ||
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop"
            }
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <CategoryBadge type={article.type} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <div className="text-gray-600 text-sm mb-2">
            公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
          </div>
          <p className="text-gray-700 text-sm line-clamp-3">{article.description}</p>
        </div>
      </div>
    </Link>
  );
};
