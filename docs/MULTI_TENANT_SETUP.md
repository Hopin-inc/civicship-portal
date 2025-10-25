# Multi-Tenant Setup Guide

This document describes the multi-tenant architecture implementation and setup instructions.

## Architecture Overview

The application supports both single-tenant and multi-tenant deployment modes:

- **Single-Tenant Mode**: Uses `NEXT_PUBLIC_COMMUNITY_ID` environment variable to serve a specific community
- **Multi-Tenant Mode**: Resolves `communityId` from the `Host` header to serve multiple communities from a single deployment

## Security Guardrails

### Server-Only Code Protection

All files importing `next/headers` must include `'server-only'` import to prevent client bundle contamination:

```typescript
import "server-only";
import { headers } from "next/headers";
```

**Protected Files:**
- `src/lib/communities/server-resolve.ts`
- `src/lib/auth/init/getUserServer.ts`
- `src/app/users/me/libs/fetchProfileServer.ts`

**CI Check:** Run `./scripts/check-server-only-imports.sh` to verify server-only imports are properly isolated.

### Runtime Fallback Monitoring

The `getAuthForCommunity()` function in `runtime-auth.ts` logs when registry fallback values are used:
- **Development**: `warn` level
- **Production**: `error` level (should never happen with proper env vars)

### Cache Isolation

`Vary: Host` header is set in `next.config.mjs` to prevent cross-tenant cache contamination.

## Configuration

### Environment Variables

See `.env.example.multi-tenant` for complete configuration examples.

**Single-Tenant Mode (Current):**
```bash
NEXT_PUBLIC_COMMUNITY_ID=neo88
NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID=your-tenant-id
NEXT_PUBLIC_LIFF_ID=your-liff-id
NEXT_PUBLIC_LINE_CLIENT=your-line-client
```

**Multi-Tenant Mode (Future):**
Remove `NEXT_PUBLIC_COMMUNITY_ID` and configure per-community credentials in your deployment environment.

### Domain Mapping

Domains are mapped to communities in `src/lib/communities/runtime-auth.ts`:

```typescript
export const DOMAIN_TO_COMMUNITY: Record<string, CommunityId> = {
  "www.neo88.app": "neo88",
  "kibotcha.civicship.jp": "kibotcha",
  "dais.civicship.jp": "dais",
  "kotohira.civicship.app": "kotohira",
  "himeji-ymca.civicship.jp": "himeji-ymca",
  "izu.civicship.app": "izu",
  // ... dev domains
};
```

## Local Multi-Tenant Testing

1. Add entries to `/etc/hosts`:
   ```
   127.0.0.1 dev.neo88.app
   127.0.0.1 dev-kibotcha.civicship.jp
   127.0.0.1 dev-dais.civicship.jp
   ```

2. Comment out `NEXT_PUBLIC_COMMUNITY_ID` in `.env.local`

3. Run dev server bound to all interfaces:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

4. Access via community-specific domains:
   - http://dev.neo88.app:3000
   - http://dev-kibotcha.civicship.jp:3000
   - etc.

## Testing

### Unit Tests

Run multi-tenant helper tests:
```bash
npm test src/lib/communities/__tests__/runtime-auth.test.ts
```

### CI Checks

The following checks run in CI:
- `check-server-only-imports.sh`: Verifies server-only code isolation
- Build matrix: Validates configuration for all communities

## Observability

### Logging Best Practices

When logging in multi-tenant contexts, include `communityId` and `tenantId` in metadata:

```typescript
logger.info("Processing request", {
  communityId,
  tenantId,
  // ... other metadata
});
```

### Monitoring

Monitor these metrics in production:
- Registry fallback usage (should be 0 in production)
- Invalid host warnings
- Per-community error rates

## Adding a New Community

1. Add community ID to `COMMUNITY_IDS` in `runtime-auth.ts`
2. Add entry to `AUTH_BY_COMMUNITY` registry (use dummy values)
3. Add domain mappings to `DOMAIN_TO_COMMUNITY`
4. Configure production environment variables for the new community
5. Register LINE/LIFF callback URLs for the new domain
6. Update tests to include the new community

## Troubleshooting

### Build Error: "next/headers" in Client Component

**Symptom:** Build fails with error about importing `next/headers` in client components

**Solution:**
1. Ensure all files importing `next/headers` have `import "server-only"` at the top
2. Refactor client components to accept data as props instead of importing server-only modules
3. Run `./scripts/check-server-only-imports.sh` to verify

### Registry Fallback in Production

**Symptom:** Error logs showing registry fallback usage in production

**Solution:**
1. Verify all required environment variables are set:
   - `NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID`
   - `NEXT_PUBLIC_LIFF_ID`
   - `NEXT_PUBLIC_LINE_CLIENT`
2. Check Google Secret Manager or deployment environment configuration

### Unknown Host Warnings

**Symptom:** Logs showing "Unknown host" warnings

**Solution:**
1. Add the domain to `DOMAIN_TO_COMMUNITY` in `runtime-auth.ts`
2. Verify DNS/Cloud Run domain mappings are configured correctly
