import { redirect } from "next/navigation";

type Params = {
  id: string;
};

const CommunityPage = ({ params }: Readonly<{ params: Params }>) => {
  redirect(`/communities/${params.id}/opportunities`);
};

export default CommunityPage;
