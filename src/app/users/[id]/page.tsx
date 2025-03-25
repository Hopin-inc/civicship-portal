"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UserSocialLinks } from "@/components/features/user/UserSocialLinks";

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
};

// モックデータ
const MOCK_USER_PROFILE: UserProfile = {
  id: "1",
  firstName: "太郎",
  lastName: "山田",
  location: "香川",
  bio: "神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。神戸でIT会社に勤めつつ、週末は地元の人々と交流を深め... もっと見る",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(3).jpg-v7ifi1e9jgGZ756DbfeIZ8sO5wzaqA.jpeg",
  socialLinks: [
    { type: "twitter", url: "https://twitter.com/yamada" },
    { type: "github", url: "https://github.com/yamada" }
  ]
};

export default function UserPage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // モックデータを使用
  const userData = MOCK_USER_PROFILE;
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

        {/* 名前・場所とソーシャルリンク */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {`${userData.firstName} ${userData.lastName}`}
            </h1>
            {userData.location && (
              <div className="flex items-center text-gray-500">
                <span className="inline-block w-4 h-4">📍</span>
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
        </div>
      </div>
    </div>
  );
} 