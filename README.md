# 🎨 PrintAIze

**PrintAIze** は、**AI画像生成** と **Shopify** を統合した、次世代のカスタムプリントデザインプラットフォームです。

## ✨ 主な機能

### 🤖 AI画像生成
- **Replicate**を使用してテキストから画像を生成
- Stable Diffusion XLで高品質な画像生成
- プロンプトを入力するだけで、オリジナルデザインを作成

### 📷 画像編集
- 複数画像のアップロード＆重ね合わせ
- ドラッグ＆ドロップで位置移動
- 拡大縮小・回転
- グレースケール・セピア・明るさ調整フィルター

### ✏️ テキスト編集
- フリーテキストの追加
- フォント8種類から選択
- サイズ調整（10px〜100px）
- カラーピッカーで自由に色変更

### ↶↷ 履歴管理
- 元に戻す/やり直し機能
- 最大50ステップまで保存

### 🛒 Shopify統合
- カートに直接追加
- Shopify Storefront APIで決済
- カスタムデザイン情報を商品に付与

---

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- Shopifyストア
- Replicateアカウント

### 1. リポジトリのクローン

```bash
git clone <your-repo>
cd printaize
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成：

```env
# Replicate API設定
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxx

# Shopify設定
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

#### Replicate APIトークンの取得方法

1. [Replicate](https://replicate.com/)にサインアップ
2. ダッシュボードから API Token を取得
3. `.env` ファイルに設定

#### Shopify Storefront APIトークンの取得方法

1. Shopify管理画面 → アプリ → アプリと販売チャネルを開発する
2. カスタムアプリを作成
3. Storefront API アクセストークンを生成
4. `.env` ファイルに設定

### 4. 商品バリアントIDの設定

`app/lib/shopify.server.ts` と `app/components/PrintAIzeCustomizer.tsx` で、実際の商品のバリアントIDに変更してください：

```typescript
// 現在: "gid://shopify/ProductVariant/YOUR_VARIANT_ID"
// 変更後: "gid://shopify/ProductVariant/1234567890"
```

バリアントIDは、Shopify管理画面の商品ページから取得できます。

### 5. 開発サーバーの起動

```bash
npm run dev
```

アプリは http://localhost:3000 で起動します。

---

## 📁 プロジェクト構造

```
printaize/
├── app/
│   ├── components/
│   │   └── PrintAIzeCustomizer.tsx    # メインカスタマイザーコンポーネント
│   ├── lib/
│   │   ├── replicate.server.ts     # Replicate AI統合
│   │   └── shopify.server.ts       # Shopify API統合
│   ├── routes/
│   │   ├── _index.tsx              # トップページ
│   │   ├── api.generate-image.tsx  # AI画像生成API
│   │   └── api.add-to-cart.tsx     # カート追加API
│   ├── entry.client.tsx            # クライアントエントリー
│   ├── entry.server.tsx            # サーバーエントリー
│   └── root.tsx                    # ルートレイアウト
├── public/
│   └── images/
│       └── tshirt-mockup.svg       # Tシャツモックアップ
├── package.json                    # 依存関係
├── remix.config.js                 # Remix設定
└── tsconfig.json                   # TypeScript設定
```

---

## 🎯 使い方

### お客さん向けの操作フロー

1. **AI画像生成**
   - プロンプト入力欄に「宇宙を飛ぶ猫」などを入力
   - 「✨ AIで画像生成」ボタンをクリック
   - 生成された画像が自動的にキャンバスに配置される

2. **画像アップロード**
   - 「📤 画像をアップロード」ボタンをクリック
   - 複数の画像を選択可能
   - ドラッグして位置調整、ハンドルで拡大縮小

3. **テキスト追加**
   - テキスト入力欄に文字を入力
   - フォント・サイズ・色を選択
   - 「➕ テキストを追加」ボタンをクリック

4. **フィルター適用**
   - 画像を選択
   - グレースケール・セピア・明るさ調整を適用

5. **カートに追加**
   - デザインが完成したら「🛒 カートに追加」ボタンをクリック
   - Shopifyのチェックアウトページにリダイレクト

---

## 💰 コスト

### Replicate AI

- 画像生成1枚: 約 $0.01（約1.5円）
- 月1000枚生成: 約 $10（約1,500円）
- 月10000枚生成: 約 $100（約15,000円）

### Shopify

- Shopify月額プラン料金（Basic: $29〜）
- 取引手数料（プランによる）

---

## 🔧 カスタマイズ

### AIモデルの変更

`app/lib/replicate.server.ts` で使用するモデルを変更できます：

```typescript
const output = await replicate.run(
  "stability-ai/sdxl:...",  // ここを変更
  { input: { ... } }
);
```

### Tシャツモックアップの変更

`public/images/tshirt-mockup.svg` を別の画像に置き換えてください。

### UIカラーの変更

`app/routes/_index.tsx` と `app/components/PrintAIzeCustomizer.tsx` でスタイルを変更できます。

---

## 🐛 トラブルシューティング

### AI画像生成が失敗する

- `REPLICATE_API_TOKEN` が正しく設定されているか確認
- Replicateアカウントにクレジットがあるか確認
- ブラウザのコンソールでエラーメッセージを確認

### カートに追加できない

- `SHOPIFY_STORE_DOMAIN` と `SHOPIFY_STOREFRONT_ACCESS_TOKEN` が正しいか確認
- 商品バリアントIDが正しいか確認
- Shopify管理画面で商品が公開されているか確認

---

## 📝 開発のヒント

- コード内の各ステップにコメントが付いています
- Replicate: https://replicate.com/docs
- Shopify Storefront API: https://shopify.dev/docs/api/storefront
- Remix: https://remix.run/docs

---

## 📄 ライセンス

MIT

---

## 🎉 デプロイ

### Vercel

```bash
npm run build
vercel --prod
```

### Shopify Oxygen

```bash
npm run build
shopify app deploy
```

---

**Happy Designing with AI! 🎨✨🤖**
