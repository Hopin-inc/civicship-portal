"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

interface EmptySearchResultsProps {
  searchQuery?: string;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <div className="bg-muted rounded-full p-4 mx-auto w-fit">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold">
          検索結果が
          <br />
          見つかりませんでした
        </h1>

        <p className="text-left text-body-sm text-muted-foreground px-[40px]">
          {searchQuery
            ? `「${searchQuery}」に一致する体験は見つかりませんでした。`
            : "検索条件に一致する体験は見つかりませんでした。"}
          <br />
          別のキーワードや条件で再度検索してみてください。
        </p>

        <div className="w-full px-[40px]">
          <AppLink href="/search">
            <Button className="w-full flex justify-center">検索条件を変更する</Button>
          </AppLink>
        </div>
      </div>
    </div>
  );
};

export default EmptySearchResults;
