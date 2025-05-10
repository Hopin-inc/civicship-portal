"use client";

import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";
import { useEffect } from "react";

const ActivityDetail: React.FC = () => {
  useHeaderConfig({
    title: "活動詳細",
    showBackButton: true,
    backTo: "/activities", // 明示的に戻り先を指定
  });

  return (
    <main className="min-h-screen p-24">
      <div className="w-full flex justify-between">
        <h1>活動詳細</h1>
      </div>
    </main>
  );
};

export default ActivityDetail;
