"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface CommunityEditorLayoutProps {
  children: ReactNode;
}

export function CommunityEditorLayout({ children }: CommunityEditorLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-2 px-4 h-14 border-b">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 rounded-md hover:bg-accent"
          aria-label="戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-sm">コミュニティを作成</span>
      </header>
      <main className="px-6 max-w-md mx-auto">{children}</main>
    </div>
  );
}
