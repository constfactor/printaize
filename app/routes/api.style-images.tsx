/**
 * スタイル画像一覧を取得するAPIルート
 * 本番環境対応：ビルド時に生成された静的JSONを使用
 */
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import styleImagesIndex from "~/data/style-images.json";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const style = url.searchParams.get("style");

    if (!style) {
      return json({ success: false, error: "Style parameter is required" }, { status: 400 });
    }

    // スタイル名を正規化（小文字に変換）
    const normalizedStyle = style.toLowerCase();

    // 静的インデックスから画像リストを取得
    const images = styleImagesIndex[normalizedStyle as keyof typeof styleImagesIndex];

    if (!images) {
      return json({ success: false, error: "Style not found" }, { status: 404 });
    }

    return json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Style images fetch error:", error);
    return json({ success: false, error: "Failed to fetch style images" }, { status: 500 });
  }
};
