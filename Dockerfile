FROM node:20

# Global configuration (shared across all communities)
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Legacy support: These will be deprecated after Phase 2 (LINE channel unification)
# For now, we use a default community for fallback
ARG NEXT_PUBLIC_COMMUNITY_ID
ARG NEXT_PUBLIC_LIFF_ID
ARG NEXT_PUBLIC_LINE_CLIENT
ARG NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID

# NOTE: NEXT_PUBLIC_ variables are embedded at Next.js build time
# Community-specific config (LIFF_ID, TENANT_ID) will be fetched at runtime from DB after Phase 2
# Using heredoc to reduce Docker layers and improve build efficiency
RUN cat <<EOT > .env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT
NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT=$NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Legacy support (will be removed after Phase 2)
NEXT_PUBLIC_COMMUNITY_ID=$NEXT_PUBLIC_COMMUNITY_ID
NEXT_PUBLIC_LIFF_ID=$NEXT_PUBLIC_LIFF_ID
NEXT_PUBLIC_LINE_CLIENT=$NEXT_PUBLIC_LINE_CLIENT
NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID=$NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID
EOT

# グローバルに pnpm をインストール
RUN npm install -g pnpm

# アプリケーションディレクトリを作成
WORKDIR /app

# 依存関係の定義ファイルを先にコピー (キャッシュのため)
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# 依存関係をインストール
RUN pnpm install

# 残りのソースコードをコピー
COPY . ./

# ビルド
RUN pnpm build

# Cloud Run sets PORT environment variable (default 8080, but service may override to 8000)
# We run Next.js directly to avoid the hardcoded port in package.json start script
ENV PORT=8080
EXPOSE 8080

# アプリケーション起動
# Run Next.js directly with $PORT to respect Cloud Run's PORT env var
# -H 0.0.0.0 ensures the server binds to all interfaces (required for Cloud Run health checks)
CMD ["sh", "-c", "pnpm exec next start -p ${PORT} -H 0.0.0.0"]
