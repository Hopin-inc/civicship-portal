"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[];
  onSelect: (user: GqlUser) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
}

function UserSelectStep({ members, onSelect, onLoadMore, hasNextPage }: Props) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
    <>
      <p className="px-4 text-sm text-muted-foreground">渡す相手を選んでください</p>
      <div className="space-y-3 px-4">
        {members.map(({ user, wallet }) => (
          <Card
            key={user.id}
            onClick={() => onSelect(user)}
            className="cursor-pointer hover:bg-accent transition"
          >
            <CardHeader className="flex flex-row items-center gap-3 p-4">
              <Image
                src={user.image ?? PLACEHOLDER_IMAGE}
                alt={user.name ?? "要確認"}
                width={40}
                height={40}
                className="rounded-full object-cover border"
                style={{ aspectRatio: "1 / 1" }}
              />
              <div className="flex flex-col text-left">
                <CardTitle className="text-base font-medium truncate max-w-[160px]">
                  {user.name}
                </CardTitle>
                <CardDescription>
                  保有pt: {wallet.currentPointView?.currentPoint?.toLocaleString() ?? 0}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}

        {/* 無限スクロールの監視ポイント */}
        {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
      </div>
    </>
  );
}

export default UserSelectStep;
