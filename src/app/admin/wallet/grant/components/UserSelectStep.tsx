"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemberWithDidSearch as useMemberSearchFromCredentials } from "@/app/admin/credentials/hooks/useMemberWithDidSearch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tabs as TabsEnum } from "../types/tabs";
import { useAuth } from "@/contexts/AuthProvider";
import UserInfoCard from "./UserInfoCard";
import { useWalletsAndDidIssuanceRequests } from "../hooks/useWalletsAndDidIssuanceRequests";
import SearchForm from "@/app/admin/credentials/components/selectUser/SearchForm";
import Loading from "@/components/layout/Loading";
import ErrorState from "@/components/shared/ErrorState";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[];
  onSelect: (user: GqlUser) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  title?: string;
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>
  listType: "donate" | "grant";
}

function UserSelectStep({ members, onSelect, onLoadMore, hasNextPage, title, activeTab, setActiveTab, listType }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const {
    error,
    loading: historyLoading,
    presentedTransactions,
  } = useWalletsAndDidIssuanceRequests({ userId: user?.id, listType, keyword: searchQuery });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "history" || tabParam === "member") {
      setActiveTab(tabParam as TabsEnum);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabsEnum;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

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
  const { data: searchMembershipData, loading: searchLoading, error: searchError } = useMemberSearchFromCredentials(members, { searchQuery });

  const [input, setInput] = useState("");
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

  if (error || searchError) {
    return <ErrorState title="支給履歴またはメンバーを読み込めませんでした" />;
  }

  if (historyLoading || searchLoading) {
    return <Loading />
  }

  return (
    <>
      <form className="px-4">
        <SearchForm value={input} onInputChange={setInput} onSearch={setSearchQuery} />
      </form>
      <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value)}>
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
            value={TabsEnum.Member}
            className={`
              rounded-full px-6 py-2 font-bold text-sm
              ${activeTab === TabsEnum.Member
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
        {activeTab === TabsEnum.History && presentedTransactions.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground pt-4">
            支給履歴がありません
          </p>
        ) : (
          activeTab === TabsEnum.History &&presentedTransactions.map((tx,index) => {
            return (
              <UserInfoCard
                key={`${tx.otherUser?.id}-${index}`}
                otherUser={tx.otherUser}
                label={tx.label}
                point={tx.point}
              sign={tx.sign}
              pointColor={tx.pointColor}
              didValue={tx.didValue ?? "did取得中"}
              createdAt={tx.createdAt}
              onClick={() => {
                if (tx.otherUser) onSelect(tx.otherUser);
              }}
            />
          );
        }))}
        {activeTab === TabsEnum.Member && searchMembershipData.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground pt-4">
            一致するメンバーが見つかりません
          </p>
        ) : (
          activeTab === TabsEnum.Member && searchMembershipData?.map((m) => {
            return (
              <UserInfoCard
                key={m.id}
                otherUser={m}
                label={m.name}
                showPoint={false}
                showDate={false}
                didValue={m.didInfo?.didValue ?? "did取得中"}
                onClick={() => onSelect(m)}
              />
            );
          })
        )}
        {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
      </div>
      </>
  );
}

export default UserSelectStep;
