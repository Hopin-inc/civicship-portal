import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { MapPin, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type Params = {
  id: string;
};

const CommunityLayout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) => {
  // This is mock data. In a real application, you would fetch this from an API
  const communityData = {
    id: params.id,
    name: "環境保護コミュニティ",
    image: "/placeholder.svg?height=300&width=800",
    location: "東京都渋谷区",
    members: [
      { id: "1", name: "山田太郎", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "佐藤花子", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "鈴木一郎", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "田中次郎", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "高橋三郎", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    totalMembers: 120,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-shrink-0">
        <div className="relative h-32 w-full">
          <Image
            src={communityData.image || "/placeholder.svg"}
            alt={communityData.name}
            fill
            className="object-cover"
          />
          <Button
            variant="text"
            size="icon"
            className="absolute top-2 left-2 bg-background/50 hover:bg-background/70"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">戻る</span>
            </Link>
          </Button>
        </div>
        <div className="p-3 bg-background">
          <h1 className="text-2xl font-bold mb-1">{communityData.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {communityData.location}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2 overflow-hidden">
              {communityData.members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="inline-block border-2 border-background w-6 h-6">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {communityData.totalMembers} メンバー
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="opportunities" asChild>
            <Link href={`/communities/${params.id}/opportunities`}>活動一覧</Link>
          </TabsTrigger>
          <TabsTrigger value="members" asChild>
            <Link href={`/communities/${params.id}/members`}>メンバー一覧</Link>
          </TabsTrigger>
          <TabsTrigger value="rewards" asChild>
            <Link href={`/communities/${params.id}/utilities`}>景品一覧</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-grow overflow-y-auto p-4">{children}</div>
    </div>
  );
};

export default CommunityLayout;
