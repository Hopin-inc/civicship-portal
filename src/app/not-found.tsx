"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <div className="bg-muted rounded-full p-4 mx-auto w-fit">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold">
          お探しのページが
          <br />
          見つかりませんでした
        </h1>
        <p className="text-left text-body-sm text-muted-foreground px-[40px]">
          指定されたページ（URL）が見つかりません。
          <br />
          下にあるボタンからページをご覧ください。
        </p>

        <div className="w-full px-[40px]">
          <Link href="/" passHref>
            <Button className="w-full flex justify-center">
              <Home className="mr-2 h-4 w-4" />
              トップページに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
