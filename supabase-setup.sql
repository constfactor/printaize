-- PrintAIzeデザイン画像管理テーブル
-- このSQLをSupabaseのSQL Editorで実行してください

CREATE TABLE IF NOT EXISTS design_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preview_url TEXT NOT NULL,
  hd_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ordered BOOLEAN DEFAULT false,
  order_id TEXT,
  shopify_cart_token TEXT,
  metadata JSONB
);

-- インデックスを作成（検索を高速化）
CREATE INDEX idx_design_images_created_at ON design_images(created_at);
CREATE INDEX idx_design_images_ordered ON design_images(ordered);
CREATE INDEX idx_design_images_hd_url ON design_images(hd_url);

-- RLSポリシーを有効化
ALTER TABLE design_images ENABLE ROW LEVEL SECURITY;

-- 誰でも挿入できる（匿名ユーザーも）
CREATE POLICY "Anyone can insert design_images"
  ON design_images
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 誰でも読み取れる
CREATE POLICY "Anyone can read design_images"
  ON design_images
  FOR SELECT
  TO public
  USING (true);

-- 誰でも更新できる（注文状態の更新用）
CREATE POLICY "Anyone can update design_images"
  ON design_images
  FOR UPDATE
  TO public
  USING (true);

COMMENT ON TABLE design_images IS 'PrintAIzeのデザイン画像を管理するテーブル。注文済み/未注文を追跡し、未注文の古い画像を自動削除する。';
