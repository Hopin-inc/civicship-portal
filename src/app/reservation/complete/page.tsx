"use client";

import { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { RecommendedActivities } from "@/app/activities/RecommendedActivities";
import { RecentActivities } from "@/app/activities/RecentActivities";
import { Calendar, Clock1, Users, JapaneseYen, CircleDollarSign, CheckCircle } from 'lucide-react';
import Image from "next/image";

export default function CompletePage() {
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: "申し込み完了",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

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
              src="/images/activities/olive.jpg"
              alt="陶芸工房で湯呑みづくり"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-base font-medium mb-2">陶芸工房で湯呑みづくり　最...</h2>
            <div className="flex items-center text-sm text-gray-600">
              <span>1人あたり2,000円から</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>観音寺市（香川県）</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date and Price */}
      <div className="w-full bg-gray-50 rounded-lg py-6 px-10 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>2025年3月29日（土）</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock1 className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>13:00-15:30</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>3人</span>
        </div>
        <div className="flex items-center gap-2">
          <JapaneseYen className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
          <span>6,000円（2,000円 × 3人）</span>
        </div>
      </div>

      <div className="w-full mt-8 mb-16">
        <RecentActivities />
      </div>
    </main>
  );
}
