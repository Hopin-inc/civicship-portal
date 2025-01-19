"use client";

import UserList from "@/app/users/UserList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import React, { Suspense } from "react";

const Users: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ユーザー一覧</h1>
      </div>
      <UserList />
    </main>
  );
};

export default Users;
