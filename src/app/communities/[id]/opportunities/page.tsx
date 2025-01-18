"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";

type Params = {
  id: string;
};

const CommunityOpportunities: React.FC<{ params: Params }> = ({ params }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // This is mock data. In a real application, you would fetch this from an API
  const activities = [
    { id: "1", name: "公園清掃", date: "2023-07-15", participants: 25, type: "作業" },
    { id: "2", name: "リサイクル講習会", date: "2023-07-22", participants: 40, type: "イベント" },
    { id: "3", name: "地域緑化プロジェクト", date: "2023-07-29", participants: 35, type: "作業" },
    { id: "4", name: "エコ料理教室", date: "2023-08-05", participants: 20, type: "イベント" },
    { id: "5", name: "海岸清掃", date: "2023-08-12", participants: 50, type: "作業" },
  ];

  return (
    <div className="relative min-h-full">
      <h2 className="text-xl font-semibold mb-4">活動一覧</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <Link href={`/activities/${activity.id}`} key={activity.id}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle>{activity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">日付: {activity.date}</p>
                <p className="text-sm">参加者数: {activity.participants}人</p>
                <p className="text-sm">種別: {activity.type}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">新しい活動を追加</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>活動新規登録</DialogTitle>
            <DialogDescription>新しい活動の詳細を入力してください。</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="activity-name">活動名</Label>
              <Input id="activity-name" placeholder="活動名を入力" />
            </div>
            <div>
              <Label htmlFor="activity-date">日付</Label>
              <Input id="activity-date" type="date" />
            </div>
            <div>
              <Label htmlFor="activity-participants">参加予定人数</Label>
              <Input id="activity-participants" type="number" min="1" />
            </div>
            <Button type="submit">登録</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityOpportunities;
