'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Community {
  id: string;
  name: string;
  image: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  price: number | null;
  location: string;
  imageUrl: string | null;
  community: Community | null;
  isReservableWithTicket?: boolean | null;
}

interface UserActiveOpportunitiesProps {
  opportunities: Opportunity[];
  isOwner: boolean;
  onCreateOpportunity?: () => void;
}

export const UserActiveOpportunities: React.FC<UserActiveOpportunitiesProps> = ({
  opportunities,
  isOwner,
  onCreateOpportunity
}) => {
  if (opportunities.length === 0) {
    if (isOwner) {
      return (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">主催中の体験</h2>
            {onCreateOpportunity && (
              <Button 
                onClick={onCreateOpportunity}
                variant="tertiary"
                size="sm"
                className="bg-white hover:bg-gray-50"
              >
                体験を作成
              </Button>
            )}
          </div>
          <p className="text-gray-500 text-sm">主催中の体験はありません</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">主催中の体験</h2>
        {isOwner && onCreateOpportunity && (
          <Button 
            onClick={onCreateOpportunity}
            variant="tertiary"
            size="sm"
            className="bg-white hover:bg-gray-50"
          >
            体験を作成
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opportunity) => (
          <Link key={opportunity.id} href={`/activities/${opportunity.id}`}>
            <div className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative w-full h-40">
                <Image
                  src={opportunity.imageUrl || '/placeholder-activity.jpg'}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{opportunity.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {opportunity.location}
                  </div>
                  <div className="text-sm font-semibold">
                    {opportunity.price ? `${opportunity.price.toLocaleString()}円` : '無料'}
                    {opportunity.isReservableWithTicket && (
                      <span className="ml-1 text-blue-600">
                        (チケット可)
                      </span>
                    )}
                  </div>
                </div>
                {opportunity.community && (
                  <div className="flex items-center mt-2">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden mr-2">
                      <Image
                        src={opportunity.community.image || '/placeholder-community.jpg'}
                        alt={opportunity.community.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-500">{opportunity.community.name}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserActiveOpportunities;
