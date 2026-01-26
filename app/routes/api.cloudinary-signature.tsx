/**
 * Cloudinary署名付きアップロード用の署名生成API
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
    const body = await request.json();
    const { folder = "tshirt-designs" } = body;

    // 環境変数の確認
    console.log('Cloudinary設定確認:', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
      apiSecretExists: !!process.env.CLOUDINARY_API_SECRET,
    });

    // アップロードパラメータ（署名に含めるパラメータのみ）
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder,
    };

    console.log('署名生成パラメータ:', params);

    // 署名を生成
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    console.log('署名生成成功');

    // 署名とパラメータを返す
    return json({
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("署名生成エラー:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "署名の生成に失敗しました",
      },
      { status: 500 }
    );
  }
}
