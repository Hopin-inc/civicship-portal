# Front-End Documentation

Milestone 5 deliverable 1. Current as of `517e9a4` (2026-09-04).

The acceptance criterion asks for documentation covering UI/UX design principles,
integration processes, and user instructions. This page is the index: the
architecture and integration are described here, and the design material and user
manual are linked where they live.

---

## What the application is

A mutual-assistance application for residents, delivered as a **LINE mini app
(LIFF)**. The UX assumes a mobile browser inside LINE, because the residents this
serves already use LINE daily — asking them to install an app or manage a Web3
wallet would have excluded most of them.

| | |
| --- | --- |
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Data layer | Apollo Client against a GraphQL API |
| Runtime | Cloud Run, with an Edge middleware in front |
| Licence | GPL-3.0 |

## Multi-community architecture

One codebase serves seven communities. Each is a separate tenant with its own
domain, branding, Firebase tenant, and LINE channel.

Which features a community sees is driven by `enableFeatures` on its portal
configuration — points, opportunities, quests, tickets, places, credentials. A
community configured for credentials only never renders the economic features at
all. This is what lets a single implementation serve communities as different as
Kibotcha (daily point circulation) and DAIS (credential issuance with no economic
activity).

Relevant source: `src/lib/communities/`, `src/contexts/CommunityConfigContext.tsx`.

## Authentication and identity

The chain, in order:

1. **LINE login** through LIFF produces an access token.
2. The API exchanges it for a **Firebase custom token** against the community's own
   Firebase tenant.
3. The portal exchanges that for an ID token and asks the API for a **session
   cookie scoped to the community** (`__session_{communityId}`).
4. **Phone-number verification** runs separately and acts as the common identity
   across communities — the same person joining two communities is recognised as
   one person.
5. A **DID** is issued against the verified phone number.

Relevant source: `src/lib/auth/`, `src/middleware.ts`.

There is also a development-only path that bypasses LINE and Firebase entirely so
testers can exercise non-production deployments without a LINE account. It is
gated on the deployment's `ENV` and cannot fire in production, which sets no
`ENV` at all. See [`docs/development/dev-login.md`](../development/dev-login.md).

## Integration with the backend

The front end holds no business logic and no database access. Everything goes
through the GraphQL API in
[`civicship-api`](https://github.com/Hopin-inc/civicship-api).

- **Transport:** Apollo Client. Server components and the Edge middleware call the
  same API over HTTP with the community's session cookie; the browser sends the
  session cookie plus an `X-Community-Id` header identifying the tenant.
- **Types:** the GraphQL schema is code-generated into TypeScript
  (`pnpm gql:generate` → `src/types/graphql.tsx`), so a schema change that breaks
  the front end fails at compile time rather than at runtime.
- **Tenancy:** every request carries the community id. The API resolves the tenant
  and the caller's identity from it, and applies row-level security accordingly.
- **Authorisation in the UI:** `src/lib/auth/core/access-policy.ts` decides which
  paths a role may reach. The API enforces the same rules independently — the
  front end's checks are for navigation, not for security.

The backend's own technical documentation was submitted as Milestone 4
(27 November 2025). See the note on drift in [the index](./README.md).

## Main screens

| Area | Screens |
| --- | --- |
| Participation | Opportunities (activities and their detail), reservations, quests |
| Economy | Transactions and history, wallets, point transfer, tickets |
| Place | Places (map and detail) |
| Identity | User profile, DID / VC credentials |
| Operations | Admin area — reservations, members, wallet, opportunities, tickets |

## Internationalisation

Japanese and English, with message catalogues under `src/messages/` and
generated key types (`src/types/i18n.ts`) so a missing translation is a type error.

## Component documentation

206 Storybook stories, published on every pull request through Chromatic. Running
`pnpm storybook` locally gives the same catalogue.

---

## UI/UX design material

Produced and submitted during Milestone 3, and approved there. Linked rather than
duplicated so there is one source of truth.

| | |
| --- | --- |
| Design principles, redesign requirements and action plan | https://hopin-inc.notion.site/What-s-Co-Creation-DAO-App-1c030b95d2b68016be45e448154a50ab |
| How interviewees were selected, the interview format, and how feedback was recorded and analysed | https://hopin-inc.notion.site/Additional-Document-M3-21130b95d2b68092aae4de53b3e5147d |
| UI design (Figma) | https://www.figma.com/design/TkZ3wAG6zj114b4N6ogJyf/Co-Creation-DAO-App-UI--Catalyst-M3- |
| Design walkthrough — participant side | https://youtube.com/playlist?list=PL0Jg6Cs8E9r3ynDqeweM-kWII2znYjr2v |
| Design walkthrough — host / admin side | https://youtube.com/playlist?list=PL0Jg6Cs8E9r1tfJ25FdtOguzyt6KWkiCV |

## User instructions

**NEO88 App Manual** — for experience providers:
https://docs.google.com/presentation/d/1WypOpniKO8l7OXk1VBbkYNf7O_vYgkwDg8it4eJccxk/edit

Covers account registration, linking the LINE account, approving and declining
reservations, cancelling a session, checking applications, and attendance
management.

## Developer documentation

| | |
| --- | --- |
| Adding a new community | [`docs/development/add-new-community.md`](../development/add-new-community.md) |
| Development login (LINE / Firebase bypass) | [`docs/development/dev-login.md`](../development/dev-login.md) |
| Logging standards | [`docs/development/logging-standards.md`](../development/logging-standards.md) |
| i18n style guide | [`docs/i18n-style-guide.md`](../i18n-style-guide.md) |
