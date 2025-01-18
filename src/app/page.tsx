import Link from "next/link";
import CommunityCard from "@/app/_components/elements/CommunityCard";

const Home: React.FC = async () => {
  // This is mock data. In a real application, you would fetch this from an API
  const communities = [
    {
      id: "1",
      name: "環境保護コミュニティ",
      image: "/placeholder.svg?height=200&width=400",
      location: "東京都渋谷区",
      members: [
        { id: "1", name: "山田太郎", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", name: "佐藤花子", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", name: "鈴木一郎", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      totalMembers: 120,
    },
    {
      id: "2",
      name: "地域ボランティア部",
      image: "/placeholder.svg?height=200&width=400",
      location: "大阪府大阪市",
      members: [
        { id: "4", name: "田中次郎", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "5", name: "高橋三郎", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      totalMembers: 75,
    },
    {
      id: "3",
      name: "プログラミング勉強会",
      image: "/placeholder.svg?height=200&width=400",
      location: "福岡県福岡市",
      members: [
        { id: "6", name: "伊藤四郎", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "7", name: "渡辺五郎", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "8", name: "小林六郎", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "9", name: "加藤七子", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "10", name: "吉田八郎", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      totalMembers: 200,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">コミュニティ一覧</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <Link key={community.id} href={`/communities/${community.id}`}>
            <CommunityCard {...community} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
