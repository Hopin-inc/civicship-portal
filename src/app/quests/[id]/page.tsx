import { redirect } from "next/navigation";

interface QuestDetailPageProps {
  params: { id: string };
}

export default function QuestDetailRedirect({ params }: QuestDetailPageProps) {
  redirect(`/opportunities/${params.id}`);
}
