import { Card, CardContent } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export default function PromiseSection() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <Link href="/terms">
          <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
              <FileIcon className="w-5 h-5" />
              <span className="font-bold text-sm flex items-center gap-2">利用規約</span>
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
        {/* kibotcha専用の追加文書 */}
        {COMMUNITY_ID === "kibotcha" && (
          <>
            <a href="/communities/kibotcha/bylaws.pdf" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">定款 (PDF)</span>
                </div>
              </div>
            </a>

            <a
              href="/communities/kibotcha/operating-regulations.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">運営規程 (PDF)</span>
                </div>
              </div>
            </a>

            <a
              href="/communities/kibotcha/dao-meeting-rules.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">DAO総会規程 (PDF)</span>
                </div>
              </div>
            </a>

            <a
              href="/communities/kibotcha/token-regulations.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">トークン規程 (PDF)</span>
                </div>
              </div>
            </a>

            <a
              href="/communities/kibotcha/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center justify-between py-4 px-4 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">ホワイトペーパー (PDF)</span>
                </div>
              </div>
            </a>
          </>
        )}
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
