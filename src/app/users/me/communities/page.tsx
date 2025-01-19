import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import React from "react";

const MyPageCommunities: React.FC = () => {
  // This is mock data. In a real application, you would fetch this from an API
  const communities = [
    {
      id: "1",
      name: "環境保護コミュニティ",
      image: "/placeholder.svg?height=40&width=40",
      members: 120,
    },
    {
      id: "2",
      name: "地域ボランティア部",
      image: "/placeholder.svg?height=40&width=40",
      members: 75,
    },
    {
      id: "3",
      name: "プログラミング勉強会",
      image: "/placeholder.svg?height=40&width=40",
      members: 50,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">所属コミュニティ一覧</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <Card key={community.id}>
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={community.image} alt={community.name} />
                <AvatarFallback>{community.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{community.name}</h3>
                <p className="text-sm text-muted-foreground">メンバー数: {community.members}</p>
              </div>
              <Link
                href={`/communities/${community.id}`}
                className="text-sm text-blue-500 hover:underline"
              >
                詳細
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPageCommunities;
