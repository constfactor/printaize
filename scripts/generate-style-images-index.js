/**
 * スタイル画像のインデックスを生成するスクリプト
 * ビルド前に実行して、各スタイルフォルダの画像リストをJSONファイルとして出力
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const styleDir = path.join(__dirname, '..', 'public', 'images', 'style');
const outputFile = path.join(__dirname, '..', 'app', 'data', 'style-images.json');

// 画像拡張子
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// スタイルフォルダを読み取り
const styles = fs.readdirSync(styleDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const styleImagesIndex = {};

styles.forEach(style => {
  const stylePath = path.join(styleDir, style);
  
  try {
    const files = fs.readdirSync(stylePath);
    
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => `/images/style/${style}/${file}`);
    
    styleImagesIndex[style] = images;
    
    console.log(`✅ ${style}: ${images.length} images`);
  } catch (error) {
    console.error(`❌ Error reading ${style}:`, error.message);
  }
});

// 出力ディレクトリが存在しない場合は作成
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// JSONファイルに書き込み
fs.writeFileSync(outputFile, JSON.stringify(styleImagesIndex, null, 2));

console.log(`\n📦 Style images index generated: ${outputFile}`);
console.log(`📊 Total styles: ${Object.keys(styleImagesIndex).length}`);
console.log(`📊 Total images: ${Object.values(styleImagesIndex).reduce((sum, images) => sum + images.length, 0)}`);
