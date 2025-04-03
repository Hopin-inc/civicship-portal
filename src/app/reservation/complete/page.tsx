"use client";

import { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { RecentActivitiesTimeline } from "@/app/components/features/activity/RecentActivitiesTimeline";
import { Calendar, Clock1, Users, JapaneseYen, CircleDollarSign, CheckCircle } from 'lucide-react';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useOpportunity } from "@/hooks/useOpportunity";
import type { Opportunity } from "@/types";

export default function CompletePage() {
  const { updateConfig } = useHeader();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity_id");
  const communityId = searchParams.get("community_id");

  const { opportunity } = useOpportunity(opportunityId || "", communityId || "");

  useEffect(() => {
    updateConfig({
      title: "申し込み完了",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  if (!opportunity) {
    return <div>Opportunity not found</div>;
  }

  const opportunitiesCreatedByHost = opportunity.createdByUser?.opportunitiesCreatedByMe?.edges || [];

  const startDate = new Date(opportunity.startsAt);
  const formattedDate = startDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const startTime = startDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const endDate = new Date(opportunity.endsAt);
  const endTime = endDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const participantCount = opportunity.participants.length;
  const totalPrice = (opportunity.feeRequired || 0) * participantCount;

  return (
    <main className="flex flex-col items-center px-4 pb-8">
      <div className="flex flex-col items-center py-12">
        <div className="flex items-center justify-center">
          <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-[#4169E1]" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold mt-2">申し込み完了</h2>
      </div>

      {/* Activity Details */}
      <div className="w-full bg-white rounded-lg mb-4">
        <div className="flex gap-4 p-4">
          <div className="relative w-[72px] h-[72px] shrink-0">
            <Image
              src={opportunity.image || "/placeholder.png"}
              alt={opportunity.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-base font-medium mb-2">{opportunity.title}</h2>
            <div className="flex items-center text-sm text-gray-600">
              <span>1人あたり{opportunity.feeRequired?.toLocaleString() || '0'}円から</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>{opportunity.place?.name || "場所未定"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date and Price */}
      <div className="w-full bg-gray-50 rounded-lg py-6 px-10 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock1 className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>{startTime}-{endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>{participantCount}人</span>
        </div>
        <div className="flex items-center gap-2">
          <JapaneseYen className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>{totalPrice.toLocaleString()}円（{opportunity.feeRequired?.toLocaleString() || '0'}円 × {participantCount}人）</span>
        </div>
      </div>

      <div className="w-full mt-8 mb-16">
        <RecentActivitiesTimeline opportunities={opportunitiesCreatedByHost} />
      </div>
    </main>
  );
}
