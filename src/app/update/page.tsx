"use client";

import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface UpdatePageProps {
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
  className?: string;
}

const defaultEntries: ChangelogEntry[] = [
  {
    version: "PR #558",
    date: "2025-11-07",
    title: "予約データの不整合を修正（ユーザー表示の改善）",
    description:
      "バッチ処理で発生していた予約と参加情報の不整合を修正しました。カレンダーや参加表示の誤りが減り、表示の信頼性が向上します。ユーザー側での操作は不要です。",
  },
  {
    version: "PR #548",
    date: "2025-11-06",
    title: "予約キャンセル後の表示を正しく反映",
    description:
      "予約キャンセル時に発生していた表示・状態の不整合を修正しました。キャンセル後の表示や集計が正しくなります。ユーザー操作は不要です。",
  },
  {
    version: "PR #542",
    date: "2025-11-05",
    title: "NFT 画像表示の信頼性改善（画像配信方式の変更）",
    description:
      "NFT 画像の取り扱いを改善し、Google Cloud Storage を利用する処理を導入しました。画像が表示されない事象が減り、コンテンツが安定して見られるようになります。",
  },
  {
    version: "PR #539",
    date: "2025-11-03",
    title: "DID/VC 同期の信頼性を向上（表示データの安定化）",
    description:
      "DID / VC 同期処理のログと自動復旧を強化し、同期失敗による表示欠損を減らしました。ユーザーに見えるデータの欠落が起きにくくなります。",
  },
  {
    version: "PR #538",
    date: "2025-11-03",
    title: "参加／予約の評価チェック誤判定を修正",
    description:
      "予約と参加の検証ロジックの誤判定を修正し、誤った状態表示や処理停止を防ぎます。ユーザーへの直接操作は必要ありません。",
  },
  {
    version: "PR #537",
    date: "2025-10-31",
    title: "予約申込締切のデフォルトを延長（運用変更）",
    description:
      "予約申込のデフォルト締切を開催日の 1 日前から 2 日前へ変更しました。予約可能期間が長くなります（影響範囲は予約機能）。",
  },
  {
    version: "PR #533",
    date: "2025-10-31",
    title: "予約―参加の整合性チェック誤検出を修正",
    description:
      "データ整合性チェックの誤検出を修正しました。誤ってエラーになるケースを減らし、表示や手続きが正しく進むようになりました。",
  },
  {
    version: "PR #532",
    date: "2025-10-30",
    title: "DID/VC 同期バッチの復旧力を強化",
    description:
      "同期バッチのエラー処理とリトライを改善し、同期失敗から自動的に回復しやすくしました。表示データの安定性が向上します。",
  },
  {
    version: "PR #529",
    date: "2025-10-30",
    title: "同期処理の 404 対応を改善",
    description:
      "同期中に起きていた 404 エラーの扱いを改善し、処理の途中停止を防ぎました。結果として一部データの未表示が減ります。",
  },
  {
    version: "PR #528",
    date: "2025-10-29",
    title: "ネットワークタイムアウト発生時の安定性改善",
    description:
      "ETIMEDOUT 発生時の無限リトライを防止し、システム全体の安定性を高めました。通常の利用者操作への影響はありませんが、サービスの信頼性が向上します。",
  },
  {
    version: "PR #527",
    date: "2025-10-29",
    title: "NFT メタデータ同期の失敗を減らす改善",
    description:
      "同期バッチに同期間隔とレート制御を導入し、外部 API 呼び出しの失敗や遅延を減らしました。NFT 表示の安定性が向上します。",
  },
  {
    version: "PR #526",
    date: "2025-10-29",
    title: "外部 NFT ウォレットの同期除外でノイズ削減",
    description:
      "外部の NFT ウォレットを同期対象から除外するフィルタを追加しました。不要な同期や誤表示が減ります。",
  },
  {
    version: "PR #521",
    date: "2025-10-26",
    title: "特定コミュニティ向けの表示問題を修正",
    description:
      "izu コミュニティで発生していたリッチメニューの不具合など、限定的な影響範囲の不具合を修正しました。該当ユーザーの表示体験が改善されます。",
  },
  {
    version: "PR #519",
    date: "2025-10-25",
    title: "ポイント寄付／付与時に LINE 通知を送信",
    description:
      "ポイントの寄付や付与が発生した際に LINE 通知を送る仕組みを追加しました。ユーザーに即時で通知が届き、アクションの確認がしやすくなります。",
  },
];

const UpdatePage = ({ entries = defaultEntries }: UpdatePageProps) => {
  const t = useTranslations();

  const headerConfig = useMemo(
    () => ({
      title: t("users.settings.pageTitle"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  return (
    <section className="px-6 py-4 md:py-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6 md:space-y-10">
          {entries.map((entry) => (
            <article key={entry.version} className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {entry.version}
                </Badge>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>

              {/* Title */}
              <h2 className="text-title-md font-semibold md:text-md">{entry.title}</h2>

              {/* Description */}
              <p className="text-xs text-muted-foreground md:text-xs">{entry.description}</p>

              {/* List */}
              {entry.items && (
                <ul className="ml-4 list-disc space-y-1.5 text-xs md:text-xs text-muted-foreground">
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpdatePage;
