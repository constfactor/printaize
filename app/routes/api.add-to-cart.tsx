/**
 * カート追加APIエンドポイント
 */

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { addCustomTshirtToCart, addAIGeneratedTshirtToCart } from "~/lib/shopify.server";

// ステップ1: POSTリクエストを処理
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
    // ステップ2: リクエストボディからパラメータを取得
    const body = await request.json();
    const { variantId, quantity, customAttributes, designImageUrl, designImageUrlHD, isAIGenerated, aiPrompt, productVariantId } = body;

    // 新形式（customAttributes）と旧形式（designImageUrl）の両方に対応
    let finalDesignImageUrl = designImageUrl;
    let finalDesignImageUrlHD = designImageUrlHD;
    let finalVariantId = productVariantId || variantId;

    if (customAttributes && Array.isArray(customAttributes)) {
      // customAttributes形式の場合
      const designImageAttr = customAttributes.find((attr: any) => attr.key === "design_image");
      const designImageHDAttr = customAttributes.find((attr: any) => attr.key === "design_image_hd");
      
      if (designImageAttr) finalDesignImageUrl = designImageAttr.value;
      if (designImageHDAttr) finalDesignImageUrlHD = designImageHDAttr.value;
    }

    // ステップ3: デザイン画像のバリデーション
    if (!finalDesignImageUrl) {
      return json(
        { error: "デザイン画像が指定されていません" },
        { status: 400 }
      );
    }

    // URLの長さをチェック（Shopifyのカスタム属性は最大255文字）
    console.log("Design Image URL length:", finalDesignImageUrl.length);
    if (finalDesignImageUrlHD) {
      console.log("Design Image HD URL length:", finalDesignImageUrlHD.length);
    }

    if (finalDesignImageUrl.length > 255) {
      return json(
        { error: `デザイン画像URLが長すぎます（${finalDesignImageUrl.length}文字、最大255文字）` },
        { status: 400 }
      );
    }

    if (finalDesignImageUrlHD && finalDesignImageUrlHD.length > 255) {
      return json(
        { error: `HD画像URLが長すぎます（${finalDesignImageUrlHD.length}文字、最大255文字）` },
        { status: 400 }
      );
    }

    // ステップ4: カートに追加
    let result;
    if (isAIGenerated && aiPrompt) {
      // AI生成画像の場合
      result = await addAIGeneratedTshirtToCart(
        finalDesignImageUrl,
        finalDesignImageUrlHD,
        aiPrompt,
        finalVariantId
      );
    } else {
      // 通常のアップロード画像の場合
      result = await addCustomTshirtToCart(finalDesignImageUrl, finalDesignImageUrlHD, finalVariantId);
    }

    // ステップ5: エラーチェック
    if (result.userErrors && result.userErrors.length > 0) {
      console.error("Shopify userErrors:", result.userErrors);
      return json(
        {
          success: false,
          error: result.userErrors[0].message,
          details: result.userErrors,
        },
        { status: 400 }
      );
    }

    // ステップ6: チェックアウトURLを返す
    return json({
      success: true,
      checkoutUrl: result.cart.checkoutUrl,
      cartId: result.cart.id,
    });
  } catch (error) {
    console.error("カート追加エラー:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "カートへの追加に失敗しました",
      },
      { status: 500 }
    );
  }
}
