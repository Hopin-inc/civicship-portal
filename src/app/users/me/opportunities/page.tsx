import { Card, CardContent } from "@/app/components/ui/card";

const MyPageOpportunities: React.FC = () => {
  // This is mock data. In a real application, you would fetch this from an API
  const activities = [
    {
      id: "1",
      name: "公園清掃",
      date: "2023-06-15",
      points: 50,
      community: "環境保護コミュニティ",
    },
    {
      id: "2",
      name: "高齢者支援",
      date: "2023-06-20",
      points: 75,
      community: "地域ボランティア部",
    },
    {
      id: "3",
      name: "プログラミング講座",
      date: "2023-06-25",
      points: 100,
      community: "プログラミング勉強会",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">活動一覧</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <h3 className="font-medium">{activity.name}</h3>
              <p className="text-sm text-muted-foreground">日付: {activity.date}</p>
              <p className="text-sm text-muted-foreground">コミュニティ: {activity.community}</p>
              <p className="text-sm font-semibold mt-1">獲得ポイント: {activity.points} pt</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPageOpportunities;
