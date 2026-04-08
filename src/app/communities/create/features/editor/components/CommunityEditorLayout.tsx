import { ReactNode } from "react";

interface CommunityEditorLayoutProps {
  children: ReactNode;
}

export function CommunityEditorLayout({ children }: CommunityEditorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">{children}</main>
    </div>
  );
}
