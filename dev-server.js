import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

installGlobals();

const app = express();

// 静的ファイルの提供（Remixハンドラーより先に処理）
app.use('/build', express.static('public/build', { 
  maxAge: '1y',
  immutable: true 
}));
app.use(express.static('public'));

// すべてのリクエストをRemixに渡す（静的ファイル以外）
app.all('*', async (req, res, next) => {
  try {
    // ビルドを動的にインポート
    const build = await import('./build/index.js');
    return createRequestHandler({
      build: build,
      mode: process.env.NODE_ENV || 'development',
    })(req, res, next);
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ Server is running on http://192.168.0.207:${PORT}`);
});
