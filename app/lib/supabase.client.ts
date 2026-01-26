/**
 * Supabaseクライアント（ブラウザ用）
 */

import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabase設定を取得
const supabaseUrl = typeof window !== 'undefined' 
  ? window.ENV?.SUPABASE_URL 
  : process.env.SUPABASE_URL || '';

const supabaseAnonKey = typeof window !== 'undefined'
  ? window.ENV?.SUPABASE_ANON_KEY
  : process.env.SUPABASE_ANON_KEY || '';

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
