"use client";

import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { CommunityListItem } from "../hooks/useCommunities";

interface CommunityItemProps {
  community: CommunityListItem;
}

export function CommunityItem({ community }: CommunityItemProps) {
  return (
    <Item asChild>
      <a href={`/community/${community.id}`} className="flex flex-1 gap-3">
        <div className="flex flex-1 flex-col min-w-0">
          <ItemContent>
            <ItemTitle className={cn("font-bold text-base leading-snug", "line-clamp-2")}>
              {community.name || community.id}
            </ItemTitle>
          </ItemContent>
          <ItemFooter className="mt-2">
            <div className="text-xs text-muted-foreground truncate">{community.id}</div>
          </ItemFooter>
        </div>
      </a>
    </Item>
  );
}
