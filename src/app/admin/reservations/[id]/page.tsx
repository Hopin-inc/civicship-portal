"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const headerConfig = useMemo(() => ({
    title: `応募 ${params.id}`,
    showBackButton: true,
  }), [params.id]);
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4 pt-16">
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="font-semibold">応募詳細</h2>
          <p className="text-gray-600">ID: {params.id}</p>
        </div>

        {/* Placeholder content - data fetching not required yet */}
        <div className="space-y-2">
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">応募日</h3>
            <p>2025/05/10</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">ステータス</h3>
            <p>承認待ち</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">応募者</h3>
            <p>山田 太郎</p>
          </div>
        </div>
      </div>
    </div>
  );
}
