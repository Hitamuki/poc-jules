# UIパッケージ

このパッケージは、アプリケーション全体で使用される共通UIコンポーネントを提供します。
shadcn/uiの思想に基づき、再利用可能でカスタマイズ可能なコンポーネントを構築します。
Storybookを使用してコンポーネントの開発とカタログ化を行います。

## 技術スタック

- React
- Tailwind CSS
- shadcn/ui (思想と一部コンポーネントを参考に、必要に応じて移植・作成)
- Storybook (Viteベース)
- Vitest (コンポーネントテスト)
- MSW (Storybook内でのAPIモック)
- Lucide Icons
- class-variance-authority (CVA)
- clsx, tailwind-merge

## ディレクトリ構成 (予定)

- `src`: UIコンポーネントのソースコード
  - `components`: 各コンポーネントのディレクトリ
    - `Button`: Buttonコンポーネント
      - `Button.tsx`
      - `Button.stories.tsx`
      - `Button.test.tsx` (任意)
      - `index.ts` (コンポーネントをエクスポート)
    - ... (他のコンポーネント)
  - `lib`: コンポーネントライブラリ内部で使用するユーティリティ
    - `utils.ts`: `cn` 関数など
  - `styles`: UIパッケージ特有のCSS (例: `globals.css` にベーススタイルやCSS変数定義)
  - `index.ts`: `src/components` から主要なコンポーネントをまとめてエクスポート
- `.storybook`: Storybookの設定ファイル群 (main.ts, preview.ts)
- `tailwind.config.js`, `postcss.config.js`: このUIパッケージ用のTailwind CSS設定

## コンポーネントの追加方針 (shadcn/uiスタイル)

shadcn/ui のように、CLIでコンポーネントを「インストール」するのではなく、この `packages/ui/src/components` ディレクトリにコンポーネントのソースコードを直接追加・管理します。
これにより、コンポーネントの内部実装をプロジェクトの必要に応じて自由にカスタマイズできます。

基本的な流れ:

1.  `src/components` 内に新しいコンポーネント用のディレクトリを作成 (例: `MyComponent`)。
2.  `MyComponent.tsx` にコンポーネントのロジックとJSXを記述します。
3.  (任意) スタイルやバリアントのためにCVA (`class-variance-authority`) を使用した定義ファイルを作成。
4.  `MyComponent.stories.tsx` を作成し、Storybookで表示するためのストーリーを記述します。
5.  (任意) `MyComponent.test.tsx` を作成し、Vitestで単体テストを記述します。
6.  `src/components/MyComponent/index.ts` でコンポーネントをエクスポートし、それを `src/index.ts` で再度エクスポートします。

## Storybookの利用

- **Storybookの起動:**
  ```bash
  pnpm storybook
  ```
  Storybookはデフォルトで `http://localhost:6007` で起動します。

- **Tailwind CSSの統合:**
  `@storybook/react-vite` を使用しているため、ViteのPostCSSパイプラインが自動的に適用され、Tailwind CSSがStorybook内で機能します。
  `.storybook/preview.ts` でグローバルなCSS (Tailwindのベースレイヤーなど) をインポートする必要があります。

## ビルド

```bash
pnpm build
```
TypeScriptでコンパイルし、JavaScriptファイルと型定義ファイルを `dist` ディレクトリに出力します。
`copy-styles` スクリプトにより、`src` 内のCSSファイルも `dist` にコピーされます。

## 他のパッケージからの利用

このパッケージで作成・エクスポートされたコンポーネントは、`apps/web` や `apps/mobile` (React Nativeの場合はWebコンポーネントの直接利用は限定的) からインポートして使用できます。

例 (`apps/web` での使用):
```tsx
import { Button } from '@bookmark-todo-app/ui';
// もし `tailwind.config.js` の `content` にこのuiパッケージのパスが正しく設定されていれば、
// ButtonコンポーネントのTailwindクラスも `apps/web` のビルド時に処理されます。

function MyPage() {
  return <Button>Click me</Button>;
}
```

## Tailwind CSS設定の共有と分離

-   **`packages/ui/tailwind.config.js`**: このUIパッケージ内のコンポーネントが開発時 (Storybookなど) に必要とする最小限のTailwind設定（プラグインなど）を定義します。テーマ（色、フォント、スペーシングなど）の具体的な値は、利用側アプリの設定に委ねるのが理想です。
-   **`apps/web/tailwind.config.js` (利用側)**:
    -   `presets`: `packages/ui/tailwind.config.js` をプリセットとして読み込むことができます。
    -   `content`: `packages/ui/src/**/*.{ts,tsx}` を含めることで、UIパッケージ内のTailwindクラスがスキャンされ、最終的なCSSに含められます。
    -   ここでアプリケーション固有のテーマカスタマイズ（色、フォントなど）を定義します。

```javascript
// packages/ui/tailwind.config.js (例)
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // or 'media'
  content: ["./src/**/*.{ts,tsx}"], //
  theme: {
    extend: {
      // UIライブラリとして共通で提供したい最小限の拡張（例: キーフレームアニメーション）
    },
  },
  plugins: [require("tailwindcss-animate")],
};

// apps/web/tailwind.config.js (例)
const uiPackageTailwindConfig = require('@bookmark-todo-app/ui/tailwind.config'); // プリセットとして読み込む場合

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [uiPackageTailwindConfig], // UIパッケージの設定を継承
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', // ★重要
  ],
  theme: {
    extend: {
      colors: { // アプリ固有のカラーパレット
        primary: 'var(--color-primary)',
      },
      // ... アプリ固有のテーマ拡張
    },
  },
  plugins: [
    // アプリ固有のTailwindプラグイン
    // uiPackageTailwindConfig.plugins は presets で継承される
  ],
};
```
この設定により、UIパッケージは自身のコンポーネントに必要な基本的なTailwind設定を持ちつつ、最終的なテーマ（色など）は利用側のアプリケーションで決定できるようになります。
`@bookmark-todo-app/ui/tailwind.config` のパスは、`package.json` の `exports` フィールドで適切に公開する必要があります。
`packages/ui/package.json` に以下を追加:
```json
  "exports": {
    ".": "./src/index.ts",
    "./tailwind.config": "./tailwind.config.js", // これを追加
    "./*": "./src/*"
  }
```
