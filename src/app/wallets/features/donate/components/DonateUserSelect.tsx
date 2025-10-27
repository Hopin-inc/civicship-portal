"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import UserSelectStep from "@/app/admin/wallet/grant/components/UserSelectStep";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { DonateMember } from "../types";

interface Props {
  members: DonateMember[];
  onSelect: (user: GqlUser) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  isLoadingMore?: boolean;
  activeTab: Tabs;
  setActiveTab: React.Dispatch<React.SetStateAction<Tabs>>;
}

export function DonateUserSelect({
  members,
  onSelect,
  loadMoreRef,
  isLoadingMore,
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <UserSelectStep
      title="送り先を選ぶ"
      members={members}
      onSelect={onSelect}
      loadMoreRef={loadMoreRef}
      isLoadingMore={isLoadingMore}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      listType="donate"
    />
  );
}
