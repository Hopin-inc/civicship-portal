"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useLiff } from "@/hooks/useLiff";
import TestOrganizationList from "@/app/components/elements/TestOrganizationList";
import { LINE_LOGIN_URL } from "@/consts/url";

export default async function Home() {
  const { liffState } = useLiff();
  const isLoggedIn = liffState?.isLoggedIn();

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-2xl font-bold">civicship portal</h1>
      <p>ログイン中の場合、団体とその所属ユーザー名が一覧で表示されます。</p>
      <Button disabled={isLoggedIn} className="mt-2" asChild>
        {isLoggedIn ? <p>"ログイン済み"</p> : <Link href={LINE_LOGIN_URL}>"ログイン"</Link>}
      </Button>
      <TestOrganizationList />
    </main>
  );
}
