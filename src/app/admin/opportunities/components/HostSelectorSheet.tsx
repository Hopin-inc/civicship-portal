"use client";

import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GqlMembershipStatus, GqlRole, useGetMembershipListQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import SearchForm from "@/components/shared/SearchForm";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

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
        <SheetHeader className="text-left pb-6">
          <SheetTitle>主催者を選択</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <SearchForm
            value={input}
            onInputChange={setInput}
            onSearch={setSearchQuery}
            placeholder="名前で検索"
          />

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
                  <ItemContent>
                    <ItemTitle className="flex items-center justify-between">
                      <span>{host.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {host.role === GqlRole.Owner ? "管理者" : "運用担当者"}
                      </span>
                    </ItemTitle>
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
