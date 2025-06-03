import { fetchInitialActivities } from "./data/fetchActivities";
import ActivitiesPageClient from "./components/ActivitiesPageClient";

export default async function ActivitiesPage() {
  const initialData = await fetchInitialActivities();
  return <ActivitiesPageClient initialData={initialData} />;
}
