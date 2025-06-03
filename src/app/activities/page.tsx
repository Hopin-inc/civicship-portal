import { getActivitiesData } from "@/app/activities/hooks/getActivitiesData";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ClientSideSections from "@/app/activities/components/ClientSideSections";
import HeaderConfig from "@/app/activities/components/HeaderConfig";
import EmptyState from "@/components/shared/EmptyState";

export default async function ActivitiesPage() {
  const { featuredCards } = await getActivitiesData();

  if (featuredCards.length === 0) {
    return <EmptyState title={"募集"} />;
  }

  return (
    <div className="min-h-screen">
      <HeaderConfig />
      <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={false} />
      <ClientSideSections />
    </div>
  );
}
