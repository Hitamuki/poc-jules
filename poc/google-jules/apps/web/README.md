# Webフロントエンド (Next.js)

このパッケージは、ブックマーク・リーディングリストToDoアプリのWebフロントエンドです。
Next.js (App Router) を使用して構築され、PWAに対応しています。

## 技術スタック

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Material UI (部分的に利用検討)
- Jotai (状態管理)
- Zod (バリデーション)
- Storybook (UIコンポーネント開発・カタログ)
- MSW (APIモック)
- Vitest, React Testing Library (単体・結合テスト)
- Playwright (E2Eテスト)
- tRPC (BFF)

## ディレクトリ構成 (予定)

- `public`: 静的ファイル (画像、PWAマニフェストなど)
- `src`
  - `app`: Next.js App Routerのルートディレクトリ
    - `(auth)`: 認証関連ルートグループ
    - `(main)`: メインアプリケーションルートグループ
      - `dashboard`: ダッシュボードページ
      - `bookmarks`: ブックマーク関連ページ
      - `calendar`: カレンダー表示ページ
      - `settings`: 設定ページ
    - `api`: APIルート (tRPC, NextAuthなど)
    - `layout.tsx`: ルートレイアウト
    - `page.tsx`: トップページ
  - `components`: UIコンポーネント
    - `common`: 共通的に使用する汎用コンポーネント
    - `features`: 特定機能に特化したコンポーネント
    - `layouts`: ページレイアウトコンポーネント
    - `ui`: shadcn/uiベースの低レベルUIコンポーネント (Button, Inputなど)
  - `constants`: 定数
  - `contexts`: React Context
  - `hooks`: カスタムフック
  - `lib`: ユーティリティ関数、ヘルパー (tRPCクライアント含む)
  - `services`: API通信ロジック (主にtRPC経由)
  - `store`: Jotaiアトム定義
  - `styles`: グローバルスタイル、Tailwind CSS設定
  - `types`: 型定義 (Zodスキーマは `packages/zod-schemas` からインポート)
  - `utils`: 汎用ユーティリティ
- `stories`: Storybookのストーリーファイル
- `e2e`: PlaywrightのE2Eテストファイル
- `mocks`: MSWのモック定義ファイル

## 環境構築

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。

2. **環境変数の設定:**
   `.env.local` ファイルをこのディレクトリに作成し、必要な環境変数を設定します。
   例:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api # NestJS APIのエンドポイント (REST用、tRPCは別)
   NEXTAUTH_URL=http://localhost:3000 # NextAuthを使用する場合
   NEXTAUTH_SECRET=your-nextauth-secret # NextAuthを使用する場合

   # tRPCが直接NestJS APIを呼び出す場合、サーバーサイドでのみ使用する環境変数
   INTERNAL_API_URL=http://api:3001/api # Docker内部のAPIサービス名
   ```

## 開発

- **開発モードで起動:**
  ```bash
  pnpm dev
  ```
  アプリケーションはデフォルトで `http://localhost:3000` で起動します。

- **ビルド:**
  ```bash
  pnpm build
  ```

- **本番モードで起動:**
  ```bash
  pnpm start
  ```

## UIコンポーネント開発 (Storybook)

- **Storybookの起動:**
  ```bash
  pnpm storybook
  ```
  Storybookはデフォルトで `http://localhost:6006` で起動します。
  UIコンポーネントは `src/components` に作成し、対応するストーリーファイルを `stories` ディレクトリに作成します。
  MSW (`msw-storybook-addon`) を使用して、Storybook内でAPIモックを利用できます。

## テスト

- **単体・結合テストの実行 (Vitest + React Testing Library):**
  ```bash
  pnpm test
  ```

- **E2Eテストの実行 (Playwright):**
  ```bash
  pnpm test:e2e
  ```
  Playwrightは `e2e` ディレクトリ内のテストを実行します。MSWを使用してAPIをモックすることができます。

## PWA設定

`next-pwa` を使用してPWA対応を行います。
設定は `next.config.js` に記述し、必要なマニフェストファイル (`public/manifest.json`) やサービスワーカー (`public/sw.js` - next-pwaが自動生成) を配置します。

## BFF (tRPC)

Next.jsのAPIルート (`src/app/api/trpc/[trpc]/route.ts` や関連ファイル) を使用してtRPCエンドポイントを構築します。
クライアント側 (`src/lib/trpc/client.ts` や `src/lib/trpc/react.tsx` など) でtRPCクライアントをセットアップし、型安全なAPI呼び出しを実現します。
Zodスキーマはバックエンドと共有します (`packages/zod-schemas`)。
tRPCのルーター定義は `apps/api` 側ではなく、この `apps/web` のサーバーサイド（APIルート）で行い、必要に応じて `apps/api` のサービスを呼び出す構成を想定しています。

## APIモック (MSW)

MSW (Mock Service Worker) を使用して、開発中やテスト時にAPIをモックします。

- **ハンドラの定義:**
  APIのモックハンドラは `src/mocks/handlers.ts` に定義します。

- **サービスワーカーの初期化 (初回のみ):**
  MSWをブラウザで利用するためには、サービスワーカーファイルを `public` ディレクトリに配置する必要があります。
  以下のコマンドを `apps/web` ディレクトリで一度だけ実行してください（`msw` パッケージは既にインストール済みです）。
  ```bash
  pnpm exec msw init public/
  ```
  これにより `public/mockServiceWorker.js` が生成されます。このファイルはGitの管理対象に含めてください。

- **Storybookでの利用:**
  `msw-storybook-addon` を通じて、Storybook内でMSWが自動的に有効になります。
  ストーリーファイルや `.storybook/preview.tsx` でグローバルまたはローカルなハンドラを設定できます。

- **開発環境での利用 (Next.js):**
  開発中にNext.jsアプリケーション全体でMSWを有効にするには、`src/mocks/browser.ts` の `worker.start()` をアプリケーションのクライアントサイドエントリーポイント（例: `src/app/layout.tsx` のuseEffect内や、専用の初期化ファイル）で呼び出すように設定します。これは通常、開発モード(`process.env.NODE_ENV === 'development'`)でのみ行います。

- **テストでの利用 (Vitest/Playwright):**
  ユニットテストやE2Eテストでは、`src/mocks/server.ts` を使用してNode.js環境でAPIリクエストをインターセプトします。テストのセットアップファイルでサーバーの起動・リセット・終了処理を行います。
