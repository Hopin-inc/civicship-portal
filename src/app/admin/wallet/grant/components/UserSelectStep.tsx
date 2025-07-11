"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import SearchForm from "@/app/search/components/SearchForm";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";
import { FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: bigint } } }[];
  onSelect: (user: GqlUser) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  title?: string;
}

function UserSelectStep({ members, onSelect, onLoadMore, hasNextPage, title }: Props) {
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
