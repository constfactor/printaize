/**
 * Supabaseデータベースの型定義
 */

export interface DesignImage {
  id: string;
  preview_url: string;
  hd_url: string;
  created_at: string;
  ordered: boolean;
  order_id: string | null;
  shopify_cart_token: string | null;
  metadata: Record<string, any> | null;
}

export interface DesignImageInsert {
  preview_url: string;
  hd_url: string;
  shopify_cart_token?: string;
  metadata?: Record<string, any>;
}
