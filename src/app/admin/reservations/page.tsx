"use client";

import { useHeaderConfig } from "@/hooks/core";
import { useMemo } from "react";

export default function ReservationsPage() {
  const headerConfig = useMemo(() => ({
    hideHeader: true,
  }), []);
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">応募一覧</h1>
      <div className="space-y-4">
        {/* Placeholder content - data fetching not required yet */}
        <div className="border rounded p-4">
          <h2 className="font-semibold">応募 #1</h2>
          <p className="text-gray-600">2025/05/10</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">応募 #2</h2>
          <p className="text-gray-600">2025/05/09</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">応募 #3</h2>
          <p className="text-gray-600">2025/05/08</p>
        </div>
      </div>
    </div>
  );
}
