# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_COMMUNITY_ID
ARG NEXT_PUBLIC_LIFF_ID
ARG NEXT_PUBLIC_LINE_CLIENT
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT
ARG NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# NOTE: NEXT_PUBLIC_ 変数は、Next.jsビルド時に組み込まれるため、.envファイルを作って参照する必要がある
RUN touch .env
RUN echo "NEXT_PUBLIC_COMMUNITY_ID=$NEXT_PUBLIC_COMMUNITY_ID" >> .env
RUN echo "NEXT_PUBLIC_LIFF_ID=$NEXT_PUBLIC_LIFF_ID" >> .env
RUN echo "NEXT_PUBLIC_LINE_CLIENT=$NEXT_PUBLIC_LINE_CLIENT" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID" >> .env
RUN echo "NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN" >> .env
RUN echo "NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT" >> .env
RUN echo "NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT=$NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID=$NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID" >> .env
RUN echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" >> .env

# Install pnpm
RUN npm install -g pnpm

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Stage 3: Runner (Production)
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
