"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import React, { useEffect } from "react";

interface NotFoundProps {
  titleTarget?: string;
}

export default function NotFound({ titleTarget = "ページ" }: NotFoundProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l space-y-4">
        <h1 className="text-display-md font-bold">
          お探しの{titleTarget}が
          <br />
          見つかりませんでした
        </h1>

        <p className="text-left text-body-sm text-muted-foreground">
          指定された{titleTarget}（URL）が見つかりません。 下にあるボタンからご覧ください。
        </p>

        <Link href="/" passHref>
          <Button className="w-full flex justify-center mt-6">
            <Home className="mr-2 h-4 w-4" />
            トップに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
