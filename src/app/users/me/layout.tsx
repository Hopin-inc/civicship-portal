"use client";

import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { User, ChevronLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { usePathname } from "next/navigation";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // This is mock data. In a real application, you would fetch this from an API
  const userData = {
    name: "山田 太郎",
    username: "yamada_taro",
    points: 1250,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-shrink-0">
        <div className="bg-background p-3">
          <Button variant="ghost" className="mb-3" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              トップへ戻る
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-sm text-muted-foreground">@{userData.username}</p>
              <p className="font-semibold mt-1">保有ポイント: {userData.points} pt</p>
            </div>
          </div>
        </div>
        <Tabs value={pathname.split("/").pop()} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="opportunities" asChild>
              <Link href="/users/me/communities">所属コミュニティ</Link>
            </TabsTrigger>
            <TabsTrigger value="activities" asChild>
              <Link href="/users/me/opportunities">募集一覧</Link>
            </TabsTrigger>
            <TabsTrigger value="transactions" asChild>
              <Link href="/users/me/transactions">ポイント履歴</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-grow overflow-y-auto p-4">{children}</div>
    </div>
  );
};

export default MyPageLayout;
