import { fetchQuestDetail } from "./data/fetchQuestDetail";
import QuestDetailPageClient from "./components/QuestDetailPageClient";
import { COMMUNITY_ID } from "@/utils";

interface QuestDetailPageProps {
  params: { id: string };
}

export default async function QuestDetailPage({ params }: QuestDetailPageProps) {
  const { id } = params;
  const questDetail = await fetchQuestDetail(id, COMMUNITY_ID);

  return <QuestDetailPageClient questDetail={questDetail} />;
}
