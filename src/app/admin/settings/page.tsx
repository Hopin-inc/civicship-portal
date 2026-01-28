"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function AdminSettingsPage() {
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
    enableFeatures,
  } = communityConfig;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <section>
        <div className="space-y-2">
          {/* 名前 */}
          <Item
            size="sm"
            variant="outline"
            role="button"
            tabIndex={0}
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

          {/* 概要 */}
          <Item
            size="sm"
            variant="outline"
            role="button"
            tabIndex={0}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">概要</ItemTitle>
              <ItemDescription className="whitespace-pre-wrap line-clamp-2">
                {description}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          {/* ロゴ(正方形) - 右側にプレビュー */}
          <Item
            size="sm"
            variant="outline"
            role="button"
            tabIndex={0}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">ロゴ(正方形)</ItemTitle>
            </ItemContent>
            <ItemActions className="flex items-center gap-2">
              <Avatar className="h-10 w-10 rounded-md border">
                <AvatarImage src={squareLogoPath} alt="正方形ロゴ" />
                <AvatarFallback className="rounded-md bg-muted text-xs">
                  {title?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          {/* ロゴ(横長) - 右側にプレビュー */}
          <Item
            size="sm"
            variant="outline"
            role="button"
            tabIndex={0}
            className="cursor-pointer"
          >
            <ItemContent>
              <ItemTitle className="font-bold">ロゴ(横長)</ItemTitle>
            </ItemContent>
            <ItemActions className="flex items-center gap-2">
              {logoPath ? (
                <div className="h-8 w-20 relative border rounded overflow-hidden bg-muted">
                  <Image
                    src={logoPath}
                    alt="横長ロゴ"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-8 w-20 border rounded bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">未設定</span>
                </div>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>

          {/* OG画像 - 下にプレビュー */}
          <Item
            size="sm"
            variant="outline"
            role="button"
            tabIndex={0}
            className="cursor-pointer flex-col items-stretch"
          >
            <div className="flex items-center justify-between w-full">
              <ItemContent>
                <ItemTitle className="font-bold">OG画像</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </div>
            {ogImagePath ? (
              <div className="mt-2 w-full aspect-[1.91/1] relative border rounded overflow-hidden bg-muted">
                <Image
                  src={ogImagePath}
                  alt="OG画像"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="mt-2 w-full aspect-[1.91/1] border rounded bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">未設定</span>
              </div>
            )}
          </Item>

          {/* 利用機能 */}
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
                  ボランティア募集機能を有効にする
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={enableFeatures?.includes("opportunities") ?? false}
                />
              </ItemActions>
            </Item>
            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>ポイント</ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                  ポイント・ウォレット機能を有効にする
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={enableFeatures?.includes("points") ?? false}
                />
              </ItemActions>
            </Item>
            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>チケット</ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                  チケット機能を有効にする
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={enableFeatures?.includes("tickets") ?? false}
                />
              </ItemActions>
            </Item>
            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>証明書</ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                  証明書発行機能を有効にする
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={enableFeatures?.includes("credentials") ?? false}
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </section>
    </div>
  );
}
