import { Metadata } from "next";

export const metadata: Metadata = {
  title: "クエスト | Civicship",
  description: "地域のクエストを発見し、ポイントを獲得しながら地域貢献に参加しましょう。",
};

export default function QuestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
