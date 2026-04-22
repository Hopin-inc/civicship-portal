import { expect, test } from "@playwright/test";

/**
 * SYS_ADMIN ダッシュボードの主要導線 E2E。
 *
 * 前提: 開発環境で SYS_ADMIN ロールのセッションが有効なこと
 * (E2E_SYS_ADMIN_COOKIE を storageState として設定、もしくは
 * 実行前に `/login` フローを完了させる)。ローカルで空セッション
 * のまま実行すると 8 行目の goto でログインにリダイレクトされ、
 * 以降が skip されるようガードしている。
 */
test.describe("sysAdmin dashboard", () => {
  test("navigates from list to L1 to L2 and toggles sort", async ({ page }) => {
    await page.goto("/sysAdmin");

    if (page.url().includes("/login")) {
      test.skip(true, "SYS_ADMIN session not available in this environment");
    }

    await page.getByRole("button", { name: /ダッシュボードへ/ }).click();
    await expect(page).toHaveURL(/\/sysAdmin\/dashboard/);

    // L1 — プラットフォーム KPI カード 3 枚
    await expect(page.getByText("コミュニティ数")).toBeVisible();
    await expect(page.getByText("今月の贈与ポイント")).toBeVisible();
    await expect(page.getByText("総メンバー数")).toBeVisible();

    // 任意の行をクリックして L2 に遷移
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    await expect(page).toHaveURL(/\/sysAdmin\/dashboard\/[^/]+$/);

    // L2 — KPI と chart
    await expect(page.getByText("活動率", { exact: true })).toBeVisible();
    await expect(page.getByText("ステージ分布")).toBeVisible();
    await expect(page.getByText("月次アクティビティ推移")).toBeVisible();
    await expect(page.getByText("メンバー一覧")).toBeVisible();

    // Sort ヘッダをクリックして順序反転、先頭行が入れ替わっているかをゆるく確認
    const sendRateHeader = page.getByRole("button", { name: /送付率/ });
    const firstMemberBefore = await page
      .locator("div[style*='flex-1']")
      .first()
      .textContent()
      .catch(() => null);
    await sendRateHeader.click();
    await page.waitForTimeout(500);
    const firstMemberAfter = await page
      .locator("div[style*='flex-1']")
      .first()
      .textContent()
      .catch(() => null);
    expect(firstMemberAfter).not.toBe(firstMemberBefore);
  });
});
