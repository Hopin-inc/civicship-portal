"use client";

import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/app/components/features/user/UserProfile";
import { UserPortfolioList } from "@/app/components/features/user/UserPortfolioList";
import { GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from "@/graphql/queries/user";
import { GET_USER_WALLET } from "@/graphql/queries/user";
import StarIcon from "@/../public/icons/star.svg";
import { format } from "date-fns";
import type { GetUserWithDetailsAndPortfoliosQuery, Portfolio as GqlPortfolio, GetUserWalletQuery } from "@/gql/graphql";
import type { Portfolio, PortfolioType, PortfolioCategory, ReservationStatus } from "@/types";
import Link from 'next/link';
import { Ticket as TicketIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 30;

const isValidPortfolioType = (category: string): category is PortfolioType => {
  return ['opportunity', 'activity_report', 'quest'].includes(category.toLowerCase());
};

const isValidPortfolioCategory = (category: string): category is PortfolioCategory => {
  return ['QUEST', 'ACTIVITY_REPORT', 'INTERVIEW', 'OPPORTUNITY'].includes(category.toUpperCase());
};

const transformPortfolio = (portfolio: GqlPortfolio): Portfolio => {
  const category = portfolio.category.toLowerCase();
  if (!isValidPortfolioType(category)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }

  const portfolioCategory = portfolio.category.toUpperCase();
  if (!isValidPortfolioCategory(portfolioCategory)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }
  
  return {
    id: portfolio.id,
    type: category as PortfolioType,
    title: portfolio.title,
    date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
    location: portfolio.place?.name ?? null,
    category: portfolioCategory as PortfolioCategory,
    reservationStatus: portfolio.reservationStatus as ReservationStatus | null | undefined,
    participants: portfolio.participants.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image ?? null
    })),
    image: portfolio.thumbnailUrl ?? null,
    source: portfolio.source
  };
};

export default function MyProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  
  const { data, loading, error, fetchMore } = useQuery(GET_USER_WITH_DETAILS_AND_PORTFOLIOS, {
    variables: { 
      id: currentUser?.id ?? "",
      first: ITEMS_PER_PAGE,
      after: null
    },
    skip: !currentUser,
    fetchPolicy: "network-only",
  });

  const { data: walletData } = useQuery<GetUserWalletQuery>(GET_USER_WALLET, {
    variables: {
      id: currentUser?.id ?? "",
    },
    skip: !currentUser,
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login?next=/users/me');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (data?.user?.portfolios?.edges) {
      const initialPortfolios = data.user.portfolios.edges
        .map(edge => edge?.node)
        .filter((node): node is GqlPortfolio => node != null)
        .map(transformPortfolio);
      
      setPortfolios(initialPortfolios);
      setHasMore(data.user.portfolios.pageInfo.hasNextPage);
    }
  }, [data]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPortfolioRef.current) {
      observer.current.observe(lastPortfolioRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, portfolios.length]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !currentUser) return;

    setIsLoadingMore(true);
    const lastPortfolio = portfolios[portfolios.length - 1];
    const lastCursor = data?.user?.portfolios?.edges?.find(
      edge => edge?.node?.id === lastPortfolio.id
    )?.cursor;

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          id: currentUser.id,
          first: ITEMS_PER_PAGE,
          after: lastCursor
        }
      });

      if (moreData?.user?.portfolios?.edges) {
        const newPortfolios = moreData.user.portfolios.edges
          .map(edge => edge?.node)
          .filter((node): node is GqlPortfolio => node != null)
          .map(transformPortfolio);

        setPortfolios(prev => [...prev, ...newPortfolios]);
        setHasMore(moreData.user.portfolios.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more portfolios:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, hasMore, isLoadingMore, currentUser?.id, portfolios, data]);

  if (!currentUser || loading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error?.message}</div>;
  }

  if (!data?.user) {
    return <div className="container mx-auto px-4 py-6">User not found</div>;
  }

  const handleUpdateSocialLinks = async (socialLinks: { type: string; url: string }[]) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <UserProfile
        user={{
          id: data.user.id,
          name: data.user.name,
          image: data.user.image ?? null,
          bio: data.user.bio ?? null,
          currentPrefecture: data.user.currentPrefecture ?? null,
          socialLinks: [
            { type: 'facebook', url: data.user.urlFacebook ?? null },
            { type: 'instagram', url: data.user.urlInstagram ?? null },
            { type: 'website', url: data.user.urlWebsite ?? null },
            { type: 'x', url: data.user.urlX ?? null },
            { type: 'youtube', url: data.user.urlYoutube ?? null }
          ]
        }}
        isOwner={true}
        onUpdateSocialLinks={handleUpdateSocialLinks}
      />

      {/* チケットとポイント情報 */}
      <div className="space-y-2 mt-8">
        <Link href="/tickets">
          <div className="bg-[#EEF0FF] p-4 rounded-lg flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <TicketIcon className="w-4 h-4 text-[#4361EE]" />
              <span className="text-[#4361EE]">
                利用可能なチケットが
                <span className="font-bold">
                  {walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0}
                </span>
                枚あります。
              </span>
            </div>
            <span className="text-[#4361EE]">›</span>
          </div>
        </Link>
        <Link href="/wallets">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4" />
              <span>保有ポイント</span>
              <span className="font-bold">
                {walletData?.user?.wallets?.edges?.[0]?.node?.currentPointView?.currentPoint || 0}pt
              </span>
            </div>
            <span className="text-gray-500">›</span>
          </div>
        </Link>
      </div>

      <UserPortfolioList 
        userId={currentUser.id} 
        isOwner={true} 
        portfolios={portfolios}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        lastPortfolioRef={lastPortfolioRef}
      />
    </div>
  );
}
