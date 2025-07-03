# モバイルアプリ (React Native with Expo)

このパッケージは、ブックマーク・リーディングリストToDoアプリのモバイルアプリケーションです。
React Native と Expo を使用して開発されます。

## 技術スタック

- React Native
- Expo (SDK, Router)
- Jotai (状態管理)
- Zod (バリデーション)
- Vitest (テスト)

## ディレクトリ構成 (予定)

- `app`: Expo Router のルーティングディレクトリ
  - `(auth)`: 認証関連ルート
  - `(tabs)`: タブベースのナビゲーションルート
    - `_layout.tsx`: タブレイアウト
    - `index.tsx`: ダッシュボード画面
    - `bookmarks.tsx`: ブックマーク一覧画面
    - `calendar.tsx`: カレンダー画面
    - `settings.tsx`: 設定画面
  - `modal.tsx`: モーダル画面
  - `_layout.tsx`: ルートレイアウト
- `assets`: 画像、フォントなどの静的アセット
- `components`: UIコンポーネント
  - `common`: 共通コンポーネント
  - `features`: 機能特化コンポーネント
- `constants`: 定数 (テーマカラー、APIエンドポイントなど)
- `hooks`: カスタムフック
- `lib`: ユーティリティ関数
- `services`: APIクライアント、サービス連携
- `store`: Jotaiアトム定義
- `styles`: 共通スタイルシート
- `types`: 型定義

## 環境構築

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。
   その後、このディレクトリで `pnpm install` を実行して、ネイティブ依存関係を解決する必要があるかもしれません（Expoのバージョンやpnpmのワークスペース設定による）。

2. **Expo Goアプリのインストール:**
   開発に使用するスマートフォンにExpo Goアプリをインストールしてください。

3. **環境変数の設定:**
   環境変数は `constants` や設定ファイル内で管理します。
   例: `src/constants/config.ts`
   ```typescript
   export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
   ```
   `.env` ファイルを作成し、`EXPO_PUBLIC_` プレフィックスを付けて環境変数を定義できます。
   ```env
   EXPO_PUBLIC_API_URL=https://your-api.com/api
   ```

## 開発

- **開発サーバーの起動:**
  ```bash
  pnpm start
  ```
  または
  ```bash
  npx expo start
  ```
  QRコードが表示されるので、Expo Goアプリでスキャンしてアプリを開きます。

- **Androidエミュレータ/デバイスで起動:**
  ```bash
  pnpm android
  ```

- **iOSシミュレータ/デバイスで起動:**
  ```bash
  pnpm ios
  ```

- **Web版で起動 (開発用):**
  ```bash
  pnpm web
  ```

## テスト

- **単体テストの実行 (Vitest):**
  ```bash
  pnpm test
  ```
  React Nativeコンポーネントのテストには追加の設定が必要になる場合があります（例: `react-native-testing-library`）。

## ビルドとデプロイ

Expo EAS (Expo Application Services) を使用して、アプリのビルドとストアへのデプロイを行います。
詳細はExpoのドキュメントを参照してください。

- **EAS CLIのインストール:**
  ```bash
  npm install -g eas-cli
  ```

- **EASへのログイン:**
  ```bash
  eas login
  ```

- **ビルド設定 (`eas.json`):**
  プロジェクトルートまたはこのディレクトリに `eas.json` を作成してビルドプロファイルを構成します。

- **ビルドの実行例 (Android):**
  ```bash
  eas build -p android --profile preview
  ```
