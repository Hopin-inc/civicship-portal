import { redirect } from "next/navigation";

/**
 * `/sysAdmin/system` への直アクセスを `/sysAdmin/system/templates` に
 * リダイレクトする。
 *
 * このファイルが無いと Next.js の動的ルート `[communityId]` が
 * `/sysAdmin/system` を拾ってしまい、`analyticsCommunity({ communityId: "system" })`
 * を叩いて `Community not found (id: system)` で 500 を吐く。
 *
 * システム設定 hub を将来追加する場合はこの redirect を hub ページに置き換える。
 */
export default function SysAdminSystemRedirectPage() {
  redirect("/sysAdmin/system/templates");
}
