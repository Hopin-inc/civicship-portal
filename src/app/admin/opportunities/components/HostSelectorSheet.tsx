"use client";

import { useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");

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

  // 検索フィルタリング
  const filteredHosts = useMemo(() => {
    const hosts = (data?.memberships?.edges || [])
      .map((edge) => edge?.node)
      .filter((membership) => membership?.user != null)
      .map((membership) => ({
        id: membership!.user!.id,
        name: membership!.user!.name || "名前なし",
        role: membership!.role,
        image: membership!.user!.image,
      }));

    if (!searchQuery.trim()) return hosts;

    const query = searchQuery.toLowerCase();
    return hosts.filter((host) => host.name.toLowerCase().includes(query));
  }, [data, searchQuery]);

  const handleSelect = (hostId: string, hostName: string) => {
    onSelectHost(hostId, hostName);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-6 text-title-sm">
          <SheetTitle className={"text-title-sm"}>主催者を選択</SheetTitle>
        </SheetHeader>

        <div>
          {loading && <LoadingIndicator />}

          {!loading && filteredHosts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "該当する主催者が見つかりません" : "主催者が登録されていません"}
            </div>
          )}

          {!loading && filteredHosts.length > 0 && (
            <div className="space-y-2">
              {filteredHosts.map((host) => (
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
                  <ItemContent className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={host.image ?? PLACEHOLDER_IMAGE}
                        alt={host.name}
                      />
                      <AvatarFallback>{host.name[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold">{host.name}</span>
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
