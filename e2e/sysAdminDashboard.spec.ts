import { expect, test } from "@playwright/test";

/**
 * SYS_ADMIN ダッシュボードの主要導線 E2E (スケルトン)。
 *
 * 前提: 開発環境で SYS_ADMIN ロールのセッションが有効なこと
 * (E2E_SYS_ADMIN_COOKIE を storageState として設定、もしくは
 * 実行前に `/login` フローを完了させる)。ローカルで空セッション
 * のまま実行するとログインにリダイレクトされ、以降は skip される。
 *
 * Phase 2: storageState 仕込み / data-testid 付与 / waitForResponse の
 * 導入に合わせてこのスペック全体をリファクタ予定。
 */
test.describe("sysAdmin dashboard", () => {
  test("navigates from list to community detail and toggles sort", async ({ page }) => {
    await page.goto("/sysAdmin");

    if (page.url().includes("/login")) {
      test.skip(true, "SYS_ADMIN session not available in this environment");
    }

    // 統合一覧: 任意のコミュニティ行クリックで /sysAdmin/[communityId] に遷移
    const firstRow = page.getByRole("button").filter({ hasText: /./ }).first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    await expect(page).toHaveURL(/\/sysAdmin\/[^/]+$/);

    // L2 — chart セクション
    await expect(page.getByText("ステージ分布")).toBeVisible();
    await expect(page.getByText("月次アクティビティ推移")).toBeVisible();
    await expect(page.getByText("メンバー")).toBeVisible();

    // Member sort を切り替え (Phase 2 で role/testid ベースに置換予定)
    const sortSelect = page.getByLabel(/並び順/);
    if (await sortSelect.count()) {
      await sortSelect.first().click();
    }
  });
});
