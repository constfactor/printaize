/**
 * 画像のメタデータ（Description/Caption）を取得するAPIルート
 * 本番環境対応：ビルド時に生成された静的JSONを使用
 */
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import imageMetadataIndex from "~/data/image-metadata.json";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const imagePath = url.searchParams.get("path");

    if (!imagePath) {
      return json({ success: false, error: "Path parameter is required" }, { status: 400 });
    }

    // 静的インデックスからメタデータを取得
    const description = imageMetadataIndex[imagePath as keyof typeof imageMetadataIndex];

    if (description === undefined) {
      console.log(`No metadata found for: ${imagePath}`);
      return json({
        success: true,
        description: "メタデータがありません",
      });
    }

    return json({
      success: true,
      description: description || "メタデータがありません",
    });
  } catch (error) {
    console.error("Image metadata fetch error:", error);
    return json({ 
      success: false, 
      error: "Failed to fetch image metadata",
      description: "メタデータの取得に失敗しました"
    }, { status: 500 });
  }
};
