# Node.js の公式イメージ（例: 22-alpine）
FROM node:22-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json や lock ファイルを先にコピーして依存関係をインストール（キャッシュ活用）
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# プロジェクト全体のソースコードをコピー（app, prisma, lib, public, その他設定ファイルも含む）
COPY . .

# Next.js が利用するポートを公開
EXPOSE 3000

# 開発サーバーの起動（package.json の dev スクリプトを実行）
CMD ["npm", "run", "dev"]
