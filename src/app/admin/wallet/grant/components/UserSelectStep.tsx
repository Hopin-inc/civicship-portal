"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import SearchForm from "@/app/search/components/SearchForm";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";
import { FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tabs as TabsEnum } from "../types/tabs";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[];
  onSelect: (user: GqlUser) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  title?: string;
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>
}

function UserSelectStep({ members, onSelect, onLoadMore, hasNextPage, title, activeTab, setActiveTab }: Props) {

  const headerConfig = useMemo(
    () => ({
      title: title ?? "支給相手を選ぶ",
      showLogo: false,
      showBackButton: true,
    }),
    [title],
  );
  useHeaderConfig(headerConfig);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { form, filteredMembers } = useMemberSearch(members);

  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, onLoadMore]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4">
        <SearchForm name="searchQuery" />
      </form>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabsEnum)}>
        <TabsList className="gap-2 w-3/5 pl-4">
          <TabsTrigger
            value={TabsEnum.History}
            className={`
              rounded-full px-6 py-2 font-bold text-sm
              ${activeTab === TabsEnum.History
                ? "!bg-blue-600 !text-white border border-blue-600"
                : "bg-white text-black border border-gray-300"
              }
            `}
          >
            履歴
          </TabsTrigger>
          <TabsTrigger
            value={TabsEnum.Grant}
            className={`
              rounded-full px-6 py-2 font-bold text-sm
              ${activeTab === TabsEnum.Grant
                ? "!bg-blue-600 !text-white border border-blue-600 shadow"
                : "bg-white text-black border border-gray-300"
              }
            `}
          >
            メンバー
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-3 px-4">
        {filteredMembers.map(({ user, wallet }) => (
          <Card
            key={user.id}
            onClick={() => onSelect(user)}
            className="cursor-pointer hover:bg-background-hover transition"
          >
            <CardHeader className="flex flex-row items-center gap-3 p-4">
              <Avatar>
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <CardTitle className="text-base font-medium truncate max-w-[160px]">
                  {user.name}
                </CardTitle>
                <CardDescription>
                  {wallet?.currentPointView?.currentPoint?.toLocaleString() ?? 0}pt 保有
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}

        {filteredMembers.length === 0 && (
          <p className="text-sm text-center text-muted-foreground pt-4">
            一致するメンバーが見つかりません
          </p>
        )}

        {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
      </div>
    </FormProvider>
  );
}

export default UserSelectStep;
