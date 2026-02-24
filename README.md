# SENSE OF DEFEAT - Official Website

SENSE OF DEFEAT のオフィシャルウェブサイトです。8bitのレトロゲーム体験を通じて、バンドのプロフィール、ディスコグラフィ、ライブ情報にアクセスできるインタラクティブなサイトとなっています。

## 🚀 概要 (Overview)

「ローンチできる状態」として、必要な各種機能（アクションゲーム部分、データの永続化、管理画面など）の実装が完了しています。

## 🛠 技術スタック (Tech Stack)

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, HTML5 Canvas
- **Backend**: Node.js, Express, tRPC
- **Database**: Drizzle ORM, MySQL (想定)
- **Storage**: AWS S3 (フライヤー画像などの保存)

## ⚙️ 環境構築とデプロイ・起動方法 (Setup & Deployment)

### 1. 依存パッケージのインストール

```bash
npm install
# または pnpm を推奨
pnpm install
```

### 2. 環境変数の設定

ルートディレクトリに `.env` ファイルを作成し、以下の環境変数を設定してください。

```env
# データベース接続URL（MySQL）
DATABASE_URL="mysql://username:password@host/dbname"

# セキュリティ・OAuth関連
JWT_SECRET="your_jwt_secret"
OAUTH_SERVER_URL="your_oauth_url"

# ポート設定（必要に応じて）
PORT=3000

# ※AWS S3 等の認証情報が実行環境として必要な場合があります
```

### 3. データベースのマイグレーション

Drizzle ORM を利用して、DBスキーマをプッシュ（同期）します。

```bash
npm run db:push
```

### 4. 開発用サーバーの起動 (Development)

```bash
npm run dev
```

### 5. 本番用ビルドと起動 (Production / Launch)

ローンチのために本番環境で実行する場合は、以下のコマンドを使用します。

```bash
# クライアント・サーバーコードのビルド
npm run build

# 本番サーバーの起動
npm run start
```

## 🎮 ディレクトリ構成

- `client/` : フロントエンド（React）および HTML5 Canvas ゲームロジック
- `server/` : バックエンド API（Express + tRPC）、DB制御
- `shared/` : tRPC や DB Schema の共有ファイル類
- `docs/` : アイデア・TODOなど、過去の設計ドキュメントや資料

## 📢 管理画面について

- URL: `/admin`
  - メニューから、「Live表示の追加・編集」「Discography の更新」などが行えます。
  - 管理画面へのアクセスには OAuth でのログイン認証および管理者初期設定が必要です。
