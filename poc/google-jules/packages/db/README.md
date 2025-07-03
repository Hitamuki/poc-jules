# データベースパッケージ (Prisma)

このパッケージは、アプリケーションのデータベーススキーマ管理、マイグレーション、およびPrismaクライアントを提供します。

## 技術スタック

- Prisma (ORM)
- PostgreSQL (メインDB)

## ディレクトリ構成

- `prisma`
  - `schema.prisma`: Prismaスキーマ定義ファイル
  - `migrations`: Prismaによって生成されるマイグレーションファイル
- `src`:
  - `index.ts`: PrismaClientのインスタンスをエクスポート

## セットアップ

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。

2. **データベースの起動:**
   プロジェクトルートにある `docker-compose.yml` を使用してPostgreSQLを起動します。
   ```bash
   # docker-compose.yml で定義したサービス名に合わせてください (例: postgresdb)
   docker-compose up -d postgresdb
   ```

3. **環境変数の設定:**
   プロジェクトルートに `.env` ファイルを作成し、データベース接続URLを設定します。
   Prismaは自動的にプロジェクトルートの `.env` ファイルを読み込みます。
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bookmark_todo_db?schema=public"
   ```
   `user`, `password`, `bookmark_todo_db` は `docker-compose.yml` で設定した値に合わせてください。

## Prismaコマンド

このパッケージディレクトリ (`packages/db`) で以下のコマンドを実行します。
または、プロジェクトルートから `pnpm --filter @bookmark-todo-app/db <command>` の形式で実行します。

- **Prisma Clientの生成:**
  スキーマファイル (`schema.prisma`) を変更した後、Prisma Clientを再生成します。
  ```bash
  pnpm db:generate
  ```

- **マイグレーションの作成と適用 (開発時):**
  `schema.prisma` に変更を加え、新しいマイグレーションを作成し、それをデータベースに適用します。
  `--skip-generate` オプションにより、このコマンドではPrisma Clientの再生成は行いません。
  ```bash
  pnpm db:migrate:dev --name your-migration-name
  ```

- **Prisma Studioの起動:**
  データベースの内容をGUIで確認・編集できるPrisma Studioを起動します。
  ```bash
  pnpm db:studio
  ```

## スキーマ設計

`prisma/schema.prisma` ファイルにデータベースのモデルを定義します。
主要なモデル（予定）:

- `User`
- `Profile`
- `Bookmark`
- `Folder`
- `Category`
- `Tag`
- `ScheduledItem` (リマインダーやスケジュール情報)
- `Notification`

## ER図

PrismaのスキーマからER図を生成するには、いくつかの方法があります。

1.  **Prisma ERD Visualizer (オンラインツール):**
    [Prisma ERD Visualizer](https://prisma-erd.simonknott.de/) に `schema.prisma` の内容を貼り付けることでER図を視覚化できます。

2.  **`prisma-erd-generator` (コミュニティツール):**
    `prisma-erd-generator` を使用すると、`prisma generate` を実行するたびにER図 (例: SVGファイル) を自動生成できます。
    まず、devDependencyとしてインストールします:
    ```bash
    pnpm add -D prisma-erd-generator @mermaid-js/mermaid-cli
    ```
    次に、`prisma/schema.prisma` ファイルにジェネレータを追加します:
    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    generator erd {
      provider = "prisma-erd-generator"
      output   = "./ERD.svg" // 出力先を指定
      theme    = "forest"    // テーマ例
    }
    ```
    その後 `pnpm db:generate` を実行すると、指定したパスにER図が生成されます。

3.  **Mermaid.js を使用した手動または半自動生成:**
    `schema.prisma` を元に、Mermaid.js の構文でER図を記述し、Markdownファイルなどで表示することができます。
    これには `prisma-markdown` のようなコミュニティツールが役立つ場合があります。
    ```bash
    # prisma-markdown のインストール (プロジェクトルート or グローバル)
    # pnpm add -g prisma-markdown
    # prisma-markdown --schema ./prisma/schema.prisma --output ./ERD.md --mermaid
    ```
    生成されたMermaid記法をREADMEやドキュメントに埋め込みます。

## Prisma Clientの利用

このパッケージは、初期化済みのPrismaClientインスタンスをエクスポートします。
他のパッケージからインポートして使用できます。

```typescript
// packages/db/src/index.ts の内容
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// 他の型やenumもエクスポートする場合
// export * from '@prisma/client';
```

他のパッケージからの利用例:
```typescript
// apps/api/src/some.service.ts
import prisma from '@bookmark-todo-app/db'; // package.jsonのexports経由で src/index.ts を参照

async function getUsers() {
  return prisma.user.findMany();
}
```
