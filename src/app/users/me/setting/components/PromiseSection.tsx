import { Card, CardContent } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import Link from "next/link";

export default function PromiseSection() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
            <Link href="/terms">
                <div className="flex items-center justify-between py-4 px-4 border-b">
                    <div className="flex items-center gap-2">
                        <FileIcon className="w-5 h-5" />
                        <span className="font-bold text-sm flex items-center gap-2">
                            利用規約
                        </span>
                    </div>
                </div>
            </Link>
            <Link href="/privacy">
                <div className="flex items-center justify-between py-4 px-4 border-b">
                    <div className="flex items-center gap-2">
                        <FileIcon className="w-5 h-5" />
                        <span className="font-bold text-sm">プライバシーポリシー</span>
                    </div>
                </div>
            </Link>
            {/* TODO : 表示可能になるまでコメントアウト */}
            {/* <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    <span className="font-bold text-sm">Open Source Licence</span>
                </div>
            </div> */}
        </CardContent>
    </Card>
  );
}
