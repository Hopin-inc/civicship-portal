"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UserSocialLinks } from "@/components/features/user/UserSocialLinks";
import { UserActivityList } from "@/components/features/user/UserActivityList";
import MapPinIcon from "@/../public/icons/map-pin.svg";
import TicketIcon from "@/../public/icons/ticket.svg";
import StarIcon from "@/../public/icons/star.svg";

// モックデータの型定義
type UserProfile = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  bio?: string;
  image?: string;
  location?: string;
  socialLinks: {
    type: string;
    url: string;
  }[];
  tickets: number;
  currentPoint: number;
};

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
const MOCK_USER_PROFILE: UserProfile = {
  id: "1",
  firstName: "太郎",
  lastName: "山田",
  location: "香川",
  bio: "神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(3).jpg-v7ifi1e9jgGZ756DbfeIZ8sO5wzaqA.jpeg",
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
  
  // モックデータを使用
  const userData = MOCK_USER_PROFILE;
  const activities = MOCK_ACTIVITIES;
  const isOwner = currentUser?.id === userData.id;

  const handleUpdateSocialLinks = async (socialLinks: typeof userData.socialLinks) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  // bioの表示制御
  const truncateBio = (bio: string) => {
    if (!bio) return "";
    return isExpanded ? bio : bio.slice(0, 100);
  };

  const shouldShowMore = (bio?: string) => {
    return bio ? bio.length > 100 : false;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="space-y-6">
        {/* ヘッダー部分: 画像と編集ボタン */}
        <div className="flex justify-between items-start">
          <div className="w-20 h-20 relative">
            <Image
              src={userData.image || "/placeholder.svg"}
              alt={`${userData.firstName} ${userData.lastName}`}
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
              {`${userData.firstName} ${userData.lastName}`}
            </h1>
            {userData.location && (
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm">{userData.location}</span>
              </div>
            )}
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
            {truncateBio(userData.bio || "")}
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
                <span className="text-blue-600">利用可能なチケットが<span className="font-bold">{userData.tickets}</span>枚あります。</span>
              </div>
              <span className="text-blue-600">›</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                <span>保有中のポイント</span>
                <span className="font-bold">{userData.currentPoint}pt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserActivityList activities={activities} isOwner={isOwner} />
    </div>
  );
} 