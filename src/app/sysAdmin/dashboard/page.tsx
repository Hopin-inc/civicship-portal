import { redirect } from "next/navigation";

/**
 * `/sysAdmin/dashboard` は `/sysAdmin` にコミュニティ一覧 (旧 dashboard) を
 * 統合したため、旧 URL へのアクセスはトップにリダイレクトさせる。
 * 既存のブックマークや外部リンクの保険として残置。
 */
export default function SysAdminDashboardRedirect() {
  redirect("/sysAdmin");
}
