import { fetchQuestDetail } from "./data/fetchQuestDetail";
import QuestDetailPageClient from "./components/QuestDetailPageClient";

interface QuestDetailPageProps {
  params: { id: string };
  searchParams: { community_id?: string };
}

export default async function QuestDetailPage({ params, searchParams }: QuestDetailPageProps) {
  const { id } = params;
  const { community_id } = searchParams;

  const questDetail = await fetchQuestDetail(id, community_id);

  return <QuestDetailPageClient questDetail={questDetail} />;
}
