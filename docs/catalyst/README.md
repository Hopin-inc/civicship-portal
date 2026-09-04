# Project Catalyst F12 — Submission Materials

Documentation produced for Project Catalyst Fund 12, *Creating social implementation
use-cases of Cardano in the Shikoku region, Japan* (Project ID 1200088).

These files live in the repository rather than in a document store so that every
claim in them can be checked against the source it describes.

## Contents

| Document | Milestone | What it covers |
| --- | --- | --- |
| [Front-end documentation](./frontend-documentation.md) | Milestone 5 | Architecture of the front end, how it integrates with the API, and where the UI/UX design material and user instructions live |
| [User Acceptance Test report](./uat-report-2026.md) | Final | Demonstration experiment results, provider feedback, analysis, and platform usage statistics |
| [Security audit and remediation](../security/audit-2025-hexens.md) | Final | The Hexens third-party audit, each finding, and its remediation status verified against the code |

## On the gap between a submission and the code today

Milestones are submitted at a point in time; the code keeps moving. The backend
milestone was submitted on **27 November 2025**, and `civicship-api` has taken well
over a hundred commits to `master` since then. A reader comparing that submission
to the repository today will find differences, and that is expected rather than a
discrepancy to explain away.

To keep these documents honest about it, each one states the commit it was written
against. Anything that has changed since is visible in `git log` rather than hidden
by a document that quietly stopped being true.

**These documents are current as of `517e9a4` (2026-09-04).**

### What has changed since Milestone 4

Rather than leave the gap unexplained, here is what the commit history shows. This
is a summary of themes, not an exhaustive changelog — the authoritative record is
`git log` in each repository.

**Volume.** At least **190 commits** landed on `civicship-api`'s `master` after the
Milestone 4 submission. That figure is a floor, not a total: those 190 span only
2026-05-13 to 2026-07-17, roughly two months of the nine that have passed, so the
real number is considerably higher.

**Identity.** The largest single line of work. DID issuance was reworked and
existing users were backfilled, and a **phased migration away from Identus** as the
DID/VC provider has been underway across several releases. That migration is *not
complete* — Identus is still referenced in eight files at the commit above — so it
should be read as in progress rather than finished.

**Credentials and NFTs.** NFT issuance was built out, including the resident-card
NFTs described in the DAO documentation. Authorization on VC issuance requests was
tightened so that a request is visible only to its subject or to an administrator.

**Analytics and reporting.** Community analytics, cohort funnels, a report
scheduler and report templates were added, with golden-case tests covering the
generated reports. This is the machinery behind the usage figures in the
[UAT report](./uat-report-2026.md).

**Points and transactions.** Members can now contribute points to a community
wallet (`CONTRIBUTION`), alongside the existing peer-to-peer transfers.

**Data protection.** A GDPR domain was added to the API, covering data export and
deletion paths.

**Security posture.** A sustained programme rather than a single fix: a
`security.txt` endpoint, domain hardening, certificate-transparency log
monitoring, dependency CVE remediation, and the remediation of the third-party
audit findings recorded in
[the audit document](../security/audit-2025-hexens.md).

**Delivery.** CI was restructured — test suites split for parallel execution,
pipeline and deployment posture reviewed, GitHub Actions pinned to immutable
commit SHAs, and Google Cloud authentication moved to Workload Identity Federation.

On this repository, the front end tracked those changes and added its own: the
community wallet contribution flow, the administrative analytics screens, a
system-administration area, per-community feature configuration, and a
development-only login that lets testers exercise non-production deployments
without a LINE account.

The short version: the project did not pause between Milestone 4 and this
submission. The identity layer was substantially rebuilt, credential and NFT
issuance shipped, analytics arrived, and the security work that produced the audit
above ran throughout.

## Repositories

| | |
| --- | --- |
| Front end | https://github.com/Hopin-inc/civicship-portal — GPL-3.0 |
| Backend / GraphQL API | https://github.com/Hopin-inc/civicship-api — GPL-3.0 |

## Live deployments

| Community | URL |
| --- | --- |
| Kibotcha DAO | https://kibotcha.civicship.app/transactions |
| Izu DAO | https://izu.civicship.app/transactions |
| Kotohira DAO | https://kotohira.civicship.app/opportunities |
| DAIS (DID / VC only) | https://dais.civicship.app/users/me |

DAIS renders only after login because it handles credential data. NEO88
(https://www.neo88.app/) was the initial demonstration partner; its demonstration
phase has concluded.
