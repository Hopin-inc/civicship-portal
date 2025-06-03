"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prefectureLabels } from "@/app/users/data/presenter";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { Facebook, Home, Instagram, Twitter } from "lucide-react";
import { useReadMore } from "@/hooks/useReadMore";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface UserProfileHeaderProps {
  id: string;
  name: string;
  image: string;
  bio: string;
  currentPrefecture?: GqlCurrentPrefecture | null;
  isOwner: boolean;
  socialUrl: {
    x: string | null;
    instagram: string | null;
    facebook: string | null;
  };
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  id,
  name,
  image,
  bio,
  currentPrefecture,
  isOwner,
  socialUrl,
}) => {
  const socialButtonClasses =
    "rounded-full border border-input w-10 h-10 flex items-center justify-center";

  return (
    <div className="relative max-w-mobile-l mx-auto w-full">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="flex items-center w-full mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={image || PLACEHOLDER_IMAGE}
              alt={name}
              fill
              placeholder={"blur"}
              blurDataURL={PLACEHOLDER_IMAGE}
              className="object-cover"
              loading="lazy"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
          {isOwner && (
            <Link href="/users/me/edit" className="ml-auto">
              <Button variant="secondary" size="md" className="px-6">
                編集
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-start w-full">
          <div>
            <h1 className="text-title-lg mb-2">{name}</h1>

            {currentPrefecture && (
              <div className="flex items-center text-label-md text-caption mb-3">
                <Home className="w-4 h-4 mr-1" />
                <span>{prefectureLabels[currentPrefecture] || "不明"}</span>
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
};

const BioSection = ({ bio }: { bio: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: bio,
    maxLines: 6,
  });

  return (
    <div className="mb-4 relative">
      <div
        ref={textRef}
        className="text-body-md text-foreground whitespace-pre-line transition-all duration-300 text-left"
        style={getTextStyle()}
      >
        {bio}
      </div>
      {showReadMore && !expanded && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="relative flex justify-center pt-8">
            <Button variant="tertiary" size="sm" onClick={toggleExpanded} className="bg-white px-6">
              <span className="text-label-sm font-bold">もっと見る</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
