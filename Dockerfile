# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20.18.1
ARG PNPM_VERSION=9.15.4

# ---- base: shared toolchain ----
FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: install dependencies (cached while lockfile/patches don't change) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm config set store-dir /root/.local/share/pnpm/store \
    && pnpm install --frozen-lockfile --prefer-offline

# ---- builder: build the Next.js app (standalone output) ----
FROM deps AS builder
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_LOG_LEVEL
ARG NEXT_PUBLIC_ALLOWED_FRAME_ANCESTORS
ARG ENV

COPY . .

# Next.js は NEXT_PUBLIC_* をビルド時に静的に埋め込むため .env 経由で渡す
RUN printf "%s\n" \
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
    "NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}" \
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
    "NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}" \
    "NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}" \
    "NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT}" \
    "NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT=${NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}" \
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}" \
    "NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL}" \
    "NEXT_PUBLIC_ALLOWED_FRAME_ANCESTORS=${NEXT_PUBLIC_ALLOWED_FRAME_ANCESTORS}" \
    "ENV=${ENV}" \
    > .env

RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    pnpm build

# ---- runner: minimal production image ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Next.js standalone bundles native modules (sharp, next-swc) that need
# glibc-compat shims on Alpine.
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8000
CMD ["node", "server.js"]
