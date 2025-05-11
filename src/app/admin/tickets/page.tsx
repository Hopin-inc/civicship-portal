"use client";

import { useHeaderConfig } from "@/hooks/core";
import { useEffect } from "react";

export default function TicketsPage() {
  const { setHeaderConfig } = useHeaderConfig();

  useEffect(() => {
    setHeaderConfig({ show: false });
  }, [setHeaderConfig]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">チケット一覧</h1>
      <div className="space-y-4">
        {/* Placeholder content - data fetching not required yet */}
        <div className="border rounded p-4">
          <h2 className="font-semibold">チケット #1</h2>
          <p className="text-gray-600">2025/05/10</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">チケット #2</h2>
          <p className="text-gray-600">2025/05/09</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">チケット #3</h2>
          <p className="text-gray-600">2025/05/08</p>
        </div>
      </div>
    </div>
  );
}
