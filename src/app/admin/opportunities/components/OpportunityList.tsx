"use client";

import { useOpportunities } from "@/app/admin/opportunities/hooks/useOpportunities";
import { OpportunityItem } from "@/app/admin/opportunities/components/OpportunityItem";

export function OpportunityList() {
  const { data, loading, error } = useOpportunities();

  if (loading) return <div>読み込み中…</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="flex flex-col">
      {data?.list.map((opportunity, idx) => (
        <div key={opportunity.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <OpportunityItem opportunity={opportunity} />
        </div>
      ))}
    </div>
  );
}
