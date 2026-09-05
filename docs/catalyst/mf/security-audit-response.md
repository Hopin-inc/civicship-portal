<a id="en"></a>

# Security Audit — What Changed in the Code

*English below · [日本語は下段へ](#ja)*


[Hexens](https://hexens.io/) assessed the civicship platform, September–December
2025. **[The report](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)**
carries the findings, their severities and the status Hexens recorded for each.
This page records what changed in the code.

## Scope and currency

The audit targeted the NEO88 deployment, but its scope was the `civicship-portal`
and `civicship-api` repositories and their workflows, and every community runs the
same codebase — so the fixes below are in shared code, not in one environment.

Both repositories have moved on since December 2025. Nothing here is evidence
about code written after that.

HOPIN-3's fix landed after the report was issued, so its entry rests on the
current source rather than on Hexens confirming it.

## What changed, by finding

### HOPIN-1 · SSRF via the Next.js image handler

`next.config.mjs` declares an explicit `remotePatterns` allow-list, so arbitrary
hosts are rejected.

*Still open:* the report also recommends narrowing shared hosting domains to
trusted paths. The host allow-list is in place; per-path narrowing for the
object-storage host is not.

### HOPIN-2 · Reflected XSS via a Cloud Storage bucket

`src/app/api/image-proxy/route.ts` checks the request against an explicit
`ALLOWED_BUCKETS` list and returns `403` for anything else.

### HOPIN-6 · Timing attack in the admin API key check

The admin API key path was removed from the authentication middleware during a
later refactor, so the comparison no longer exists.

### HOPIN-4 · Missing Content-Security-Policy header

A CSP is set per request in `src/middleware.ts`, using a per-request nonce.

### HOPIN-7 · Long-lived GCP service account credentials

Both repositories authenticate through Workload Identity Federation
(`workload_identity_provider`). No service account JSON key is stored in either
repository's secrets.

### HOPIN-8 · Floating action versions

Third-party actions are pinned to immutable commit SHAs across both repositories.

*Still open:* two Google-published actions in the shared portal deploy workflow
(`setup-gcloud`, `deploy-cloudrun`) still use a major-version tag.

### HOPIN-9 · Lockfile integrity not enforced

Dependency installation uses `pnpm install --frozen-lockfile`.

### HOPIN-11 · Missing Strict-Transport-Security header

HSTS is set in `next.config.mjs`.

### HOPIN-3 · PII exposure through an alternative GraphQL path

`phoneNumber` is served by a field resolver that returns `null` unless the caller
is permitted to see it, so the field is protected on every path that reaches a
user, not only on the `users` query.

### HOPIN-10 · Workflows may trigger on direct push without review

No code change. Repository branch protection rules require pull request review.

## Reporting a vulnerability

See [`public/.well-known/security.txt`](../../../public/.well-known/security.txt).

---
---

<a id="ja"></a>

# セキュリティ監査 — コードで何を変更したか

*[English is above](#en)*

[Hexens](https://hexens.io/) が2025年9〜12月に civicship プラットフォームを評価した。
指摘事項・重大度・各指摘のステータスは
**[レポート](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)**
に記載。本ページはコードで何を変更したかを記録する。

## 監査の範囲と、現在との時間差

監査対象は NEO88 の環境だが、監査範囲は `civicship-portal` と `civicship-api` の
リポジトリおよびそのワークフローであり、すべてのコミュニティは同一のコードベースで
動作している。したがって以下の修正は特定環境ではなく共有コードに存在する。

両リポジトリは2025年12月以降も動いている。本ドキュメントは、それ以降に書かれた
コードに関する証拠ではない。

HOPIN-3 の修正はレポート発行後に入ったため、同項目の記載は現在のソースコードに
基づくものであって、Hexens が確認したものではない。

## 指摘ごとの変更内容

### HOPIN-1 · Next.js 画像ハンドラ経由の SSRF

`next.config.mjs` で `remotePatterns` による明示的な許可リストを宣言し、任意のホストを
拒否するようにした。

*未対応：* レポートは併せて、共有ホスティングドメインを信頼できるパスに限定することを
推奨している。ホストの許可リストは適用済みだが、オブジェクトストレージホストに対する
パス単位の限定は未適用。

### HOPIN-2 · Cloud Storage バケット経由の反射型 XSS

`src/app/api/image-proxy/route.ts` が明示的な `ALLOWED_BUCKETS` リストと照合し、
それ以外には `403` を返すようにした。

### HOPIN-6 · 管理者 API キー検査のタイミング攻撃

その後のリファクタリングで管理者 API キーの経路が認証ミドルウェアから削除され、
当該の比較処理自体が存在しなくなった。

### HOPIN-4 · Content-Security-Policy ヘッダの欠如

`src/middleware.ts` でリクエストごとに CSP を設定し、リクエスト単位の nonce を使用して
いる。

### HOPIN-7 · 長期有効な GCP 認証情報

両リポジトリとも Workload Identity Federation（`workload_identity_provider`）による
認証に移行した。サービスアカウントの JSON キーはいずれのリポジトリの Secrets にも
保存していない。

### HOPIN-8 · Actions のバージョン浮動

両リポジトリでサードパーティ製 Actions をイミュータブルなコミット SHA にピン留めした。

*未対応：* portal の共有デプロイワークフローにおいて、Google 公式の2つの Action
（`setup-gcloud`、`deploy-cloudrun`）がメジャーバージョンタグのまま残っている。

### HOPIN-9 · ロックファイル整合性の未強制

依存関係のインストールは `pnpm install --frozen-lockfile` を使用している。

### HOPIN-11 · Strict-Transport-Security ヘッダの欠如

HSTS を `next.config.mjs` で設定している。

### HOPIN-3 · GraphQL の別経路経由による PII 露出

`phoneNumber` は、閲覧権限がない場合に `null` を返すフィールドリゾルバ経由で提供される
ようになった。これによりレポートが指摘した `users` クエリだけでなく、ユーザーに到達する
すべての経路で保護される。

### HOPIN-10 · レビューなしの直接 push によるワークフロー起動

コードの変更なし。リポジトリのブランチ保護ルールがプルリクエストのレビューを要求して
いる。

## 脆弱性の報告

[`public/.well-known/security.txt`](../../../public/.well-known/security.txt) を参照。
