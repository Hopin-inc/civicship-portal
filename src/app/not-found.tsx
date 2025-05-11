"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">ページが存在しません</h1>
        <p className="text-muted-foreground">お探しのページは見つかりませんでした。</p>
        
        <Link href="/" passHref>
          <Button className="mt-4">
            <Home className="mr-2 h-4 w-4" />
            トップページに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
