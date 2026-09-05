<a id="en"></a>

# Third-Party Security Audit — Hexens, 2025

*English below · [日本語は下段へ](#ja)*


A third-party security assessment of the civicship platform, and what was done
about each finding. Published here so the findings and their remediation can be
checked against the source.

## The audit

| | |
| --- | --- |
| **Auditor** | [Hexens](https://hexens.io/) — a cybersecurity firm specialising in Web3 infrastructure, founded 2021 |
| **Review lead** | Hannay Al Mohanna, Lead Security Researcher |
| **Scope** | `civicship-portal` and `civicship-api` web application and API services, plus the GitHub Actions workflow definitions of both repositories |
| **Targets** | https://www.neo88.app/ · https://dev.neo88.app/ |
| **Audit started** | 29 September 2025 |
| **Initial report** | 7 October 2025 |
| **Revision submitted** | 12 December 2025 |
| **Final report** | 16 December 2025 |
| **The report** | [Hopin Security Assessment Report, final](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view) — published by Hopin, the client, with Hexens' findings and their recorded status |

### Findings by severity

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 2 |
| Medium | 3 |
| Low | 2 |
| Informational | 3 |
| **Total** | **10** |

No critical vulnerabilities were found. Both high-severity findings were fixed
before the final report.

## Scope and currency

Three things about this audit's relationship to the code as it stands today.

**The audit assessed the codebase as of September–December 2025.** Both
repositories have moved considerably since — well over a hundred commits to
`civicship-api`'s `master` alone. This document is not a claim that the current
code has been audited; it is a record of an audit that happened, and of what was
done about each finding.

**"Fixed" below means two different things.** Most entries were remediated during
the audit and re-verified by Hexens before the final report of 16 December 2025.
HOPIN-3 was not: the report files it as *Acknowledged*, and the fix landed
afterwards. Its status here rests on reading the current source, not on Hexens
confirming it.

**The audit targeted the NEO88 deployment, which has since concluded its
demonstration phase.** The live deployments today are Kibotcha, Izu, Kotohira and
DAIS. The scope was the `civicship-portal` and `civicship-api` repositories and
their workflows, not one deployment's configuration, and every community runs the
same codebase. The findings and their fixes are therefore in the shared code rather
than in an environment that no longer serves traffic. The environment-specific
parts — headers, workflow authentication — are set in that shared code and
configuration too.

Nothing here should be read as evidence about code written after December 2025.

## Remediation

Status below is what the code says today, not only what the report recorded. Two
entries differ from the report's own status; both are called out.

### HOPIN-1 · Blind SSRF via the Next.js image handler — **High**

The Next.js image proxy accepted any HTTPS URL and followed redirects, so it could
be pointed at internal endpoints.

**Fixed.** `next.config.mjs` now declares an explicit `remotePatterns` allow-list;
arbitrary hosts are rejected, which closes the reported attack path.

*Residual, tracked:* the report also recommended narrowing shared hosting domains
to trusted paths. The host allow-list is in place; per-path narrowing for the
object-storage host has not been applied yet.

### HOPIN-2 · Reflected XSS via a Cloud Storage bucket — **High**

`/api/image-proxy` accepted any Google Cloud Storage URL and reflected the response
in the application's own origin, including its `Content-Type`.

**Fixed.** `src/app/api/image-proxy/route.ts` now checks the request against an
explicit `ALLOWED_BUCKETS` list and returns `403` for anything else.

### HOPIN-6 · Timing attack in the admin API key check — **Medium**

The admin API key was compared with `===`, which is not constant-time.

**Fixed.** The admin API key path was removed from the authentication middleware
entirely during a later refactor, so the comparison no longer exists.

### HOPIN-4 · Missing Content-Security-Policy header — **Medium**

**Fixed.** A CSP is now set per request in `src/middleware.ts`, using a per-request
nonce.

### HOPIN-7 · Long-lived GCP service account credentials — **Medium**

Workflows authenticated to Google Cloud with long-lived service account JSON keys
stored as GitHub secrets.

**Fixed.** Both repositories now authenticate through Workload Identity Federation
(`workload_identity_provider`). No service account JSON key is stored in either
repository's secrets.

### HOPIN-8 · Floating action versions — **Low**

Workflows referenced GitHub Actions by mutable tags such as `@v3`.

**Mostly fixed.** Third-party actions are pinned to immutable commit SHAs across
both repositories.

*Residual, tracked:* two Google-published actions in the shared portal deploy
workflow (`setup-gcloud`, `deploy-cloudrun`) still use a major-version tag.

### HOPIN-9 · Lockfile integrity not enforced — **Low**

Some workflows installed dependencies without lockfile enforcement.

**Fixed.** Dependency installation uses `pnpm install --frozen-lockfile`.

### HOPIN-11 · Missing Strict-Transport-Security header — **Informational**

**Fixed.** HSTS is set in `next.config.mjs`.

### HOPIN-3 · Potential PII exposure through an alternative GraphQL path — **Informational**

The `users` query is admin-only, but user records — including `phoneNumber` —
were reachable through `communities → memberships → user`.

**Fixed** (the report records this as *Acknowledged*; it was resolved afterwards).
`phoneNumber` is now served by a field resolver that returns `null` unless the
caller is permitted to see it, so the field is protected on every path that reaches
a user, not only on the `users` query.

*Residual, tracked:* the report's remediation also suggests restricting the EVM
wallet address where users are not intended to publish it. `User.nftWallet` is
still resolved without a viewer check.

### HOPIN-10 · Workflows may trigger on direct push without review — **Informational**

**Acknowledged.** Workflow definitions do not themselves verify that branch
protection exists. This is handled by repository branch protection rules requiring
pull request review, rather than by changing the workflow triggers.

## Summary

| Finding | Severity | Status |
| --- | --- | --- |
| HOPIN-1 Blind SSRF via image handler | High | Fixed · one hardening item tracked |
| HOPIN-2 Reflected XSS via storage bucket | High | Fixed |
| HOPIN-6 Timing attack in admin API key check | Medium | Fixed |
| HOPIN-4 Missing Content-Security-Policy | Medium | Fixed |
| HOPIN-7 Long-lived GCP credentials | Medium | Fixed |
| HOPIN-8 Floating action versions | Low | Fixed · two actions tracked |
| HOPIN-9 Lockfile integrity not enforced | Low | Fixed |
| HOPIN-11 Missing Strict-Transport-Security | Informational | Fixed |
| HOPIN-3 PII via alternative GraphQL path | Informational | Fixed · one hardening item tracked |
| HOPIN-10 Workflows trigger on direct push | Informational | Accepted — covered by branch protection |

Both high-severity findings and all three medium-severity findings are fixed. The
two remaining items are hardening measures beyond what closes the reported attack.

## Reporting a vulnerability

See [`public/.well-known/security.txt`](../../public/.well-known/security.txt).

---
---

<a id="ja"></a>

# 第三者セキュリティ監査 — Hexens、2025年

*[English is above](#en)*

civicship プラットフォームに対する第三者セキュリティ評価と、各指摘への対応。
指摘とその対応をソースコードと突き合わせて検証できるよう、ここに公開する。

## 監査の概要

| | |
| --- | --- |
| **監査機関** | [Hexens](https://hexens.io/) — Web3 インフラを専門とするセキュリティ企業、2021年創業 |
| **監査責任者** | Hannay Al Mohanna, Lead Security Researcher |
| **対象範囲** | `civicship-portal` および `civicship-api` の Web アプリケーションと API サービス、ならびに両リポジトリの GitHub Actions ワークフロー定義 |
| **対象環境** | https://www.neo88.app/ · https://dev.neo88.app/ |
| **監査開始** | 2025年9月29日 |
| **初版レポート** | 2025年10月7日 |
| **修正提出** | 2025年12月12日 |
| **最終レポート** | 2025年12月16日 |
| **レポート本体** | [Hopin Security Assessment Report（最終版）](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view) — 依頼主である Hopin が公開。Hexens の指摘と、レポート上の対応状況を含む |

### 重大度別の件数

| 重大度 | 件数 |
| --- | ---: |
| Critical | 0 |
| High | 2 |
| Medium | 3 |
| Low | 2 |
| Informational | 3 |
| **合計** | **10** |

**Critical の脆弱性は検出されなかった。** High の2件は最終レポート発行前に修正済み。

## 監査の範囲と、現在との時間差

この監査と現在のコードの関係について、3点を明記しておく。

**監査は2025年9〜12月時点のコードベースを評価している。** 以降、両リポジトリは相当に
動いており、`civicship-api` の `master` だけでも100を優に超えるコミットが入っている。
本ドキュメントは現在のコードが監査済みであると主張するものではない。実施された監査と、
各指摘に対して何を行ったかの記録である。

**以下の「修正済み」には2種類ある。** ほとんどの項目は監査期間中に対応され、
2025年12月16日の最終レポート発行前に Hexens によって再検証されている。
HOPIN-3 はそうではない — レポートは *Acknowledged* として記録しており、修正はその後に
入った。本ドキュメントでの同項目のステータスは、現在のソースコードを読んだ結果に
基づくものであって、Hexens が確認したものではない。

**監査対象は NEO88 環境であり、同環境は既に実証フェーズを終了している。** 現在稼働して
いるのはキボッチャ、伊豆、琴平、DAIS である。監査範囲は特定環境の設定ではなく
`civicship-portal` と `civicship-api` のリポジトリおよびそのワークフローであり、
すべてのコミュニティは同一のコードベースで動作している。
したがって指摘とその修正は、既にトラフィックを受けていない環境ではなく共有コードの側に
存在する。環境固有の部分（ヘッダ、ワークフローの認証）も同じ共有コードと設定で規定されて
いる。

本ドキュメントのいかなる記述も、2025年12月以降に書かれたコードに関する証拠として
読まれるべきではない。

## 対応状況

以下のステータスは、レポートの記載ではなく**現在のコードを確認した結果**である。
2件がレポートの記載と異なり、いずれも明示している。

### HOPIN-1 · Next.js 画像ハンドラ経由の Blind SSRF — **High**

Next.js の画像プロキシが任意の HTTPS URL を受け付けリダイレクトを追跡していたため、
内部エンドポイントに向けることが可能だった。

**修正済み。** `next.config.mjs` で `remotePatterns` による明示的な許可リストを宣言し、
任意のホストは拒否されるようになった。これにより報告された攻撃経路は塞がっている。

*残存・記録中：* レポートは併せて、共有ホスティングドメインを信頼できるパスに限定する
ことを推奨していた。ホストの許可リストは適用済みだが、オブジェクトストレージホストに
対するパス単位の絞り込みは未適用である。

### HOPIN-2 · Cloud Storage バケット経由の反射型 XSS — **High**

`/api/image-proxy` が任意の Google Cloud Storage URL を受け付け、`Content-Type` を含めて
アプリケーション自身のオリジンで応答を反射していた。

**修正済み。** `src/app/api/image-proxy/route.ts` が明示的な `ALLOWED_BUCKETS` リストと
照合し、それ以外には `403` を返すようになった。

### HOPIN-6 · 管理者 API キー検査におけるタイミング攻撃 — **Medium**

管理者 API キーの比較に `===` を使用しており、定数時間比較ではなかった。

**修正済み。** その後のリファクタリングで管理者 API キーの経路が認証ミドルウェアから
完全に削除されたため、当該の比較処理自体が存在しない。

### HOPIN-4 · Content-Security-Policy ヘッダの欠如 — **Medium**

**修正済み。** `src/middleware.ts` でリクエストごとに CSP を設定し、リクエスト単位の
nonce を使用している。

### HOPIN-7 · 長期有効な GCP サービスアカウント認証情報 — **Medium**

ワークフローが、GitHub Secrets に保存した長期有効なサービスアカウント JSON キーで
Google Cloud に認証していた。

**修正済み。** 両リポジトリとも Workload Identity Federation
（`workload_identity_provider`）による認証に移行した。サービスアカウントの JSON キーは
どちらのリポジトリの Secrets にも保存されていない。

### HOPIN-8 · Actions のバージョンが浮動 — **Low**

ワークフローが GitHub Actions を `@v3` のような可変タグで参照していた。

**概ね修正済み。** 両リポジトリでサードパーティ製 Actions はイミュータブルなコミット
SHA にピン留めされている。

*残存・記録中：* portal の共有デプロイワークフローにおいて、Google 公式の2つの Action
（`setup-gcloud`、`deploy-cloudrun`）がメジャーバージョンタグのまま残っている。

### HOPIN-9 · ロックファイルの整合性が強制されていない — **Low**

一部のワークフローがロックファイルの強制なしに依存関係をインストールしていた。

**修正済み。** 依存関係のインストールは `pnpm install --frozen-lockfile` を使用している。

### HOPIN-11 · Strict-Transport-Security ヘッダの欠如 — **Informational**

**修正済み。** HSTS を `next.config.mjs` で設定している。

### HOPIN-3 · GraphQL の別経路経由による PII 露出の可能性 — **Informational**

`users` クエリは管理者限定だが、`communities → memberships → user` の経路から
`phoneNumber` を含むユーザーレコードに到達できた。

**修正済み**（レポートの記載は *Acknowledged* だが、その後に解消された）。
`phoneNumber` は、閲覧権限がない場合に `null` を返すフィールドリゾルバ経由で提供される
ようになった。これによりレポートが指摘した `users` クエリだけでなく、**ユーザーに到達
するすべての経路で保護される。**

*残存・記録中：* レポートは併せて、利用者が公開を意図していない場合に EVM ウォレット
アドレスも制限することを推奨している。`User.nftWallet` は現在も閲覧者チェックなしで
解決されている。

### HOPIN-10 · ワークフローがレビューなしの直接 push で起動しうる — **Informational**

**受容。** ワークフロー定義自体はブランチ保護の存在を検証しない。これはワークフローの
トリガーを変更するのではなく、プルリクエストのレビューを要求するリポジトリのブランチ
保護ルールで担保している。

## まとめ

| 指摘 | 重大度 | 状況 |
| --- | --- | --- |
| HOPIN-1 画像ハンドラ経由の Blind SSRF | High | 修正済 · ハードニング1件を記録中 |
| HOPIN-2 ストレージバケット経由の反射型 XSS | High | 修正済 |
| HOPIN-6 管理者 API キー検査のタイミング攻撃 | Medium | 修正済 |
| HOPIN-4 Content-Security-Policy の欠如 | Medium | 修正済 |
| HOPIN-7 長期有効な GCP 認証情報 | Medium | 修正済 |
| HOPIN-8 Actions のバージョン浮動 | Low | 修正済 · 2件を記録中 |
| HOPIN-9 ロックファイル整合性の未強制 | Low | 修正済 |
| HOPIN-11 Strict-Transport-Security の欠如 | Informational | 修正済 |
| HOPIN-3 別経路経由の PII 露出 | Informational | 修正済 · ハードニング1件を記録中 |
| HOPIN-10 直接 push によるワークフロー起動 | Informational | 受容 — ブランチ保護で担保 |

**High の2件と Medium の3件はすべて修正済み。** 残る2件は、報告された攻撃を塞ぐ範囲を
超えた追加のハードニング措置である。

## 脆弱性の報告

[`public/.well-known/security.txt`](../../public/.well-known/security.txt) を参照。
