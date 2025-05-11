"use client";

import { useHeaderConfig } from "@/hooks/core";
import { useEffect } from "react";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { setHeaderConfig } = useHeaderConfig();

  useEffect(() => {
    setHeaderConfig({ 
      show: true,
      title: `チケット #${params.id}`,
      showBackButton: true
    });
  }, [setHeaderConfig, params.id]);

  return (
    <div className="p-4 pt-16">
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="font-semibold">チケット詳細</h2>
          <p className="text-gray-600">ID: {params.id}</p>
        </div>
        
        {/* Placeholder content - data fetching not required yet */}
        <div className="space-y-2">
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">発行日</h3>
            <p>2025/05/10</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">ステータス</h3>
            <p>有効</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-sm text-gray-500">所有者</h3>
            <p>山田 太郎</p>
          </div>
        </div>
      </div>
    </div>
  );
}
