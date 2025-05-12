"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";

interface DateGroupedOpportunitiesProps {
  groupedOpportunities: Record<string, ActivityCard[]>;
}

export const DateGroupedOpportunities: React.FC<DateGroupedOpportunitiesProps> = ({
  groupedOpportunities,
}) => {
  if (Object.keys(groupedOpportunities).length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">日付別の体験</h2>
      {Object.entries(groupedOpportunities).map(([dateKey, opportunities]) => (
        <div key={dateKey} className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            {format(new Date(dateKey), "M月d日（E）", { locale: ja })}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {opportunities.map((props) => (
              <OpportunityCardVertical key={props.id} opportunity={props} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default DateGroupedOpportunities;
