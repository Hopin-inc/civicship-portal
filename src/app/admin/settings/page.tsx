"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ChevronRight } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const router = useRouter();
  const communityConfig = useCommunityConfig();

  const headerConfig = useMemo(
    () => ({
      title: "設定",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  if (!communityConfig) {
    return null;
  }

  const {
    title,
    description,
    squareLogoPath,
    logoPath,
    ogImagePath,
    faviconPrefix,
    enableFeatures,
  } = communityConfig;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <section>
        <div className="space-y-2">
          <Item
            size="sm"
            variant={"outline"}
            role="button"
            tabIndex={0}
            // onClick={onDescriptionClick}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     onDescriptionClick();
            //   }
            // }}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">名前</ItemTitle>
              <ItemDescription className="whitespace-pre-wrap">{title}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <Item
            size="sm"
            variant={"outline"}
            role="button"
            tabIndex={0}
            // onClick={onDescriptionClick}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     onDescriptionClick();
            //   }
            // }}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">概要</ItemTitle>
              <ItemDescription className="whitespace-pre-wrap">{description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          <Item
            size="sm"
            variant={"outline"}
            role="button"
            tabIndex={0}
            // onClick={onDescriptionClick}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     onDescriptionClick();
            //   }
            // }}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">ロゴ(正方形)</ItemTitle>
              <ItemDescription className="whitespace-pre-wrap">{description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          <ItemGroup className="border rounded-lg">
            <Item size="sm">
              <ItemContent>
                <ItemTitle className="flex items-center font-bold gap-2">利用機能</ItemTitle>
              </ItemContent>
            </Item>

            <Item size="sm">
              <ItemContent>
                <ItemTitle>募集</ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                  hogehogehoge
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Switch
                  checked={true}
                  // onCheckedChange={onRequireHostApprovalChange}
                />
              </ItemActions>
            </Item>
            <ItemSeparator />
          </ItemGroup>
        </div>
      </section>
    </div>
  );
}
