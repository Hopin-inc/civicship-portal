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
