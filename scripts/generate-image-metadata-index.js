/**
 * 画像のIPTCメタデータを抽出して、JSONファイルに保存するスクリプト
 * ビルド前に実行して、本番環境でもメタデータを利用可能にする
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import exifr from 'exifr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const styleDir = path.join(__dirname, '..', 'public', 'images', 'style');
const outputFile = path.join(__dirname, '..', 'app', 'data', 'image-metadata.json');

// 画像拡張子
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// メタデータを抽出する関数
async function extractMetadata(imagePath) {
  try {
    const buffer = await fs.promises.readFile(imagePath);
    
    // IPTC/EXIFメタデータを抽出
    const metadata = await exifr.parse(buffer, {
      iptc: true,
      exif: false,
      xmp: false,
      icc: false,
      translateValues: false,
      reviveValues: false,
      mergeOutput: false,
    });

    let description = "";
    
    if (metadata?.iptc?.Caption) {
      const raw = metadata.iptc.Caption;
      
      // 文字列の場合、Latin1からUTF-8に変換
      if (typeof raw === "string") {
        const bytes = new Uint8Array([...raw].map(c => c.charCodeAt(0) & 0xFF));
        description = new TextDecoder("utf-8").decode(bytes);
      } else if (raw instanceof Uint8Array || Buffer.isBuffer(raw)) {
        description = new TextDecoder("utf-8").decode(raw);
      } else {
        description = String(raw);
      }
    }

    return description || "";
  } catch (error) {
    console.error(`  ❌ Error reading metadata from ${imagePath}:`, error.message);
    return "";
  }
}

// スタイルフォルダを読み取り
const styles = fs.readdirSync(styleDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const imageMetadataIndex = {};
let totalProcessed = 0;
let totalWithMetadata = 0;

console.log("🔍 Extracting IPTC metadata from images...\n");

for (const style of styles) {
  const stylePath = path.join(styleDir, style);
  
  try {
    const files = fs.readdirSync(stylePath);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!imageExtensions.includes(ext)) continue;
      
      const imagePath = path.join(stylePath, file);
      const relativeImagePath = `/images/style/${style}/${file}`;
      
      const description = await extractMetadata(imagePath);
      totalProcessed++;
      
      if (description) {
        imageMetadataIndex[relativeImagePath] = description;
        totalWithMetadata++;
        console.log(`  ✅ ${relativeImagePath}`);
        console.log(`     "${description.substring(0, 80)}${description.length > 80 ? '...' : ''}"`);
      } else {
        console.log(`  ⚠️  ${relativeImagePath} (no metadata)`);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${style}:`, error.message);
  }
}

// 出力ディレクトリが存在しない場合は作成
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// JSONファイルに書き込み
fs.writeFileSync(outputFile, JSON.stringify(imageMetadataIndex, null, 2));

console.log(`\n📦 Image metadata index generated: ${outputFile}`);
console.log(`📊 Total images processed: ${totalProcessed}`);
console.log(`📊 Images with metadata: ${totalWithMetadata}`);
