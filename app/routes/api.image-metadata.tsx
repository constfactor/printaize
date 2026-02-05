/**
 * 画像のメタデータ（Description/Caption）を取得するAPIルート
 */
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import exifr from "exifr";
import fs from "fs/promises";
import path from "path";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const imagePath = url.searchParams.get("path");

    if (!imagePath) {
      return json({ success: false, error: "Path parameter is required" }, { status: 400 });
    }

    // publicディレクトリからの相対パスを絶対パスに変換
    const publicDir = path.join(process.cwd(), "public");
    const absolutePath = path.join(publicDir, imagePath.replace(/^\//, ""));

    // ファイルが存在するか確認
    try {
      await fs.access(absolutePath);
    } catch {
      return json({ success: false, error: "Image file not found" }, { status: 404 });
    }

    // 画像ファイルを読み込み
    const buffer = await fs.readFile(absolutePath);
    console.log(`Reading metadata from: ${imagePath}, file size: ${buffer.length} bytes`);

    // IPTC/EXIFメタデータを抽出
    const metadata = await exifr.parse(buffer, {
      iptc: true,
      exif: false,
      xmp: false,
      icc: false,
      translateValues: false, // 生データを取得
      reviveValues: false,
      mergeOutput: false,
    });

    console.log("Raw IPTC metadata:", metadata);
    
    // IPTCのCaptionフィールドを取得
    let description = "";
    
    if (metadata?.iptc?.Caption) {
      const raw = metadata.iptc.Caption;
      console.log("Caption type:", typeof raw);
      console.log("Caption raw value (first 100 chars):", JSON.stringify(raw.substring(0, 100)));
      
      // 文字列の場合、Latin1（ISO-8859-1）からUTF-8に変換
      if (typeof raw === "string") {
        // 文字列の各文字をLatin1バイトとして扱い、UTF-8としてデコード
        const bytes = new Uint8Array([...raw].map(c => c.charCodeAt(0) & 0xFF));
        description = new TextDecoder("utf-8").decode(bytes);
        console.log("Decoded from Latin1 to UTF-8:", description);
      } else if (raw instanceof Uint8Array || Buffer.isBuffer(raw)) {
        // Uint8Array または Buffer の場合、直接UTF-8としてデコード
        description = new TextDecoder("utf-8").decode(raw);
        console.log("Decoded from Uint8Array/Buffer as UTF-8:", description);
      } else {
        description = String(raw);
        console.log("Converted to string:", description);
      }
    } else {
      console.log("No Caption field found in IPTC metadata");
      console.log("Available IPTC fields:", metadata?.iptc ? Object.keys(metadata.iptc) : "none");
    }

    console.log("Final description:", description);

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
