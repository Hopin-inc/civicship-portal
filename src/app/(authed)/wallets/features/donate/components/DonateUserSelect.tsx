"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import UserSelectStep from "@/app/(authed)/admin/wallet/grant/components/UserSelectStep";
import { Tabs } from "@/app/(authed)/admin/wallet/grant/types/tabs";
import { DonateMember } from "../types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  return (
    <UserSelectStep
      title={t("wallets.donate.selectRecipient")}
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
