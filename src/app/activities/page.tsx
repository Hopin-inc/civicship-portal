"use client";

import ActivityList from "@/app/activities/ActivityList";
import ActivityCreateModal from "@/app/activities/ActivityCreateModal";
import { Suspense } from "react";
import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";

const Activities: React.FC = () => {
  useHeaderConfig({
    title: "活動一覧",
    showBackButton: false,
  });

  return (
    <main className="min-h-screen p-24">
      <div className="w-full flex justify-between">
        <h1>活動一覧</h1>
        <Suspense>
          <ActivityCreateModal />
        </Suspense>
      </div>
      <ActivityList />
    </main>
  );
};

export default Activities;
