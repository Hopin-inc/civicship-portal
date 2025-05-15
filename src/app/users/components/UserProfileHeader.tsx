'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prefectureLabels } from '@/app/users/data/presenter';
import { GqlCurrentPrefecture } from '@/types/graphql';
import { Facebook, Home, Instagram, Twitter } from 'lucide-react';

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
  }
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  id,
  name,
  image,
  bio,
  currentPrefecture,
  isOwner,
  socialUrl
}) => {
  return (
    <div className="relative bg-white rounded-3xl shadow-sm p-6 max-w-mobile-l mx-auto w-full">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="flex items-center w-full mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={image || "/placeholder.png"}
              alt={name}
              fill
              className="object-cover"
              priority
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
              <div className="flex items-center justify-center text-label-md text-caption mb-3">
                <Home className="w-4 h-4 mr-1" />
                <span>{prefectureLabels[currentPrefecture] || "不明"}</span>
              </div>
            )}
          </div>

          {/* #TODO: SNS アカウントの取得結果に基づく描画に切り替える*/}
          <div className="flex items-center justify-center gap-2 ml-auto mb-4">
            {socialUrl?.facebook && (
              <a href={socialUrl.facebook} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="icon-only"
                  size="icon"
                  className="rounded-full border border-input w-10 h-10 flex items-center justify-center"
                >
                  <Facebook className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}

            {socialUrl?.instagram && (
              <a href={socialUrl.instagram} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="icon-only"
                  size="icon"
                  className="rounded-full border border-input w-10 h-10 flex items-center justify-center"
                >
                  <Instagram className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}

            {socialUrl?.x && (
              <a href={socialUrl.x} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="icon-only"
                  size="icon"
                  className="rounded-full border border-input w-10 h-10 flex items-center justify-center"
                >
                  <Twitter className="w-4 h-4 text-foreground" />
                </Button>
              </a>
            )}

          </div>
        </div>

        {bio && (
          <BioSection bio={bio} />
        )}
      </div>
    </div>
  );
};

const useReadMore = (maxLines = 6) => {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.clientHeight;
      const lines = Math.floor(height / lineHeight);
      setShowReadMore(lines > maxLines);
    }
  }, [maxLines]);

  const toggleExpanded = () => setExpanded(true);

  return {
    textRef,
    expanded,
    showReadMore,
    toggleExpanded,
    getTextClassName: (baseClassName: string) =>
      `${baseClassName} transition-all duration-300 ${!expanded && showReadMore ? `line-clamp-${maxLines}` : ''}`
  };
};

const BioSection = ({ bio }: { bio: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextClassName } = useReadMore(6);

  return (
    <div className="mb-4 relative">
      <div
        ref={textRef}
        className={getTextClassName("text-body-md text-foreground whitespace-pre-line")}
      >
        {bio}
      </div>
      {showReadMore && !expanded && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="relative flex justify-center pt-8">
            <Button
              variant="tertiary"
              size="sm"
              onClick={toggleExpanded}
              className="bg-white px-6"
            >
              <span className="text-label-sm font-bold">もっと見る</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
