<a id="en"></a>

# Security Audit — What Changed in the Code

*English below · [日本語は下段へ](#ja)*


- [Hexens](https://hexens.io/) assessed the civicship platform, September–December
  2025
- Ten findings: 0 critical, 2 high, 3 medium, 2 low, 3 informational
- Hexens records eight as *Fixed* and two as *Acknowledged*, and its executive
  summary states that the issues "have been remediated after testing"
- **[The report](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)**
  carries each finding, its severity and the status Hexens recorded for it
- This page records what changed in the code

## Scope

- The audit targeted the NEO88 deployment, but its scope was the
  `civicship-portal` and `civicship-api` repositories and their workflows
- Every community runs the same codebase, so the fixes below are in shared code
  rather than in one environment
- The findings and the fixes below concern the codebase Hexens assessed,
  September–December 2025
- HOPIN-3 was fixed after the report was issued, so its entry below describes the
  current source

## What changed, by finding

### HOPIN-1 · SSRF via the Next.js image handler

- `next.config.mjs` declares an explicit `remotePatterns` allow-list, so
  arbitrary hosts are rejected

### HOPIN-2 · Reflected XSS via a Cloud Storage bucket

- `src/app/api/image-proxy/route.ts` checks the request against an explicit
  `ALLOWED_BUCKETS` list and returns `403` for anything else

### HOPIN-6 · Timing attack in the admin API key check

- The admin API key path was removed from the authentication middleware during a
  later refactor, so the comparison no longer exists

### HOPIN-4 · Missing Content-Security-Policy header

- A CSP is set per request in `src/middleware.ts`, using a per-request nonce

### HOPIN-7 · Long-lived GCP service account credentials

- Both repositories authenticate through Workload Identity Federation
  (`workload_identity_provider`)
- No service account JSON key is stored in either repository's secrets

### HOPIN-8 · Floating action versions

- Third-party actions are pinned to immutable commit SHAs, except
  `google-github-actions/setup-gcloud` and `google-github-actions/deploy-cloudrun`
  in the portal deploy workflow, which remain on a major-version tag

### HOPIN-9 · Lockfile integrity not enforced

- Dependency installation uses `pnpm install --frozen-lockfile`

### HOPIN-11 · Missing Strict-Transport-Security header

- HSTS is set in `next.config.mjs`

### HOPIN-3 · PII exposure through an alternative GraphQL path

- `phoneNumber` is served by a field resolver that returns `null` unless the
  caller is permitted to see it
- The field is therefore protected on every path that reaches a user, not only on
  the `users` query

### HOPIN-10 · Workflows may trigger on direct push without review

- Hexens recorded this one as *Acknowledged*
- Production deploys run on a push to `master` (portal) and on a pull request
  merged into `master` (API); `master` and `develop` are protected branches
- The development deploys also run on a push to `epic/**` or `hotfix/**`, and
  those branches are not protected

## Reporting a vulnerability

- [`public/.well-known/security.txt`](../../../public/.well-known/security.txt)

---
---

<a id="ja"></a>

# セキュリティ監査 — コードで何を変更したか

*[English is above](#en)*

- [Hexens](https://hexens.io/) が2025年9〜12月に civicship プラットフォームを評価した
- 指摘は10件（Critical 0、High 2、Medium 3、Low 2、Informational 3）
- Hexens は8件を *Fixed*、2件を *Acknowledged* と記録しており、Executive Summary には
  各指摘が「テスト後に修正された（have been remediated after testing）」と記載されている
- 各指摘・重大度・ステータスは
  **[レポート](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)**
  に記載
- 本ページはコードで何を変更したかを記録する

## 監査の範囲

- 監査対象は NEO88 の環境だが、監査範囲は `civicship-portal` と `civicship-api` の
  リポジトリおよびそのワークフローである
- すべてのコミュニティは同一のコードベースで動作しているため、以下の修正は特定環境では
  なく共有コードに存在する
- 以下の指摘と修正は、Hexens が評価した2025年9〜12月時点のコードベースを対象とする
- HOPIN-3 の修正はレポート発行後に入ったため、同項目は現在のソースコードについて記載
  している

## 指摘ごとの変更内容

### HOPIN-1 · Next.js 画像ハンドラ経由の SSRF

- `next.config.mjs` で `remotePatterns` による明示的な許可リストを宣言し、任意のホストを
  拒否するようにした

### HOPIN-2 · Cloud Storage バケット経由の反射型 XSS

- `src/app/api/image-proxy/route.ts` が明示的な `ALLOWED_BUCKETS` リストと照合し、
  それ以外には `403` を返すようにした

### HOPIN-6 · 管理者 API キー検査のタイミング攻撃

- その後のリファクタリングで管理者 API キーの経路が認証ミドルウェアから削除され、当該の
  比較処理自体が存在しなくなった

### HOPIN-4 · Content-Security-Policy ヘッダの欠如

- `src/middleware.ts` でリクエストごとに CSP を設定し、リクエスト単位の nonce を使用して
  いる

### HOPIN-7 · 長期有効な GCP 認証情報

- 両リポジトリとも Workload Identity Federation（`workload_identity_provider`）による
  認証に移行した
- サービスアカウントの JSON キーはいずれのリポジトリの Secrets にも保存していない

### HOPIN-8 · Actions のバージョン浮動

- サードパーティ製 Actions をイミュータブルなコミット SHA にピン留めした。ただし portal の
  デプロイワークフローの `google-github-actions/setup-gcloud` と
  `google-github-actions/deploy-cloudrun` はメジャーバージョンタグのままである

### HOPIN-9 · ロックファイル整合性の未強制

- 依存関係のインストールは `pnpm install --frozen-lockfile` を使用している

### HOPIN-11 · Strict-Transport-Security ヘッダの欠如

- HSTS を `next.config.mjs` で設定している

### HOPIN-3 · GraphQL の別経路経由による PII 露出

- `phoneNumber` は、閲覧権限がない場合に `null` を返すフィールドリゾルバ経由で提供される
  ようになった
- これによりレポートが指摘した `users` クエリだけでなく、ユーザーに到達するすべての経路で
  保護される

### HOPIN-10 · レビューなしの直接 push によるワークフロー起動

- Hexens はこの指摘を *Acknowledged* と記録している
- 本番デプロイは `master` への push（portal）および `master` にマージされたプルリクエスト
  （API）で起動し、`master` と `develop` はいずれも保護ブランチである
- 開発環境のデプロイは `epic/**` と `hotfix/**` への push でも起動し、これらのブランチは
  保護されていない

## 脆弱性の報告

- [`public/.well-known/security.txt`](../../../public/.well-known/security.txt)
