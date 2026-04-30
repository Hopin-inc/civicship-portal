"use client";

import { AppLink } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { ArrowLeftRight, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Community = {
  id: string;
  name?: string | null;
  image?: string | null;
};

type Props = {
  communities: Community[];
  currentCommunityId: string | undefined;
  hasAdminRole: boolean;
  loading: boolean;
};

export function CommunitySwitcher({ communities, currentCommunityId, hasAdminRole, loading }: Props) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tertiary" size="sm" disabled={loading}>
          {t("users.profileHeader.switchButton")}
          <ArrowLeftRight className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("users.profileHeader.switchLabel")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {communities.map((community) => {
          const isCurrent = community.id === currentCommunityId;
          return (
            <DropdownMenuItem key={community.id} asChild disabled={isCurrent}>
              <AppLink href="/users/me" communityId={community.id} className="flex items-center gap-3 py-2">
                <div className="relative shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={community.image ?? undefined} alt={community.name ?? ""} />
                    <AvatarFallback className="text-xs font-medium">
                      {community.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  {isCurrent && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </span>
                  )}
                </div>
                <span className="flex-1 truncate text-sm">{community.name}</span>
              </AppLink>
            </DropdownMenuItem>
          );
        })}
        {hasAdminRole && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AppLink href="/admin">
                {t("users.profileHeader.adminButton")}
              </AppLink>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
