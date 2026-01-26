// Supabase Edge Function: 未注文の古い画像を自動削除
// デプロイコマンド: supabase functions deploy cleanup-images
// Cron設定: Supabaseダッシュボードで毎日実行するように設定

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORSプリフライト
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Supabaseクライアントを作成
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const CLEANUP_DAYS = 30; // 30日以前の未注文画像を削除
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_DAYS);

    console.log(`削除対象: ${cutoffDate.toISOString()} 以前の未注文画像`);

    // 削除対象の画像を取得
    const { data: imagesToDelete, error: fetchError } = await supabase
      .from("design_images")
      .select("id, preview_url, hd_url")
      .eq("ordered", false)
      .lt("created_at", cutoffDate.toISOString());

    if (fetchError) {
      throw new Error(`画像取得エラー: ${fetchError.message}`);
    }

    if (!imagesToDelete || imagesToDelete.length === 0) {
      console.log("削除対象の画像なし");
      return new Response(
        JSON.stringify({ 
          success: true, 
          deletedCount: 0, 
          message: "削除対象の画像なし" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`削除対象: ${imagesToDelete.length}件`);

    let deletedCount = 0;
    const errors: string[] = [];

    // 各画像を削除
    for (const image of imagesToDelete) {
      try {
        // Storageからファイルを削除
        // プレビュー画像（Cloudinary）は削除不要（外部サービス）
        
        // HD画像（Supabase Storage）を削除
        if (image.hd_url.includes("supabase.co/storage")) {
          // URLからファイルパスを抽出
          const urlParts = image.hd_url.split("/printaize/");
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            
            const { error: deleteError } = await supabase.storage
              .from("printaize")
              .remove([filePath]);

            if (deleteError) {
              console.warn(`Storage削除エラー: ${filePath}`, deleteError);
              errors.push(`Storage削除失敗: ${filePath}`);
            } else {
              console.log(`Storage削除成功: ${filePath}`);
            }
          }
        }

        // データベースレコードを削除
        const { error: dbDeleteError } = await supabase
          .from("design_images")
          .delete()
          .eq("id", image.id);

        if (dbDeleteError) {
          console.warn(`DB削除エラー: ${image.id}`, dbDeleteError);
          errors.push(`DB削除失敗: ${image.id}`);
        } else {
          deletedCount++;
          console.log(`削除成功: ${image.id}`);
        }
      } catch (error) {
        console.error(`削除エラー: ${image.id}`, error);
        errors.push(`削除エラー: ${image.id} - ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount,
        totalProcessed: imagesToDelete.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `${deletedCount}件の画像を削除しました`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("クリーンアップエラー:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
