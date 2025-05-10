'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prefectureLabels } from '@/presenters/user';
import { GqlCurrentPrefecture } from '@/types/graphql';

interface UserProfileHeaderProps {
  id: string;
  name: string;
  image: string;
  bio: string;
  currentPrefecture?: GqlCurrentPrefecture | null;
  isOwner: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  id,
  name,
  image,
  bio,
  currentPrefecture,
  isOwner
}) => {
  return (
    <div className="relative w-full bg-background rounded-b-3xl shadow-md pb-6 max-w-mobile-l mx-auto w-full">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={image || '/placeholder-profile.jpg'}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            {isOwner && (
              <Link href="/users/me/edit">
                <Button variant="secondary" size="sm">
                  編集
                </Button>
              </Link>
            )}
          </div>
          
          {currentPrefecture && (
            <div className="text-sm text-muted-foreground mb-2">
              {prefectureLabels[currentPrefecture] || '不明'}
            </div>
          )}
          
          {bio && (
            <div className="mt-2 text-foreground whitespace-pre-line">
              {bio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
