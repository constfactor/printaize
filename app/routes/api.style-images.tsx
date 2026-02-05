/**
 * スタイル画像一覧を取得するAPIルート
 */
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const style = url.searchParams.get("style");

    if (!style) {
      return json({ success: false, error: "Style parameter is required" }, { status: 400 });
    }

    // public/images/style/{style} フォルダのパス
    const styleDir = path.join(process.cwd(), "public", "images", "style", style);

    // フォルダが存在するか確認
    if (!fs.existsSync(styleDir)) {
      return json({ success: false, error: "Style directory not found" }, { status: 404 });
    }

    // フォルダ内の画像ファイルを取得
    const files = fs.readdirSync(styleDir);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((file) => `/images/style/${style}/${file}`);

    return json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Style images fetch error:", error);
    return json({ success: false, error: "Failed to fetch style images" }, { status: 500 });
  }
};
