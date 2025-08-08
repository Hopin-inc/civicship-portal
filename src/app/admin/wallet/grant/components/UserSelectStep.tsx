"use client";

import React, { useMemo, useState } from "react";
import { GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs as TabsEnum } from "../types/tabs";
import { TabManager } from "./TabManager";
import { SearchSection } from "./SearchSection";
import { HistoryTab } from "./HistoryTab";
import { MemberTab } from "./MemberTab";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: bigint } } }[];
  onSelect: (user: GqlUser) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  isLoadingMore?: boolean;
  title?: string;
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>;
  listType: "donate" | "grant";
}

function UserSelectStep({
  members,
  onSelect,
  loadMoreRef,
  isLoadingMore,
  title,
  activeTab,
  setActiveTab,
  listType,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const headerConfig = useMemo(
    () => ({
      title: title ?? "支給相手を選ぶ",
      showLogo: false,
      showBackButton: true,
      backTo: listType === "grant" ? "/admin/wallet" : "/wallets",
    }),
    [title, listType],
  );
  useHeaderConfig(headerConfig);

  return (
    <>
      <SearchSection onSearch={setSearchQuery} />
      <TabManager activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === TabsEnum.History && (
        <HistoryTab listType={listType} searchQuery={searchQuery} onSelect={onSelect} />
      )}

      {activeTab === TabsEnum.Member && (
        <MemberTab
          members={members}
          searchQuery={searchQuery}
          onSelect={onSelect}
          loadMoreRef={loadMoreRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </>
  );
}

export default UserSelectStep;
