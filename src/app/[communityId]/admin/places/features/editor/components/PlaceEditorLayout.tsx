import { ReactNode } from "react";

interface PlaceEditorLayoutProps {
  children: ReactNode;
}

export function PlaceEditorLayout({ children }: PlaceEditorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">
        {children}
      </main>
    </div>
  );
}
