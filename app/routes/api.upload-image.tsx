/**
 * 画像アップロードAPIエンドポイント
 * Base64画像をCloudinaryにアップロード
 */

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSONパースエラー:", parseError);
      return json(
        { 
          success: false,
          error: "リクエストボディの解析に失敗しました。画像サイズが大きすぎる可能性があります。" 
        },
        { status: 413 } // Payload Too Large
      );
    }

    const { imageData } = body;

    if (!imageData) {
      return json(
        { success: false, error: "画像データが指定されていません" },
        { status: 400 }
      );
    }

    // データサイズをログ出力
    const sizeInMB = (imageData.length / (1024 * 1024)).toFixed(2);
    console.log(`画像アップロード開始 - サイズ: ${sizeInMB}MB`);
    
    if (parseFloat(sizeInMB) > 15) {
      console.error("ファイルサイズが大きすぎます:", sizeInMB, "MB");
      return json(
        { 
          success: false,
          error: `画像サイズが大きすぎます (${sizeInMB}MB)。10MB以下にしてください。` 
        },
        { status: 413 }
      );
    }

    // CloudinaryにBase64画像をアップロード
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: "tshirt-designs", // Cloudinaryのフォルダ名
      resource_type: "image",
      format: "png", // PNG形式を維持（背景透過のため）
      transformation: [
        { quality: "auto:best" }, // 自動品質最適化
        { fetch_format: "auto" }, // 最適なフォーマットを自動選択（透過保持）
      ],
      timeout: 120000, // タイムアウトを120秒に延長
    });

    console.log('画像アップロード成功:', uploadResult.secure_url);

    // アップロードされた画像のURLを返す
    return json({
      success: true,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    
    // エラーの詳細をログ出力
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラースタック:", error.stack);
    }
    
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "画像のアップロードに失敗しました",
      },
      { status: 500 }
    );
  }
}
