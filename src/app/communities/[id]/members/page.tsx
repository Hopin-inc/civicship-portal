import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Card, CardContent } from "@/app/_components/ui/card";

type Params = {
  id: string;
};

const CommunityMembers: React.FC<{ params: Params }> = ({ params }) => {
  // This is mock data. In a real application, you would fetch this from an API
  const members = [
    { id: "1", name: "山田太郎", avatar: "/placeholder.svg?height=100&width=100", role: "管理者" },
    {
      id: "2",
      name: "佐藤花子",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "メンバー",
    },
    {
      id: "3",
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "メンバー",
    },
    {
      id: "4",
      name: "田中次郎",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "メンバー",
    },
    {
      id: "5",
      name: "高橋三郎",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "メンバー",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">メンバー一覧</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityMembers;
