# PrintAIze - Theme App Extension セットアップガイド

## 概要

PrintAIzeをShopify Theme App Extensionとして統合するためのセットアップが完了しました。
これにより、iframeを使わずにShopifyテーマに直接統合できます。

## セットアップ手順

### 1. Shopify パートナーアカウントでアプリを設定

1. [Shopify Partners](https://partners.shopify.com/)にログイン
2. 「アプリ」→「アプリを作成」をクリック
3. アプリ名：`PrintAIze`
4. アプリURL：`https://printaize.vercel.app`
5. リダイレクトURL：`https://printaize.vercel.app/auth/callback`
6. 作成後、**Client ID**と**Client Secret**をコピー

### 2. 設定ファイルを更新

`shopify.app.toml`を編集：

```toml
client_id = "YOUR_CLIENT_ID_HERE"

[build]
dev_store_url = "YOUR_DEV_STORE.myshopify.com"
```

### 3. Shopifyアプリにログイン

```bash
npm run shopify -- auth login
```

### 4. 開発サーバーを起動

```bash
npm run shopify:dev
```

これにより：
- Shopify CLIが開発サーバーを起動
- Theme App Extensionが開発ストアに自動インストール
- ブラウザが自動的に開く

### 5. テーマエディターで確認

1. Shopify管理画面 → オンラインストア → テーマ → カスタマイズ
2. 左側のパネルで「アプリブロック」セクションを見つける
3. 「PrintAIze Designer」ブロックを追加
4. 好きな場所に配置

### 6. 本番デプロイ

```bash
npm run shopify:deploy
```

## ファイル構造

```
printaize/
├── shopify.app.toml                 # Shopifyアプリ設定
├── extensions/
│   └── printaize-theme-extension/
│       ├── shopify.extension.toml   # Extension設定
│       └── blocks/
│           ├── printaize-designer.json
│           └── printaize-designer.liquid
```

## 注意事項

### 現在の実装について

現在の`printaize-designer.liquid`は**シンプルなスクリプトローダー**になっています。
これは以下の理由によります：

1. **RemixアプリはSPA（Single Page Application）**として動作
2. Theme App Extensionは**Liquid**ファイルを使用
3. 完全に統合するには、RemixアプリをShopify用に再構築する必要がある

### 次のステップ（オプション）

より良い統合のために、以下を検討してください：

1. **Web Component化**
   - RemixアプリをWeb Componentとしてビルド
   - Shopifyテーマに簡単に統合

2. **APIベースのアプローチ**
   - Remixアプリはバックエンド/APIとして機能
   - Theme App ExtensionはUIのみ（Liquid + JavaScript）

3. **Hydrogen移行**
   - Shopify Hydrogenで完全に再構築
   - 最も統合された体験

## トラブルシューティング

### エラー: "App not found"

`shopify.app.toml`の`client_id`が正しいか確認してください。

### エラー: "Extension not found"

```bash
npm run shopify -- app config push
```

を実行して、Extension設定をプッシュしてください。

### 開発サーバーが起動しない

```bash
npm run shopify -- auth logout
npm run shopify -- auth login
```

でログインし直してください。

## サポート

問題がある場合は、[Shopify CLI ドキュメント](https://shopify.dev/docs/api/shopify-cli)を参照してください。
