"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityEditorLayoutProps {
  children: ReactNode;
}

export function CommunityEditorLayout({ children }: CommunityEditorLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background max-w-mobile-l mx-auto w-full">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full flex items-center px-6 h-16">
        <Button onClick={() => router.back()} variant="icon-only" size="sm" aria-label="戻る">
          <ChevronLeft className="h-6 w-6 text-caption" />
        </Button>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-title-sm truncate max-w-[80vw] text-center">コミュニティを作成</h1>
        </div>
      </header>
      <main className="px-6 max-w-mobile-l mx-auto">{children}</main>
    </div>
  );
}
