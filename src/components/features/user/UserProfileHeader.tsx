'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prefectureLabels } from '@/utils/userUtils';
import { CurrentPrefecture } from '@/gql/graphql';

interface UserProfileHeaderProps {
  id: string;
  name: string;
  image: string;
  bio: string;
  currentPrefecture?: CurrentPrefecture | null;
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
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
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
                <Button variant="secondary" size="sm" className="mt-2 md:mt-0">
                  プロフィールを編集
                </Button>
              </Link>
            )}
          </div>
          
          {currentPrefecture && (
            <div className="text-sm text-gray-500 mb-2">
              {prefectureLabels[currentPrefecture] || '不明'}
            </div>
          )}
          
          {bio && (
            <div className="mt-2 text-gray-700 whitespace-pre-line">
              {bio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
