# Zodスキーマパッケージ

このパッケージは、アプリケーション全体 (フロントエンド、バックエンド) で共有されるZodスキーマを定義します。
データのバリデーションや型の推論に使用されます。

## 技術スタック

- Zod

## ディレクトリ構成 (予定)

- `src`
  - `index.ts`: 主要なスキーマのエクスポート
  - `auth.ts`: 認証関連スキーマ (例: ログイン、登録)
  - `bookmark.ts`: ブックマーク関連スキーマ
  - `user.ts`: ユーザー関連スキーマ
  - `common.ts`: 共通的に使われるスキーマ (例: ID、ページネーション)
  - ... (その他、エンティティやDTOごとのスキーマファイル)

## セットアップ

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。

## スキーマの定義

各ファイルにZodを使用してスキーマを定義します。
`src` ディレクトリ内の各ファイル (例: `auth.ts`, `bookmark.ts`) でスキーマを定義し、`src/index.ts` からそれらをまとめてエクスポートします。

例 (`src/common.ts`):
```typescript
import { z } from 'zod';

export const PositiveIntString = z.string().regex(/^[1-9]\d*$/, "ID must be a positive integer string");

export const IdSchema = z.object({
  id: PositiveIntString, // Or z.coerce.number().int().positive() if the ID is numeric
});
export type IdInput = z.infer<typeof IdSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  // sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  // sortBy: z.string().optional(), // Add specific sortable fields if needed
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
```

例 (`src/auth.ts`):
```typescript
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters long").max(30),
  // confirmPassword: z.string().min(8), // Example
}).refine(data => data.password === data.confirmPassword, { // Example refinement
  message: "Passwords do not match",
  path: ["confirmPassword"], // Path of error
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
```

## 利用方法

フロントエンド (`apps/web`, `apps/mobile`) やバックエンド (`apps/api`) からスキーマをインポートして使用します。
`package.json` の `exports` 設定により、サブパス (`@bookmark-todo-app/zod-schemas/auth` など) でのインポートが可能です。

**フロントエンド (Next.js / React Hook Form の例):**
```tsx
// apps/web/src/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginInput } from '@bookmark-todo-app/zod-schemas/auth';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    console.log(data);
    // API call
  };
  // ... render form ...
}
```

**バックエンド (NestJS DTO / Pipe の例):**
NestJSでは `zod-nestjs` (非推奨) や `nestjs-zod` といったライブラリを使うと、Zodスキーマから直接DTOやPipeを生成できて便利です。
`nestjs-zod` を利用する場合:
1.  `apps/api` に `nestjs-zod` をインストール: `pnpm --filter @bookmark-todo-app/api add nestjs-zod`
2.  `apps/api/src/main.ts` などでパッチを適用: `patchNestJsSwagger();`

```typescript
// apps/api/src/auth/dto/login.dto.ts
// No DTO class needed if using nestjs-zod pipe directly with schema
// import { createZodDto } from 'nestjs-zod';
// import { LoginSchema } from '@bookmark-todo-app/zod-schemas/auth';
// export class LoginDto extends createZodDto(LoginSchema) {}
```

```typescript
// apps/api/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginSchema } from '@bookmark-todo-app/zod-schemas/auth';
import { ZodValidationPipe } from 'nestjs-zod'; // or import globally in main.ts
import type { LoginInput } from '@bookmark-todo-app/zod-schemas/auth';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginInput) {
    // loginDto is now validated and typed according to LoginSchema
    // ... login logic
    return { message: 'Login successful', user: loginDto.email };
  }
}
```

## エクスポート構造

各スキーマファイル (`auth.ts`, `user.ts` など) で定義されたスキーマは、それぞれのファイルからエクスポートされます。
そして、`src/index.ts` でこれらのモジュールを再エクスポートすることで、利用側は以下のようにアクセスできます。

-   `import { LoginSchema } from '@bookmark-todo-app/zod-schemas';` (もし `index.ts` で `export * from './auth'` している場合)
-   `import { LoginSchema } from '@bookmark-todo-app/zod-schemas/auth';` (より明確なパス、`package.json` の `exports` で `"./*": "./src/*"` が設定されている場合)

後者の方法が、どのカテゴリのスキーマであるかが明確になるため推奨されます。
`src/index.ts` は、最も共通的に使われるものや、パッケージ全体としてのエントリーポイントとして機能します。
```typescript
// src/index.ts
export * from './common'; // Common schemas might be exported directly
// Specific schemas are typically imported via their subpath
// e.g. import { LoginSchema } from '@bookmark-todo-app/zod-schemas/auth';
```
