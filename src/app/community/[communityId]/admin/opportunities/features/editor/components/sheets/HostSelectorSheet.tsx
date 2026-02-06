"use client";

import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GqlMembershipStatus, GqlRole, useGetMembershipListQuery } from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { ItemContent } from "@/components/ui/item";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { SelectorSheet } from "../../../shared/components/SelectorSheet";

interface HostSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHostId: string;
  onSelectHost: (hostId: string, hostName: string) => void;
}

interface Host {
  id: string;
  name: string;
  role: GqlRole;
  image: string | null | undefined;
}

export function HostSelectorSheet({
  open,
  onOpenChange,
  selectedHostId,
  onSelectHost,
}: HostSelectorSheetProps) {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  
  // クエリはSheetが開いている時のみ実行
  const { data, loading } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId,
        status: GqlMembershipStatus.Joined,
        role: [GqlRole.Manager, GqlRole.Owner],
      },
      first: 100,
    },
    skip: !open,
    fetchPolicy: "network-only",
  });

  // ホストリスト
  const hosts = useMemo(() => {
    return (data?.memberships?.edges || [])
      .map((edge) => edge?.node)
      .filter((membership) => membership?.user != null)
      .map((membership) => ({
        id: membership!.user!.id,
        name: membership!.user!.name || "名前なし",
        role: membership!.role,
        image: membership!.user!.image,
      }));
  }, [data]);

  const handleSelect = (host: Host) => {
    onSelectHost(host.id, host.name);
  };

  const renderItem = (host: Host) => (
    <ItemContent className="flex flex-row items-center gap-3">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage
          src={host.image ?? PLACEHOLDER_IMAGE}
          alt={host.name}
        />
        <AvatarFallback>{host.name[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[200px] overflow-hidden flex-1">
        <span className="text-body-sm font-bold truncate">{host.name}</span>
        <span className="text-muted-foreground text-label-xs">
          {host.role === GqlRole.Owner ? "管理者" : "運用担当者"}
        </span>
      </div>
    </ItemContent>
  );

  return (
    <SelectorSheet<Host>
      open={open}
      onOpenChange={onOpenChange}
      title="主催者を選択"
      emptyMessage="主催者が登録されていません"
      items={hosts}
      loading={loading}
      selectedId={selectedHostId}
      onSelect={handleSelect}
      renderItem={renderItem}
      getItemKey={(host) => host.id}
    />
  );
}
