import { ReactNode } from "react";

interface OpportunityEditorLayoutProps {
  children: ReactNode;
}

export function OpportunityEditorLayout({ children }: OpportunityEditorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">
        {children}
      </main>
    </div>
  );
}
