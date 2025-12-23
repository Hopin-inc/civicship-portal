"use client";

import { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GqlMembershipStatus, GqlRole, useGetMembershipListQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface HostSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHostId: string;
  onSelectHost: (hostId: string, hostName: string) => void;
}

export function HostSelectorSheet({
  open,
  onOpenChange,
  selectedHostId,
  onSelectHost,
}: HostSelectorSheetProps) {
  // クエリはSheetが開いている時のみ実行
  const { data, loading } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
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

  const handleSelect = (hostId: string, hostName: string) => {
    onSelectHost(hostId, hostName);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-6 text-title-sm">
          <SheetTitle className={"text-title-sm"}>主催者を選択</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {loading && <LoadingIndicator />}

          {!loading && hosts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              主催者が登録されていません
            </div>
          )}

          {!loading && hosts.length > 0 && (
            <div className="space-y-2">
              {hosts.map((host) => (
                <Item
                  key={host.id}
                  size="sm"
                  variant={selectedHostId === host.id ? "default" : "outline"}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(host.id, host.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSelect(host.id, host.name);
                    }
                  }}
                  className="cursor-pointer"
                >
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
                </Item>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
