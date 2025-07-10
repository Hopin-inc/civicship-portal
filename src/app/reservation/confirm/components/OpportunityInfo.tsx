"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | null;
}

const OpportunityInfo: React.FC<OpportunityInfoProps> = ({ opportunity }) => {
  if (!opportunity) return null;

  return (
    <Link href={`/activities/${opportunity.id}`} className="block mx-6 my-8">
      <div className="flex justify-between items-center gap-4 group">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={opportunity?.images?.[0] || PLACEHOLDER_IMAGE}
              alt={opportunity?.title ?? ""}
              fill
              placeholder={"blur"}
              blurDataURL={PLACEHOLDER_IMAGE}
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-title-md font-bold leading-tight mb-4 line-clamp-3 break-words group-hover:text-primary transition-colors">
              {opportunity?.title ?? ""}
            </h1>
          </div>
        </div>
        <ArrowRight size={20} className="text-primary flex-shrink-0" />
      </div>
    </Link>
  );
};

export default OpportunityInfo;
