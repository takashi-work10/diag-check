# Node.js の公式イメージ（例: 22-alpine）
FROM node:22-alpine

# 非ルートユーザーとグループの作成
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイル群のコピー（package.json 等を /app/ にコピー）
COPY --chown=appuser:appgroup package.json package-lock.json* yarn.lock* /app/

# Prisma フォルダのコピー（/app/prisma/ に配置）
COPY --chown=appuser:appgroup prisma /app/prisma/

# npm の再試行およびタイムアウト設定を追加して依存関係インストール
RUN npm config set fetch-retries 10 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install

# プロジェクト全体のソースコードを所有者変更してコピー
COPY --chown=appuser:appgroup . .

# Next.js が利用するポートを公開
EXPOSE 3000

# 非ルートユーザーに切り替え
USER appuser

# 開発サーバーの起動（package.json の dev スクリプトを実行）
CMD ["npm", "run", "dev"]
