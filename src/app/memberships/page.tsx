"use client";

import MembershipList from "@/app/memberships/MembershipList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MembershipSelfJoinModal from "@/app/memberships/MembershipSelfJoinModal";
import React, { Suspense } from "react";

const Memberships: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">メンバーシップ一覧</h1>
        <div className="flex gap-4 ml-auto">
          <Suspense>
            <MembershipSelfJoinModal />
          </Suspense>
        </div>
      </div>
      <MembershipList />
    </main>
  );
};

export default Memberships;
