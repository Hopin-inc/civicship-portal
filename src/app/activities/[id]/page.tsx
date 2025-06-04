import { redirect } from "next/navigation";

interface ActivityDetailPageProps {
  params: { id: string };
}

export default function ActivityDetailRedirect({ params }: ActivityDetailPageProps) {
  redirect(`/opportunities/${params.id}`);
}
