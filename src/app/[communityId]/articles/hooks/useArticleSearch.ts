import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { TArticleWithAuthor } from "@/app/[communityId]/articles/data/type";

export type SearchFormValues = {
  searchQuery: string;
};

export const useArticleSearch = (articles: TArticleWithAuthor[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const form = useForm<SearchFormValues>({
    defaultValues: {
      searchQuery: initialQuery,
    },
  });

  const searchQuery = form.watch("searchQuery");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) {
      return articles;
    }

    return articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(query);
      const authorMatch = article.author.name.toLowerCase().includes(query);
      const introMatch = article.introduction.toLowerCase().includes(query);

      return titleMatch || authorMatch || introMatch;
    });
  }, [articles, searchQuery]);

  const onSubmit = useCallback(
    (data: SearchFormValues) => {
      const params = new URLSearchParams(searchParams.toString());
      if (data.searchQuery) {
        params.set("q", data.searchQuery);
      } else {
        params.delete("q");
      }
      router.push(`/articles?${params.toString()}`);
    },
    [router, searchParams],
  );

  return {
    form,
    filteredArticles,
    onSubmit,
  };
};
