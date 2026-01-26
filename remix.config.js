/**
 * Remixの設定ファイル
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*"],
  publicPath: "/build/",
  server: "./server.js", // Vercel用のサーバーエントリポイント
  serverBuildPath: "api/index.js", // Vercelのサーバーレス関数パス
};
