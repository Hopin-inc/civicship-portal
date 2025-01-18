import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";

type Params = {
  id: string;
};

const CommunityRewards: React.FC<{ params: Params }> = ({ params }) => {
  // This is mock data. In a real application, you would fetch this from an API
  const rewards = [
    { id: "1", name: "エコバッグ", points: 100, description: "環境に優しい再利用可能なバッグ" },
    {
      id: "2",
      name: "ステンレスボトル",
      points: 200,
      description: "プラスチックを削減するための水筒",
    },
    {
      id: "3",
      name: "オーガニックTシャツ",
      points: 300,
      description: "環境に配慮した素材で作られたTシャツ",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">景品一覧</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <CardHeader>
              <CardTitle>{reward.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
              <p className="font-semibold">{reward.points} ポイント</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityRewards;
