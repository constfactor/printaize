/**
 * Remixの設定ファイル
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*"],
  publicPath: "/build/",
  server: "./server.js", // Vercel用のサーバーエントリポイント
  serverBuildPath: "api/index.js", // Vercelのサーバーレス関数パス
};
