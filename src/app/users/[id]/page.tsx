"use client";

import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/app/components/features/user/UserProfile";
import { UserPortfolioList } from "@/app/components/features/user/UserPortfolioList";
import { GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from "@/graphql/queries/user";
import MapPinIcon from "@/../public/icons/map-pin.svg";
import TicketIcon from "@/../public/icons/ticket.svg";
import StarIcon from "@/../public/icons/star.svg";
import { format } from "date-fns";
import type { GetUserWithDetailsAndPortfoliosQuery, Portfolio as GqlPortfolio } from "@/gql/graphql";
import type { Portfolio, PortfolioType, PortfolioCategory, ReservationStatus } from "@/types";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 30;
const BIO_TRUNCATE_LENGTH = 100;

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

export default function UserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  
  const { data, loading, error, fetchMore } = useQuery(GET_USER_WITH_DETAILS_AND_PORTFOLIOS, {
    variables: { 
      id: params.id,
      first: ITEMS_PER_PAGE,
      after: null
    },
    fetchPolicy: "network-only",
  });

  console.log('Portfolios', data?.user?.portfolios?.edges);
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
    } else {
      console.log('lastPortfolioRefが未設定です');
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, portfolios.length]);

  const loadMore = useCallback(async () => {

    if (!hasMore || isLoadingMore) {
      console.log('loadMore skipped:', {
        hasMore,
        isLoadingMore
      });
      return;
    }

    setIsLoadingMore(true);
    const lastPortfolio = portfolios[portfolios.length - 1];
    const lastCursor = data?.user?.portfolios?.edges?.find(
      edge => edge?.node?.id === lastPortfolio.id
    )?.cursor;

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          id: params.id,
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
        
        const newHasMore = moreData.user.portfolios.pageInfo.hasNextPage;
        setHasMore(newHasMore);
      }
    } catch (error) {
      console.error('追加データの読み込み中にエラーが発生しました:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, hasMore, isLoadingMore, params.id, portfolios, data]);

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error?.message}</div>;
  }

  if (!data?.user) {
    return <div className="container mx-auto px-4 py-6">User not found</div>;
  }

  const userData = data.user;
  const isOwner = currentUser?.id === params.id;

  const activeOpportunities = userData.opportunitiesCreatedByMe?.edges?.map(edge => {
    const node = edge?.node;
    if (!node) return null;
    return {
      id: node.id,
      title: node.title,
      price: node.feeRequired ?? null,
      location: node.place?.name ?? '',
      imageUrl: node.images?.[0] ?? null,
      community: node.community,
      isReservableWithTicket: node.isReservableWithTicket
    };
  }).filter(Boolean) ?? [];

  const handleUpdateSocialLinks = async (socialLinks: { type: string; url: string }[]) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <UserProfile
        user={{
          id: userData.id,
          name: userData.name,
          image: userData.image ?? null,
          bio: userData.bio ?? null,
          currentPrefecture: userData.currentPrefecture ?? null,
          socialLinks: [
            { type: 'facebook', url: userData.urlFacebook ?? null },
            { type: 'instagram', url: userData.urlInstagram ?? null },
            { type: 'website', url: userData.urlWebsite ?? null },
            { type: 'x', url: userData.urlX ?? null },
            { type: 'youtube', url: userData.urlYoutube ?? null }
          ]
        }}
        isOwner={isOwner}
        onUpdateSocialLinks={handleUpdateSocialLinks}
      />

      <UserPortfolioList 
        userId={params.id} 
        isOwner={isOwner} 
        portfolios={portfolios}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={userData.sysRole === 'SYS_ADMIN'}
        activeOpportunities={activeOpportunities}
      />
    </div>
  );
} 