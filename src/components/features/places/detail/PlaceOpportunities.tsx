"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/types/opportunity";

interface PlaceOpportunitiesProps {
  opportunities: ActivityCard[];
}

const PlaceOpportunities: React.FC<PlaceOpportunitiesProps> = ({ opportunities }) => {
  if (!opportunities.length) return null;

  return (
    <div className="px-4 space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          募集中の関わり
          <span className="bg-primary-foreground text-primary text-xs font-medium px-2 py-0.5 rounded-full">
            {opportunities.length}
          </span>
        </h2>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="flex-shrink-0 w-[280px] rounded-lg overflow-hidden border border-input"
              >
                <div className="relative h-[160px] w-full">
                  <Image
                    src={opportunity.images?.[0] || "/placeholder.png"}
                    alt={opportunity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{opportunity.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      {opportunity.feeRequired
                        ? `¥${opportunity.feeRequired.toLocaleString()}`
                        : "無料"}
                    </div>
                    <Link href={`/activities/${opportunity.id}`}>
                      <Button variant="secondary" size="sm" className="px-4">
                        詳細
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOpportunities;
