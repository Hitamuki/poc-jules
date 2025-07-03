# Web API (NestJS)

このパッケージは、ブックマーク・リーディングリストToDoアプリのバックエンドAPIです。
NestJSフレームワークとDDD（ドメイン駆動設計）の原則に基づいて構築されています。

## 技術スタック

- NestJS
- Passport (JWT認証)
- Prisma (ORM)
- Winston (ロギング)
- Zod (バリデーション)
- Vitest (テスト)

## ディレクトリ構成 (予定)

- `src`
  - `main.ts`: アプリケーションのエントリーポイント
  - `app.module.ts`: ルートモジュール
  - `config`: 設定関連 (環境変数など)
  - `common`: 共通モジュール、ユーティリティ
  - `modules`: 各機能モジュール
    - `auth`: 認証モジュール
    - `users`: ユーザー管理モジュール
    - `bookmarks`: ブックマーク管理モジュール
    - `tags`: タグ管理モジュール
    - `categories`: カテゴリ管理モジュール
    - ... (その他機能モジュール)
  - `core` (DDD)
    - `application`: アプリケーションサービス、ユースケース
    - `domain`: エンティティ、値オブジェクト、ドメインサービス、リポジトリインターフェース
    - `infrastructure`: リポジトリ実装、外部サービス連携
    - `presentation`: コントローラー、DTO

## 環境構築

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。

2. **データベースのセットアップ:**
   プロジェクトルートの `docker-compose.yml` を使用してPostgreSQLとMongoDBを起動してください。
   ```bash
   docker-compose up -d
   ```
   Prismaのマイグレーションを実行してください（`packages/db` ディレクトリで `pnpm prisma migrate dev`）。

3. **環境変数の設定:**
   `.env` ファイルをこのディレクトリに作成し、必要な環境変数を設定します。
   例:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRATION_TIME="3600s"
   REFRESH_TOKEN_SECRET="your-refresh-secret-key"
   REFRESH_TOKEN_EXPIRATION_TIME="7d"
   # MongoDB Connection String for Logging
   MONGO_LOG_URI="mongodb://localhost:27017/applogs"
   ```

## 開発

- **開発モードで起動:**
  ```bash
  pnpm start:dev
  ```
  APIはデフォルトで `http://localhost:3001` で起動します（ポートは変更可能）。

- **ビルド:**
  ```bash
  pnpm build
  ```

- **本番モードで起動:**
  ```bash
  pnpm start:prod
  ```

## テスト

- **単体テスト・統合テストの実行:**
  ```bash
  pnpm test
  ```

- **テストカバレッジの表示:**
  ```bash
  pnpm test:cov
  ```

## APIエンドポイント (設計中)

RESTful APIとして設計します。詳細は別途API仕様書で定義します。
主要なリソース:

- `/auth`
- `/users`
- `/profiles`
- `/bookmarks`
- `/folders`
- `/categories`
- `/tags`

レスポンス形式、DTO、エラーコードも標準化します。

## ロギング

Winstonを使用してログを記録します。ログはコンソールおよびMongoDB（設定時）に出力されます。

## バリデーション

Zodを使用してリクエストのバリデーションとレスポンスの型チェックを行います。
スキーマは `packages/zod-schemas` で共有されます。
