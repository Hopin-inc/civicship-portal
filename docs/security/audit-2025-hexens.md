# Third-Party Security Audit — Hexens, 2025

A third-party security assessment of the civicship platform, and what was done
about each finding. Published here so the findings and their remediation are
verifiable against the source rather than taken on trust.

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
| HOPIN-3 PII via alternative GraphQL path | Informational | Fixed |
| HOPIN-10 Workflows trigger on direct push | Informational | Accepted — covered by branch protection |

Both high-severity findings and all three medium-severity findings are fixed. The
two remaining items are hardening measures beyond what closes the reported attack,
and are tracked rather than silently dropped.

## Reporting a vulnerability

See [`public/.well-known/security.txt`](../../public/.well-known/security.txt).
