# 📝 MyPostApp

Next.js + TypeScript で作った、コミュニティ機能がついた英検学習タイプ診断アプリです。  
Googleログイン、診断、問い合わせなどの機能が含まれています。

---

## 🚀 セットアップ方法

```bash
# 1. パッケージをインストール
npm install

# 2. 開発サーバーを起動
npm run dev

# 3. .env.local に以下の環境変数を設定
# GoogleログインやDB接続など
例：

env
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=yyy
NEXTAUTH_SECRET=zzz

🔐 機能一覧
投稿作成 / 編集 / 削除
コメント（親コメント＋子コメント）
コメント数のカウント表示
Googleログイン（NextAuth.js）
診断フォーム（選択式の評価→結果保存）
お問い合わせフォーム（APIルートに送信）

🛠️ 技術スタック
Next.js App Router
React / TypeScript
Prisma + MongoDB
ReactQuery（tanstack）
MaterialUI（MUI）
NextAuth.js
Docker（オプション）

📁 ディレクトリ構成（一部）
app/
├── api/           # APIルート（投稿・コメント・診断・認証）
├── components/    # UIコンポーネント（CommentItem, LoginDialogなど）
├── posts/         # 投稿ページ
├── contact/       # お問い合わせページ
├── diagnosis/     # 診断ページ
├── result/        # 診断結果表示
├── profile/       # プロフィールページ

📝 補足
投稿・コメントなどは MongoDBに保存されます。

Googleログインを使うためには、Google Cloud Console で OAuth 認証を設定してください。

開発環境は、dockerで作っています
本番環境へは Vercel などのホスティングに対応しています。

