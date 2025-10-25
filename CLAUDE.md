# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Civicship Portal is a multi-community Next.js application (App Router) for regional engagement and digital citizenship. The platform enables community-specific experiences through feature toggling via `NEXT_PUBLIC_COMMUNITY_ID`, supporting various communities like NEO四国88祭 (neo88), 琴平デジタル町民 (kotohira), IZUとDAO (izu), and others.

## Development Commands

### Local Development
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server with HTTPS (required for LINE LIFF integration)
pnpm dev:https

# Regular development server (non-HTTPS, port 8000)
pnpm dev
```

**Important**: Before starting the dev server, ensure the `civicship-api` backend is running on `localhost:3000`.

### Code Quality
```bash
# Lint source code
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Format code with Prettier
pnpm format

# Lint GraphQL operations
pnpm lint:graphql
```

### Build & Deploy
```bash
# Build production bundle
pnpm build

# Start production server (port 8000)
pnpm start
```

### GraphQL
```bash
# Generate TypeScript types from GraphQL schema and operations
# Note: Connects to localhost:3000/graphql with NODE_TLS_REJECT_UNAUTHORIZED=0
pnpm gql:generate
```

The GraphQL codegen configuration (codegen.yaml):
- Schema source: `https://localhost:3000/graphql` with `X-Community-Id` header
- Generates types in `src/types/graphql.tsx` with `Gql` prefix
- All types use `T | null` for maybe values
- Creates React Apollo hooks for queries/mutations

### Testing & Storybook
```bash
# Run Storybook on port 6006
pnpm storybook

# Build Storybook
pnpm build-storybook
```

Tests are configured with Vitest and Playwright for Storybook integration (vitest.config.ts).

## Architecture

### Multi-Community System

The application supports multiple communities through environment-based configuration:

**Community Configuration** (`src/lib/communities/metadata.ts`):
- `NEXT_PUBLIC_COMMUNITY_ID` determines which community is active
- Each community has:
  - Unique branding (title, description, logos, favicons, OGP images)
  - Feature flags (`enableFeatures`): controls which features are available (opportunities, points, tickets, articles, places, credentials, justDaoIt, quests, prefectures)
  - Custom root paths and admin paths
  - Token names for community-specific currencies

**Community Content** (`src/lib/communities/content.ts`):
- Stores community-specific content like terms of service
- Falls back to default content if not specified

**Adding a New Community**:
1. Add configuration to `COMMUNITY_BASE_CONFIG` in `src/lib/communities/metadata.ts`
2. Add content to `COMMUNITY_CONTENT` in `src/lib/communities/content.ts`
3. Add static assets to `/public/communities/{community-id}/`
4. Update `.github/config/community-list.json`
5. Create GitHub Actions Environment: `co-creation-dao-{env}-{community-id}`
6. Set `NEXT_PUBLIC_COMMUNITY_ID` in environment variables

### Authentication Architecture

Multi-layered authentication system combining Firebase Auth and LINE LIFF:

**Core Components** (`src/lib/auth/`):
- `auth-store.ts`: Zustand store for centralized auth state
- `auth-state-manager.ts`: Manages auth state transitions and synchronization
- `token-manager.ts`: Handles Firebase ID token lifecycle
- `access-policy.ts`: Controls route access based on auth state
- `environment-detector.ts`: Detects if running in LINE browser/LIFF context

**Auth Flow**:
1. Server-side: `getUserServer()` fetches user from session cookies (Next.js App Router)
2. Client-side hydration: `applySsrAuthState()` syncs SSR state to client store
3. Firebase Auth for ID tokens
4. LINE LIFF for LINE-specific authentication
5. Phone number verification as additional authentication layer

**Auth Modes**:
- Session-based (default): Uses cookies
- ID token-based: Firebase JWT sent via `Authorization: Bearer` header
- Determined by `X-Auth-Mode` header in GraphQL requests

**Phone Auth** (`phone-auth-service.ts`):
- Firebase phone authentication with OTP
- Configured with tenant ID: `NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID`

### GraphQL Integration

**Client Setup** (`src/lib/apollo.ts`):
- Apollo Client with upload support (apollo-upload-client)
- Request link adds headers:
  - `Authorization: Bearer {token}` when Firebase user is authenticated
  - `X-Auth-Mode`: "session" or "id_token"
  - `X-Civicship-Tenant`: Firebase tenant ID
  - `X-Community-Id`: Current community ID
- Error link handles authentication errors and token expiration
- Dispatches `auth:token-expired` custom events for 401 errors

**Type Generation**:
- All GraphQL types prefixed with `Gql` (e.g., `GqlUser`, `GqlOpportunity`)
- Located in `src/types/graphql.tsx`
- Regenerate after schema changes with `pnpm gql:generate`

### App Structure

**Next.js App Router** (`src/app/`):
- Root layout: `src/app/layout.tsx` with provider hierarchy:
  - CookiesProvider
  - ApolloProvider
  - AuthProvider (SSR auth state)
  - HeaderProvider
  - LoadingProvider
  - AnalyticsProvider

**Main Feature Routes**:
- `/opportunities` - Community opportunities/experiences
- `/quests` - Gamification quests
- `/tickets` - Event tickets
- `/articles` - Community articles
- `/places` - Location-based features
- `/credentials` - Digital credentials/badges
- `/wallets` - Token wallet management
- `/nfts` - NFT certificates (NMKR integration)
- `/admin` - Admin panel (reservations, credentials, wallet)
- `/users/[id]` - User profiles
- `/users/me` - Current user profile

**API Routes** (`src/app/api/`):
- `/api/client-log` - Client-side logging endpoint
- `/api/image-proxy` - Image proxy for IPFS/external images
- `/api/sessionLogin` - Session authentication

### Component Organization

**Component Structure** (`src/components/`):
- `ui/` - Reusable UI components (shadcn/ui based)
- `domains/` - Feature-specific components (opportunities, nfts, etc.)
- `auth/` - Authentication-related components
- `layout/` - Layout components (headers, navigation)
- `providers/` - React context providers
- `shared/` - Shared utility components
- `search/` - Search functionality
- `polyfills/` - Client-side polyfills

### State Management

**Global State**:
- `src/lib/auth/core/auth-store.ts`: Zustand store for authentication
- `src/contexts/`: React contexts for:
  - `AuthProvider.tsx` - Auth context with SSR support
  - `CommunityContext.tsx` - Community-specific context
  - `HeaderContext.ts` - Header state (visibility, title)
  - `LoadingContext.ts` - Loading state

### Styling

- Tailwind CSS (configured in `tailwind.config.ts`)
- CSS-in-JS with `class-variance-authority` for component variants
- Global styles: `src/app/globals.css`
- Community-specific styling via conditional classes based on `COMMUNITY_ID`

### Image Handling

**Next.js Image Configuration** (`next.config.mjs`):
- Remote patterns allowed: `storage.googleapis.com` (for community assets)
- IPFS paths handled via custom loader (see recent commits)
- Optimized formats: WebP, AVIF
- Custom device sizes and image sizes configured

**IPFS Support**:
- IPFS images proxied through `/api/image-proxy` route
- Configured in `next.config.mjs` to allow IPFS path handling

## Important Conventions

### Community-Specific Code

Use `COMMUNITY_ID` constant to toggle features:

```typescript
import { COMMUNITY_ID } from "@/lib/communities/metadata";

if (COMMUNITY_ID === "neo88") {
  // neo88-specific logic
} else if (COMMUNITY_ID === "kotohira") {
  // kotohira-specific logic
}
```

Check feature availability:

```typescript
import { currentCommunityConfig } from "@/lib/communities/metadata";

if (currentCommunityConfig.enableFeatures.includes("opportunities")) {
  // Show opportunities feature
}
```

### GraphQL Operations

- Write GraphQL operations inline in TypeScript files
- Use generated hooks: `useGqlQueryName`, `useGqlMutationName`
- Always regenerate types after schema changes: `pnpm gql:generate`

### Path Aliases

TypeScript path aliases are configured:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`

### SVG Imports

Two ways to import SVG (configured in webpack):
```typescript
// As React component
import Logo from './logo.svg';

// As URL
import logoUrl from './logo.svg?url';
```

## Environment Variables

**Required for Development**:
- `NEXT_PUBLIC_COMMUNITY_ID` - Community identifier (e.g., "neo88", "kotohira")
- `NEXT_PUBLIC_API_ENDPOINT` - GraphQL API endpoint (usually `https://localhost:3000/graphql`)
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID` - Firebase tenant for multi-tenancy
- `NEXT_PUBLIC_LIFF_ID` - LINE LIFF app ID
- `NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT` - LINE LIFF login endpoint
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For Google Maps integration

## Deployment

**Platform**: Google Cloud Run via GitHub Actions

**Workflow**:
- Dev: Push to any branch → `.github/workflows/deploy-to-cloud-run-dev.yml`
- Prod: Push to `master` → `.github/workflows/deploy-to-cloud-run-prod.yml`

**Multi-Community Deployment**:
- Reads community list from `.github/config/community-list.json`
- Deploys separate Cloud Run service per community
- Service naming: `{APPLICATION_NAME}-{community-id}`
- Environment naming: `co-creation-dao-{env}-{community-id}`

**Docker Build**:
- Uses `pnpm` for dependency management
- Build-time environment variables injected via ARG
- Runs on port 8000

## Logging

Structured logging system (`src/lib/logging/`):
- Server-side: Winston with Google Cloud Logging integration
- Client-side: Custom logger with `/api/client-log` endpoint
- Log levels: error, warn, info, debug
- Contextual logging with component names and operation tracking
