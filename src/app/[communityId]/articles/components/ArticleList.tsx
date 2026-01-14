"use client";

import React from "react";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import ArticleCard from "@/app/articles/components/Card";
import { Form } from "@/components/ui/form";
import SearchForm from "@/app/search/components/SearchForm";
import { useArticleSearch } from "@/app/articles/hooks/useArticleSearch";

interface ArticleListProps {
  articles: TArticleWithAuthor[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const { form, filteredArticles, onSubmit } = useArticleSearch(articles);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
          <SearchForm name="searchQuery" />
        </form>
      </Form>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">記事がありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} showUser />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
