"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UserSocialLinks } from "@/components/features/user/UserSocialLinks";
import { UserActivityList } from "@/components/features/user/UserActivityList";
import { GET_USER_WITH_DETAILS } from "@/graphql/queries/user";
import MapPinIcon from "@/../public/icons/map-pin.svg";
import TicketIcon from "@/../public/icons/ticket.svg";
import StarIcon from "@/../public/icons/star.svg";

// 活動データの型定義
type Participation = {
  id: string;
  type: 'participation';
  title: string;
  date: string;
  location: string;
  category: '体験' | 'クエスト' | 'イベント';
  participants: { id: string; image: string }[];
  image: string;
};

type Article = {
  id: string;
  type: 'article';
  title: string;
  date: string;
  location: string;
  category: '記事';
  author: { id: string; image: string };
  image: string;
};

type ActivityItem = Participation | Article;

// モックデータ
const MOCK_USER_DATA = {
  location: "香川",
  socialLinks: [
    { type: "twitter", url: "https://twitter.com/yamada" },
    { type: "github", url: "https://github.com/yamada" }
  ],
  tickets: 2,
  currentPoint: 500
};

// モック活動データ
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'participation',
    title: '解体屋さんから廃材を授かる会',
    date: '2023/05/15',
    location: '香川県高松市',
    category: '体験',
    participants: [
      { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
      { id: '2', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
      { id: '3', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' },
    ],
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    type: 'participation',
    title: '空き家庭園の緑化Day',
    date: '2023/04/15',
    location: '徳島県徳島市',
    category: 'クエスト',
    participants: [
      { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4' },
      { id: '2', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5' },
      { id: '3', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6' },
    ],
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    type: 'article',
    title: '伝統を守り続ける職人の想い',
    date: '2023/04/15',
    location: '高知県高知市',
    category: '記事',
    author: { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1' },
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    type: 'participation',
    title: '地域の夏祭り運営ボランティア',
    date: '2023/07/20',
    location: '香川県高松市',
    category: 'イベント',
    participants: [
      { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7' },
      { id: '2', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8' },
      { id: '3', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9' },
      { id: '4', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10' },
      { id: '5', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user11' },
    ],
    image: 'https://images.unsplash.com/photo-1529973625058-a665431328fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
];

export default function UserPage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data, loading, error } = useQuery(GET_USER_WITH_DETAILS, {
    variables: { id: params.id },
  });

  console.log('UserData', data);

  // ローディング中の表示
  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  // エラー時の表示
  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error.message}</div>;
  }

  // データが取得できない場合
  if (!data?.user) {
    return <div className="container mx-auto px-4 py-6">User not found</div>;
  }

  const userData = data.user;
  const activities = MOCK_ACTIVITIES;
  const isOwner = true;

  const handleUpdateSocialLinks = async (socialLinks: { type: string; url: string }[]) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  // bioの表示制御
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

        {/* Bio */}
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

      <UserActivityList userId={params.id} isOwner={isOwner} />
    </div>
  );
} 