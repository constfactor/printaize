-- 未注文の古い画像を自動削除する関数
-- このSQLをSupabaseのSQL Editorで実行してください

CREATE OR REPLACE FUNCTION cleanup_unordered_images()
RETURNS TABLE(deleted_count INTEGER, deleted_urls TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cleanup_days INTEGER := 30; -- 30日以前の未注文画像を削除
  deleted_images RECORD;
  total_deleted INTEGER := 0;
  urls_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- 削除対象の画像を選択
  FOR deleted_images IN
    SELECT id, preview_url, hd_url
    FROM design_images
    WHERE ordered = false
      AND created_at < NOW() - INTERVAL '1 day' * cleanup_days
  LOOP
    -- Supabase Storageから画像を削除
    -- 注意: この部分はSupabase Edge Functionで実装する必要があります
    -- SQLだけではStorageファイルを削除できません
    
    -- データベースレコードを削除
    DELETE FROM design_images WHERE id = deleted_images.id;
    
    total_deleted := total_deleted + 1;
    urls_list := array_append(urls_list, deleted_images.hd_url);
  END LOOP;
  
  -- 結果を返す
  RETURN QUERY SELECT total_deleted, urls_list;
END;
$$;

-- 手動実行例:
-- SELECT * FROM cleanup_unordered_images();

COMMENT ON FUNCTION cleanup_unordered_images() IS '30日以前の未注文画像をデータベースから削除する関数。Storageファイルの削除はEdge Functionで実装する必要がある。';
