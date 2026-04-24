import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ communityId: string }>;
};

/**
 * 旧 `/sysAdmin/dashboard/[communityId]` を新 `/sysAdmin/[communityId]` に
 * リダイレクト。既存ブックマークや外部リンクの保険として残置。
 */
export default async function SysAdminCommunityDetailRedirect({ params }: Props) {
  const { communityId } = await params;
  redirect(`/sysAdmin/${communityId}`);
}
