/**
 * AI画像生成APIエンドポイント
 */

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { generateImage } from "~/lib/replicate.server";

// ステップ1: POSTリクエストを処理
export async function action({ request }: ActionFunctionArgs) {
  // CORS対応
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
    // ステップ2: リクエストボディからパラメータを取得
    const body = await request.json();
    const { prompt, width, height, negativePrompt } = body;

    // ステップ3: プロンプトのバリデーション
    if (!prompt || prompt.trim().length === 0) {
      return json(
        { error: "プロンプトを入力してください" },
        { status: 400 }
      );
    }

    // ステップ4: Replicate APIで画像生成
    const imageUrl = await generateImage(prompt, {
      width: width || 1024,
      height: height || 1024,
      negativePrompt: negativePrompt || "blurry, low quality, distorted",
    });

    // ステップ5: 生成された画像URLを返す
    return json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
    });
  } catch (error) {
    console.error("AI画像生成エラー:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "画像生成に失敗しました",
      },
      { status: 500 }
    );
  }
}
