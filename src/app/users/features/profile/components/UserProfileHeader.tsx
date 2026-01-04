"use client";
import React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Facebook, Home, Instagram, Twitter } from "lucide-react";
import { useReadMore } from "@/hooks/useReadMore";
import { cn } from "@/lib/utils";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { getPrefectureKey } from "@/lib/i18n/prefectures";
import { GqlCurrentPrefecture } from "@/types/graphql";

interface UserProfileHeaderProps {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
  currentPrefecture?: GqlCurrentPrefecture;
  isOwner: boolean;
  socialUrl: {
    x: string | null;
    instagram: string | null;
    facebook: string | null;
  };
}

export function UserProfileHeader({
  id,
  name,
  imageUrl,
  bio,
  currentPrefecture,
  isOwner,
  socialUrl,
}: UserProfileHeaderProps) {
  const t = useTranslations();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  const socialButtonClasses =
    "rounded-full border border-input w-10 h-10 flex items-center justify-center";

  return (
    <div className="relative max-w-mobile-l mx-auto w-full">
      <div className="flex flex-col items-center">
        <div className="flex items-center w-full mb-4">
          <div className="flex-grow">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                href="/users/me/setting"
                className={cn(
                  buttonVariants({ variant: "tertiary", size: "md" }),
                  "ml-auto text-black",
                )}
              >
                {t("users.profileHeader.settingsButton")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-start w-full">
          <div>
            <h1 className="text-title-md mb-2">{name}</h1>

            {communityConfig?.enableFeatures?.includes("prefectures") && currentPrefecture && (
              <div className="flex items-center text-label-md text-caption mb-3">
                <Home className="w-4 h-4 mr-1" />
                <span>
                  {getPrefectureKey(currentPrefecture)
                    ? t(getPrefectureKey(currentPrefecture))
                    : currentPrefecture}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 ml-auto mb-4">
            {socialUrl?.facebook && (
              <a href={socialUrl.facebook} target="_blank" rel="noopener noreferrer">
                <Button variant="icon-only" size="icon" className={socialButtonClasses}>
                  <Facebook className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}

            {socialUrl?.instagram && (
              <a href={socialUrl.instagram} target="_blank" rel="noopener noreferrer">
                <Button variant="icon-only" size="icon" className={socialButtonClasses}>
                  <Instagram className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}

            {socialUrl?.x && (
              <a href={socialUrl.x} target="_blank" rel="noopener noreferrer">
                <Button variant="icon-only" size="icon" className={socialButtonClasses}>
                  <Twitter className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {bio && <BioSection bio={bio} />}
      </div>
    </div>
  );
}

function BioSection({ bio }: { bio: string }) {
  const t = useTranslations();
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: bio,
    maxLines: 6,
  });

  return (
    // ★ w-full を追加して、flex items-center の中でも幅いっぱいに広げる
    <div className="mb-4 relative w-full">
      {/* Bio 本文（左寄せ） */}
      <div
        ref={textRef}
        className="text-body-md text-foreground whitespace-pre-line transition-all duration-300 text-left"
        style={getTextStyle()}
      >
        {bio}
      </div>

      {/* Read More + グラデーション */}
      {showReadMore && !expanded && (
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          {/* ボタンはこの w-full コンテナ内で中央寄せ */}
          <div className="relative flex justify-center pt-8">
            <Button
              variant="tertiary"
              size="sm"
              onClick={toggleExpanded}
              className="bg-white px-6 pointer-events-auto"
            >
              <span className="text-label-sm font-bold">{t("users.profileHeader.readMore")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
