"use client";

import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UserSocialLinks } from "@/components/features/user/UserSocialLinks";
import { UserPortfolioList } from "@/app/components/features/user/UserPortfolioList";
import { GET_USER_PORTFOLIOS, GET_USER_WITH_DETAILS } from "@/graphql/queries/user";
import MapPinIcon from "@/../public/icons/map-pin.svg";
import TicketIcon from "@/../public/icons/ticket.svg";
import StarIcon from "@/../public/icons/star.svg";
import { format } from "date-fns";
import type { GetUserPortfoliosQuery, Portfolio as GqlPortfolio } from "@/gql/graphql";
import type { Portfolio, PortfolioType } from "@/types";

const ITEMS_PER_PAGE = 5;

const isValidPortfolioType = (category: string): category is PortfolioType => {
  return ['opportunity', 'activity_report', 'quest'].includes(category.toLowerCase());
};

export default function UserPage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  
  const { data, loading, error } = useQuery(GET_USER_WITH_DETAILS, {
    variables: { id: params.id },
    fetchPolicy: "network-only",
  });

  const { data: portfolioData, loading: portfolioLoading, error: portfolioError, fetchMore } = useQuery(GET_USER_PORTFOLIOS, {
    variables: { 
      id: params.id,
      first: ITEMS_PER_PAGE,
      after: null
    },
    fetchPolicy: "network-only",
  });

  console.log('PortfolioData', portfolioData);

  useEffect(() => {
    if (portfolioData?.user?.portfolios?.edges) {
      console.log('初期データを設定します:', {
        edgesCount: portfolioData.user.portfolios.edges.length,
        hasNextPage: portfolioData.user.portfolios.pageInfo.hasNextPage,
        pageInfo: portfolioData.user.portfolios.pageInfo
      });

      const initialPortfolios = portfolioData.user.portfolios.edges
        .map(edge => edge?.node)
        .filter((node): node is GqlPortfolio => node != null)
        .map(portfolio => {
          const category = portfolio.category.toLowerCase();
          if (!isValidPortfolioType(category)) {
            console.warn(`Invalid portfolio category: ${portfolio.category}`);
          }
          
          return {
            id: portfolio.id,
            type: category as PortfolioType,
            title: portfolio.title,
            date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
            location: portfolio.place?.name ?? null,
            category: portfolio.category,
            participants: portfolio.participants.map(p => ({
              id: p.id,
              name: p.name,
              image: p.image ?? null
            })),
            image: portfolio.thumbnailUrl ?? null,
            source: portfolio.source
          } satisfies Portfolio;
        });
      
      setPortfolios(initialPortfolios);
      setHasMore(portfolioData.user.portfolios.pageInfo.hasNextPage);
      console.log('初期データの設定が完了しました:', {
        portfoliosCount: initialPortfolios.length,
        hasMore: portfolioData.user.portfolios.pageInfo.hasNextPage
      });
    }
  }, [portfolioData]);

  // 無限スクロール用のIntersectionObserver設定
  useEffect(() => {
    console.log('IntersectionObserverを設定します...', {
      hasMore,
      isLoadingMore,
      portfoliosCount: portfolios.length
    });
    observer.current = new IntersectionObserver(
      (entries) => {
        console.log('IntersectionObserverが発火しました:', {
          isIntersecting: entries[0].isIntersecting,
          hasMore,
          isLoadingMore,
          portfoliosCount: portfolios.length
        });
        
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPortfolioRef.current) {
      observer.current.observe(lastPortfolioRef.current);
      console.log('lastPortfolioRefを監視開始');
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
    console.log('loadMore called', {
      hasMore,
      isLoadingMore,
      portfoliosCount: portfolios.length
    });

    if (!hasMore || isLoadingMore) {
      console.log('loadMore skipped:', {
        hasMore,
        isLoadingMore
      });
      return;
    }

    console.log('追加データの読み込みを開始します...', {
      currentPortfoliosCount: portfolios.length,
      lastPortfolioId: portfolios[portfolios.length - 1]?.id
    });

    setIsLoadingMore(true);
    const lastPortfolio = portfolios[portfolios.length - 1];
    const lastCursor = portfolioData?.user?.portfolios?.edges?.find(
      edge => edge?.node?.id === lastPortfolio.id
    )?.cursor;

    console.log('カーソル情報:', {
      lastPortfolioId: lastPortfolio.id,
      lastCursor
    });

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
          .map(portfolio => {
            const category = portfolio.category.toLowerCase();
            if (!isValidPortfolioType(category)) {
              console.warn(`Invalid portfolio category: ${portfolio.category}`);
            }
            
            return {
              id: portfolio.id,
              type: category as PortfolioType,
              title: portfolio.title,
              date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
              location: portfolio.place?.name ?? null,
              category: portfolio.category,
              participants: portfolio.participants.map(p => ({
                id: p.id,
                name: p.name,
                image: p.image ?? null
              })),
              image: portfolio.thumbnailUrl ?? null,
              source: portfolio.source
            } satisfies Portfolio;
          });

        console.log('新しいデータを取得しました:', {
          newPortfoliosCount: newPortfolios.length,
          hasMore: moreData.user.portfolios.pageInfo.hasNextPage,
          pageInfo: moreData.user.portfolios.pageInfo
        });

        setPortfolios(prev => [...prev, ...newPortfolios]);
        setHasMore(moreData.user.portfolios.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error('追加データの読み込み中にエラーが発生しました:', error);
    } finally {
      setIsLoadingMore(false);
      console.log('追加データの読み込みが完了しました');
    }
  }, [fetchMore, hasMore, isLoadingMore, params.id, portfolios, portfolioData]);

  if (loading || portfolioLoading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  if (error || portfolioError) {
    return <div className="container mx-auto px-4 py-6">Error: {error?.message || portfolioError?.message}</div>;
  }

  if (!data?.user) {
    return <div className="container mx-auto px-4 py-6">User not found</div>;
  }

  const userData = data.user;
  const isOwner = true;

  const handleUpdateSocialLinks = async (socialLinks: { type: string; url: string }[]) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  const truncateBio = (bio: string | null | undefined) => {
    if (!bio) return "";
    return isExpanded ? bio : bio.slice(0, 100);
  };

  const shouldShowMore = (bio: string | null | undefined) => {
    return bio ? bio.length > 100 : false;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="w-20 h-20 relative">
            <Image
              src={userData.image || "/placeholder.svg"}
              alt={userData.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          {isOwner && (
            <button className="px-6 py-2 bg-gray-100 rounded-lg text-sm">
              編集
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {userData.name}
            </h1>
          </div>
          <UserSocialLinks
            user={userData}
            className="gap-4"
            isOwner={isOwner}
            onUpdate={isOwner ? handleUpdateSocialLinks : undefined}
          />
        </div>

        <div className="text-gray-600 text-base leading-relaxed">
          <p className="whitespace-pre-wrap">
            {truncateBio(userData.bio)}
            {shouldShowMore(userData.bio) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 ml-1 inline-flex items-center"
              >
                {!isExpanded ? "...もっと見る" : "閉じる"}
              </button>
            )}
          </p>

          {/* チケットとポイント情報 */}
          <div className="space-y-2 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">利用可能なチケットが<span className="font-bold">0</span>枚あります。</span>
              </div>
              <span className="text-blue-600">›</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                <span>保有中のポイント</span>
                <span className="font-bold">0pt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserPortfolioList 
        userId={params.id} 
        isOwner={isOwner} 
        portfolios={portfolios}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        lastPortfolioRef={lastPortfolioRef}
      />
    </div>
  );
} 