"use client";

import { useRouter } from "next/navigation";
import { OpportunityFormEditor } from "../components/OpportunityFormEditor";

export default function CreateOpportunityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">
        <OpportunityFormEditor
          mode="create"
          onSuccess={() => router.push("/admin/opportunities")}
        />
      </main>
    </div>
  );
}
