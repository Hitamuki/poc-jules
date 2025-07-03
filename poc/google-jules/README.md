# ブックマーク・リーディングリスト ToDoアプリ

ブックマークやリーディングリストをToDoのように管理できるWebアプリケーションです。

## 概要

このアプリケーションは、日常的に収集する情報を効率的に整理し、活用することを目的としています。
ブックマーク、記事、アイデアなどを一元管理し、タグ、カテゴリ、ステータス、リマインダー、スケジュールなどの機能を用いて、タスクのように扱うことができます。

## 技術スタック

主要な技術スタックは以下の通りです。詳細については、各パッケージのREADMEを参照してください。

- **モノレポ:** pnpm Workspace
- **Web API:** NestJS (DDD)
- **フロントエンド:** Next.js (App Router)
- **UI:** Tailwind CSS, shadcn/ui, Material UI
- **モバイルアプリ:** React Native (Expo)
- **データベース:** PostgreSQL, MongoDB (Docker)
- **ORM:** Prisma
- **認証:** Passport × JWT
- **状態管理:** Jotai
- **バリデーション:** Zod
- **テスト:** Vitest, React Testing Library, Playwright
- **モックAPI:** MSW
- **コンポーネント管理:** Storybook
- **静的解析:** Biome
- **ロギング:** Winston

## ディレクトリ構成

- `apps/api`: Web API (NestJS)
- `apps/web`: Webフロントエンド (Next.js)
- `apps/mobile`: モバイルアプリ (React Native with Expo)
- `packages/db`: Prismaスキーマ、マイグレーション
- `packages/ui`: 共通UIコンポーネント (Storybook)
- `packages/logger`: 共通ロガーモジュール
- `packages/zod-schemas`: Zodスキーマ定義

## セットアップ

1. **リポジトリのクローン:**
   ```bash
   git clone <repository-url>
   cd bookmark-todo-app
   ```

2. **pnpmのインストール (まだインストールしていない場合):**
   ```bash
   npm install -g pnpm
   ```

3. **依存関係のインストール:**
   ```bash
   pnpm install
   ```

4. **Dockerコンテナの起動 (データベース):**
   ```bash
   docker-compose up -d
   ```

5. **各アプリケーションの起動:**
   各アプリケーションのディレクトリ（`apps/api`, `apps/web`, `apps/mobile`）に移動し、それぞれのREADMEに記載されている手順でアプリケーションを起動してください。

## コマンド

プロジェクトルートで実行可能な共通コマンド:

- `pnpm lint`: プロジェクト全体のコードをBiomeで静的解析します。
- `pnpm format`: プロジェクト全体のコードをBiomeでフォーマットします。

各パッケージ固有のコマンドについては、それぞれの`package.json`および`README.md`を参照してください。

## フェーズ

開発は以下のフェーズで進められます。

1. モノレポ初期構成
2. 必要なパッケージ導入
3. Prismaのモデル設計（ER図も出力して）
4. Web API
   - DDDの構成
5. PWA対応のWeb画面
   - Next.jsの画面ルーティング構成（App Router）
   - UIコンポーネント生成（Storybook付き）
6. モバイルアプリ

## 貢献

貢献方法については、CONTRIBUTING.md（作成予定）を参照してください。
（もしあれば）

## ライセンス

このプロジェクトは MIT ライセンスです。詳細は LICENSE ファイル（作成予定）を参照してください。
（もしあれば）
