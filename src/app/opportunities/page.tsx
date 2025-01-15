"use client";

import OpportunityList from "@/app/opportunities/OpportunityList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OpportunityCreateModal from "@/app/opportunities/OpportunityCreateModal";
import React, { Suspense } from "react";
import ParticipationApprovePerformanceModal from "@/app/opportunities/OpportunityApprovePerformanceModal";

const Opportunities: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">募集一覧</h1>
        <div className="flex gap-4 ml-auto">
          <Suspense>
            <OpportunityCreateModal />
          </Suspense>
          <Suspense>
            <ParticipationApprovePerformanceModal />
          </Suspense>
        </div>
      </div>
      <OpportunityList />
    </main>
  );
};

export default Opportunities;