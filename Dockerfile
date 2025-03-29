FROM node:20

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

# アプリケーション起動
CMD ["pnpm", "start"]
