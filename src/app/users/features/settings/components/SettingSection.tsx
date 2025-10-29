import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Contact, Globe } from "lucide-react";
import Link from "next/link";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";

export default function SettingSection() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        {/* プロフィール設定 */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Contact className="w-5 h-5" />
            <span className="font-bold text-sm">プロフィール</span>
          </div>
          <Link
            href="/users/me/edit"
            className={cn(
              buttonVariants({ variant: "secondary", size: "md" }),
              "ml-auto text-black",
            )}
          >
            編集
          </Link>
        </div>

        {/* 言語切替 */}
        <div className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-bold text-sm">表示言語</span>
          </div>
          <LocaleSwitcher />
        </div>
      </CardContent>
    </Card>
  );
}
