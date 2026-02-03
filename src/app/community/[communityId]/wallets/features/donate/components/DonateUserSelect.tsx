"use client";

import React from "react";
import { GqlMembershipsConnection, GqlUser } from "@/types/graphql";
import UserSelectStep from "@/app/community/[communityId]/admin/wallet/grant/components/UserSelectStep";
import { Tabs } from "@/app/community/[communityId]/admin/wallet/grant/types/tabs";
import { DonateMember } from "../types";
import { useTranslations } from "next-intl";

interface Props {
  members: DonateMember[];
  onSelect: (user: GqlUser) => void;
  activeTab: Tabs;
  setActiveTab: React.Dispatch<React.SetStateAction<Tabs>>;
  initialConnection?: GqlMembershipsConnection | null;
}

export function DonateUserSelect({
  members,
  onSelect,
  activeTab,
  setActiveTab,
  initialConnection,
}: Props) {
  const t = useTranslations();
  return (
    <UserSelectStep
      title={t("wallets.donate.selectRecipient")}
      members={members}
      onSelect={onSelect}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      listType="donate"
      initialConnection={initialConnection}
    />
  );
}
