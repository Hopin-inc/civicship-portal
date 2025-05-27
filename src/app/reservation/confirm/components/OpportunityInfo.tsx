"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | null;
}

const OpportunityInfo: React.FC<OpportunityInfoProps> = ({ opportunity }) => {
  return (
    <div className="mx-6 my-8">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={opportunity?.images?.[0] || PLACEHOLDER_IMAGE}
            alt={opportunity?.title ?? ""}
            fill
            placeholder={"blur"}
            blurDataURL={PLACEHOLDER_IMAGE}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-title-md font-bold leading-tight mb-4 line-clamp-3 break-words">
            {opportunity?.title ?? ""}
          </h1>
          {/*<div className="flex items-center gap-3">*/}
          {/*  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">*/}
          {/*    <Image*/}
          {/*      src={opportunity?.host?.image ?? PLACEHOLDER_IMAGE ?? null}*/}
          {/*      alt={opportunity?.host?.name ?? "案内人"}*/}
          {/*      fill*/}
          {/*      placeholder={"blur"}*/}
          {/*      blurDataURL={PLACEHOLDER_IMAGE}*/}
          {/*      className="object-cover"*/}
          {/*      onError={(e) => {*/}
          {/*        const img = e.target as HTMLImageElement;*/}
          {/*        img.src = PLACEHOLDER_IMAGE;*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <span className="text-label-md">{opportunity?.host?.name ?? "案内人"}</span>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default OpportunityInfo;
