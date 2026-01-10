"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Gift } from "lucide-react";

const bonusSettings = [
  {
    title: "新規加入特典",
    href: "/admin/bonuses/signup",
    icon: Gift,
  },
];

export default function BonusesPage() {
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "特典管理",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <div className="space-y-2">
        {bonusSettings.map((item) => (
          <Card
            key={item.href}
            onClick={() => router.push(item.href)}
            className="cursor-pointer hover:bg-background-hover transition"
          >
            <CardHeader>
              <CardTitle className="text-body-sm font-bold flex items-center space-x-2">
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
