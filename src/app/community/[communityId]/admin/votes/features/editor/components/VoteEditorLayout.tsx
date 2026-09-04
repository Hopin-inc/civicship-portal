import { ReactNode } from "react";

interface VoteEditorLayoutProps {
  children: ReactNode;
}

export function VoteEditorLayout({ children }: VoteEditorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">{children}</main>
    </div>
  );
}
