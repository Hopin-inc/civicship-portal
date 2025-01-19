import { Card, CardContent } from "@/app/components/ui/card";

const MyPageTransactions: React.FC = () => {
  // This is mock data. In a real application, you would fetch this from an API
  const pointHistory = [
    { id: "1", description: "公園清掃参加", date: "2023-06-15", points: 50, type: "獲得" },
    { id: "2", description: "高齢者支援活動", date: "2023-06-20", points: 75, type: "獲得" },
    { id: "3", description: "エコバッグと交換", date: "2023-06-22", points: -100, type: "使用" },
    {
      id: "4",
      description: "プログラミング講座開催",
      date: "2023-06-25",
      points: 100,
      type: "獲得",
    },
    {
      id: "5",
      description: "コミュニティ貢献ボーナス",
      date: "2023-06-30",
      points: 200,
      type: "獲得",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">ポイント履歴</h2>
      <div className="space-y-4">
        {pointHistory.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <h3 className="font-medium">{entry.description}</h3>
              <p className="text-sm text-muted-foreground">日付: {entry.date}</p>
              <p
                className={`text-sm font-semibold ${entry.type === "獲得" ? "text-green-600" : "text-red-600"}`}
              >
                {entry.type === "獲得" ? "+" : "-"}
                {Math.abs(entry.points)} pt
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPageTransactions;
