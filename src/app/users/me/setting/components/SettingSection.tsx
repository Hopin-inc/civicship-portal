import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function SettingSection() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/icons/profile-Icon.svg" alt="プロフィール" width={20} height={20} />
            <span className="font-bold text-sm">プロフィール</span>
          </div>
            <Link
                href="/users/me/edit"
                className={cn(buttonVariants({ variant: "secondary", size: "md" }), "ml-auto text-black")}
                >
                編集
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
