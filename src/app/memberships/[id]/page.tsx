"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const MembershipDetail: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/memberships" className="inline-flex">
        <ChevronLeft />
        メンバーシップ一覧に戻る
      </Link>
      <div className="w-full flex justify-between">
        <h1>メンバーシップ詳細</h1>
      </div>
    </main>
  );
};

export default MembershipDetail;
