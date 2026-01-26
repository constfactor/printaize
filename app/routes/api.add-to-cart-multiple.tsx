/**
 * 複数アイテムを一度にカートに追加するAPIエンドポイント
 */

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createCart } from "~/lib/shopify.server";

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
    // リクエストボディからアイテム配列を取得
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return json(
        { error: "カートに追加するアイテムが指定されていません" },
        { status: 400 }
      );
    }

    console.log("カートに追加するアイテム数:", items.length);

    // 全てのアイテムを1回でカートに追加
    const result = await createCart(items);

    // エラーチェック
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

    // チェックアウトURLを返す
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
