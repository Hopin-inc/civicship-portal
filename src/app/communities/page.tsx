"use client";

import CommunityList from "@/app/communities/CommunityList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CommunityCreateModal from "@/app/communities/CommunityCreateModal";
import React, { Suspense } from "react";

const Communities: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">コミュニティ一覧</h1>
        <div className="flex gap-4 ml-auto">
          <Suspense>
            <CommunityCreateModal />
          </Suspense>
        </div>
      </div>
      <CommunityList />
    </main>
  );
};

export default Communities;