"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetType, ImageFieldKey } from "../../types/settings";
import { IMAGE_SIZES, IMAGE_FIELD_CONFIG } from "../../constants/settings";

interface BrandingSectionProps {
  squareLogoPath: string | null;
  logoPath: string | null;
  ogImagePath: string | null;
  faviconPrefix: string | null;
  onItemClick: (sheet: SheetType) => void;
}

export function BrandingSection({
  squareLogoPath,
  logoPath,
  ogImagePath,
  faviconPrefix,
  onItemClick,
}: BrandingSectionProps) {
  const faviconUrl = faviconPrefix ? `${faviconPrefix}/favicon-32x32.png` : null;

  const renderSizeDescription = (key: ImageFieldKey) => {
    const size = IMAGE_SIZES[key];
    const config = IMAGE_FIELD_CONFIG[key];
    if (config.acceptSvg) {
      return "SVG推奨";
    }
    return `${size.width} x ${size.height} px`;
  };

  return (
    <>
      {/* ロゴ(正方形) */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        onClick={() => onItemClick("squareLogo")}
      >
        <ItemContent>
          <ItemTitle className="font-bold">{IMAGE_FIELD_CONFIG.squareLogo.title}</ItemTitle>
          <ItemDescription className="text-xs">
            {renderSizeDescription("squareLogo")}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          <Avatar className="h-10 w-10 rounded-md border">
            <AvatarImage src={squareLogoPath ?? undefined} alt="Square Logo" />
            <AvatarFallback className="rounded-md">Logo</AvatarFallback>
          </Avatar>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

      {/* ロゴ(横長) */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        onClick={() => onItemClick("logo")}
      >
        <ItemContent>
          <ItemTitle className="font-bold">{IMAGE_FIELD_CONFIG.logo.title}</ItemTitle>
          <ItemDescription className="text-xs">
            {renderSizeDescription("logo")}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          {logoPath ? (
            <div className="h-8 w-20 relative">
              <Image
                src={logoPath}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-8 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              未設定
            </div>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

      {/* OG画像 */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer flex-col items-stretch"
        onClick={() => onItemClick("ogImage")}
      >
        <div className="flex items-center justify-between w-full">
          <ItemContent>
            <ItemTitle className="font-bold">{IMAGE_FIELD_CONFIG.ogImage.title}</ItemTitle>
            <ItemDescription className="text-xs">
              {renderSizeDescription("ogImage")}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </ItemActions>
        </div>
        {ogImagePath && (
          <div className="mt-2 w-full aspect-[1.91/1] relative rounded-md overflow-hidden border">
            <Image
              src={ogImagePath}
              alt="OG Image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </Item>

      {/* ファビコン */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        onClick={() => onItemClick("favicon")}
      >
        <ItemContent>
          <ItemTitle className="font-bold">{IMAGE_FIELD_CONFIG.favicon.title}</ItemTitle>
          <ItemDescription className="text-xs">
            {renderSizeDescription("favicon")}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          {faviconUrl ? (
            <div className="h-8 w-8 relative">
              <Image
                src={faviconUrl}
                alt="Favicon"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              -
            </div>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>
    </>
  );
}
