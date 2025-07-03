# Logger パッケージ

このパッケージは、アプリケーション全体で使用する共通のロギング機能を提供します。
Winstonライブラリをベースにしています。

## 技術スタック

- Winston
- Winston-MongoDB (MongoDBへのログ出力用)

## ディレクトリ構成

- `src`
  - `index.ts`: Loggerインスタンスの作成とエクスポート

## セットアップ

1. **依存関係のインストール:**
   プロジェクトルートで `pnpm install` を実行してください。

## Loggerの設定

`src/index.ts` でWinston Loggerインスタンスを設定します。
コンソール出力、ファイル出力、MongoDBへの出力などが可能です。

環境変数を通じて設定を動的に変更できるようにすることが推奨されます。
例えば、ログレベル (`LOG_LEVEL`) やMongoDB接続URI (`MONGO_LOG_URI`) など。
これらの環境変数は、主にAPIアプリケーション (`apps/api`) の `.env` ファイルで設定されることを想定しています。

## 利用方法

他のパッケージ (特に `apps/api`) からこのロガーをインポートして使用します。

```typescript
// 使用例: apps/api/src/some.service.ts
import logger from '@bookmark-todo-app/logger';

export class SomeService {
  doSomething() {
    logger.info('Doing something important...');
    try {
      // ... some operation
      const result = { data: 'some_data' };
      logger.debug('Operation successful', { meta: result }); // メタデータは第二引数のオブジェクト内に
    } catch (error) {
      // エラーオブジェクトを渡すことで、スタックトレースなども記録可能
      logger.error('Operation failed', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    }
  }
}
```

## 設定例 (`src/index.ts`)

```typescript
// poc/google-jules/packages/logger/src/index.ts
import winston from 'winston';
import 'winston-mongodb'; // Required for MongoDB transport

const { format, transports, createLogger } = winston;
const { combine, timestamp, printf, colorize, errors, json, metadata } = format; // metadata をインポート

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// MONGO_LOG_URI は apps/api などの利用側で .env から読み込まれ、
// logger が初期化される際に process.env を参照します。
const MONGO_LOG_URI = process.env.MONGO_LOG_URI;

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  let log = `${ts} ${level}: ${stack || message}`;
  if (meta && Object.keys(meta).length && !(meta.hasOwnProperty('message') && Object.keys(meta).length === 1)) {
    // 'message' プロパティのみの場合は冗長なので表示しない
    const metaString = JSON.stringify(meta, null, 2);
    if (metaString !== '{}') {
       log += `\n${metaString}`;
    }
  }
  return log;
});


const loggerTransports: winston.transport[] = [
  new transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }), // Log stack traces
      metadata(), // metadata オブジェクトを生成
      consoleFormat
    ),
    handleExceptions: true, // 未捕捉の例外をログに記録
    handleRejections: true, // 未捕捉のPromiseリジェクションをログに記録
  }),
];

if (MONGO_LOG_URI) {
  loggerTransports.push(
    new transports.MongoDB({
      level: LOG_LEVEL,
      db: MONGO_LOG_URI,
      options: {
        useUnifiedTopology: true, // MongoDBドライバのオプション
      },
      collection: 'logs', // MongoDBのコレクション名
      format: combine(
        errors({ stack: true }), // エラースタックをMongoDBにも保存
        timestamp(),
        metadata(), // metadata オブジェクトを生成
        json() // ログをJSON形式でMongoDBに保存
      ),
      metaKey: 'meta', // 追加のメタデータを 'meta' フィールドに保存 (winston-mongodb v5では挙動が異なる可能性あり、通常はmetadata() formatで十分)
      handleExceptions: true,
      handleRejections: true,
    } as any) // 'any' キャストは winston-mongodb の型定義との互換性問題のため
  );
} else {
  // MongoDBが設定されていない場合のフォールバックとしてファイルロギング
  loggerTransports.push(
    new transports.File({
      filename: 'logs/error.log', // logsディレクトリを作成する必要がある場合あり
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), json()),
      handleExceptions: true,
      handleRejections: true,
    })
  );
  loggerTransports.push(
    new transports.File({
      filename: 'logs/combined.log', // logsディレクトリを作成する必要がある場合あり
      format: combine(timestamp(), errors({ stack: true }), json()),
      handleExceptions: true,
      handleRejections: true,
    })
  );
}

const logger = createLogger({
  level: LOG_LEVEL,
  format: combine(
    timestamp(),
    errors({ stack: true }), // グローバルにスタックトレースをキャプチャ
    metadata(), // metadata() をグローバルフォーマットにも追加
    json() // デフォルトフォーマット (他のトランスポートで上書きされない場合)
  ),
  defaultMeta: { service: 'application' }, // 全てのログに付与されるデフォルトメタデータ
  transports: loggerTransports,
  exitOnError: false, // ハンドルされた例外で終了しない
});

export default logger;
```
**注意:** ファイルトランスポートを使用する場合、ログファイルが出力される `logs` ディレクトリが実行時に存在しているか、アプリケーションが作成する権限を持っている必要があります。
