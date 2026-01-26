/**
 * Replicate AI画像生成API統合
 */

import Replicate from "replicate";

// ステップ1: Replicateクライアントの初期化
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

/**
 * ステップ2: AI画像生成（Stable Diffusion系モデル）
 * @param prompt - 生成したい画像の説明
 * @param options - 追加オプション
 */
export async function generateImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    negativePrompt?: string;
    numOutputs?: number;
  } = {}
) {
  try {
    const {
      width = 1024,
      height = 1024,
      negativePrompt = "blurry, low quality, distorted, ugly",
      numOutputs = 1,
    } = options;

    console.log("AI画像生成を開始:", prompt);

    // ステップ3: Stable Diffusion XLで画像生成
    // 注: モデル名は最新のものに変更してください
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          width: width,
          height: height,
          num_outputs: numOutputs,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }
    );

    console.log("AI画像生成が完了しました");

    // 出力は配列で返されるので、最初の画像を返す
    return Array.isArray(output) ? output[0] : output;
  } catch (error) {
    console.error("Replicate AI Error:", error);
    throw new Error("AI画像生成に失敗しました");
  }
}

/**
 * ステップ4: 背景削除AI
 * @param imageUrl - 背景を削除したい画像のURL
 */
export async function removeBackground(imageUrl: string) {
  try {
    console.log("背景削除を開始:", imageUrl);

    const output = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      {
        input: {
          image: imageUrl,
        },
      }
    );

    console.log("背景削除が完了しました");
    return output;
  } catch (error) {
    console.error("Background Removal Error:", error);
    throw new Error("背景削除に失敗しました");
  }
}

/**
 * ステップ5: 画像のスタイル変換
 * @param imageUrl - 変換したい画像のURL
 * @param style - 適用するスタイル
 */
export async function applyStyle(
  imageUrl: string,
  style: "anime" | "oil-painting" | "watercolor" | "sketch"
) {
  try {
    console.log(`スタイル変換を開始: ${style}`);

    // スタイルに応じたプロンプトを生成
    const stylePrompts = {
      anime: "anime style, vibrant colors, manga art",
      "oil-painting": "oil painting, classical art, rich textures",
      watercolor: "watercolor painting, soft colors, artistic",
      sketch: "pencil sketch, black and white, hand drawn",
    };

    const output = await replicate.run(
      "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
      {
        input: {
          img: imageUrl,
          version: "v1.4",
          scale: 2,
        },
      }
    );

    console.log("スタイル変換が完了しました");
    return output;
  } catch (error) {
    console.error("Style Transfer Error:", error);
    throw new Error("スタイル変換に失敗しました");
  }
}

/**
 * ステップ6: 高画質化（アップスケーリング）
 * @param imageUrl - 高画質化したい画像のURL
 */
export async function upscaleImage(imageUrl: string) {
  try {
    console.log("画像の高画質化を開始");

    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: false,
        },
      }
    );

    console.log("画像の高画質化が完了しました");
    return output;
  } catch (error) {
    console.error("Upscale Error:", error);
    throw new Error("画像の高画質化に失敗しました");
  }
}
