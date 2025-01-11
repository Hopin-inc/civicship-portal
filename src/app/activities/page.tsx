"use client";

import ActivityList from "@/app/activities/ActivityList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ActivityCreateModal from "@/app/activities/ActivityCreateModal";
import { Suspense } from "react";

const Activities: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
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
