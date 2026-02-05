/**
 * Shopifyコレクションから商品を取得するAPIルート
 */
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getCollectionProducts, getMetaobjectsByIds } from "~/lib/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const handle = url.searchParams.get("handle") || "item";
    const first = parseInt(url.searchParams.get("first") || "10", 10);
    const after = url.searchParams.get("after") || null;

    const collectionData = await getCollectionProducts(handle, first, after);

    if (!collectionData) {
      return json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    // 参照メタオブジェクトを事前取得
    const metaobjectIdSet = new Set<string>();
    collectionData.products.edges.forEach((edge: any) => {
      const metafield = edge.node?.metafield;
      const type = (metafield?.type || "").toLowerCase();
      if (!metafield?.value) return;
      if (!type.includes("metaobject_reference")) return;
      try {
        const parsed = JSON.parse(metafield.value);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => typeof id === "string" && metaobjectIdSet.add(id));
        } else if (typeof parsed === "string") {
          metaobjectIdSet.add(parsed);
        }
      } catch {
        // ignore parse errors
      }
    });

    const metaobjects = await getMetaobjectsByIds(Array.from(metaobjectIdSet));
    const metaobjectMap = new Map<string, any>();
    metaobjects.forEach((node: any) => {
      if (node?.id) metaobjectMap.set(node.id, node);
    });

    // メタフィールドの色をパース
    const parseMetafieldColors = (metafield: any) => {
      if (!metafield || !metafield.value) return [];

      const raw = metafield.value;
      const type = (metafield.type || "").toLowerCase();

      const references = metafield.references?.nodes || [];
      if (type.includes("metaobject_reference") && Array.isArray(references) && references.length > 0) {
        return references.map((node: any) => {
          const fields = Array.isArray(node.fields) ? node.fields : [];
          const getField = (key: string) => fields.find((f: any) => f.key === key)?.value;

          const label =
            getField("label") ||
            getField("name") ||
            getField("title") ||
            node.handle ||
            node.id;

          const colorValue = getField("color") || getField("hex") || label;

          return {
            name: label,
            value: colorValue,
          };
        });
      }

      if (type.includes("metaobject_reference")) {
        try {
          const parsed = JSON.parse(raw);
          const ids = Array.isArray(parsed) ? parsed : [parsed];
          return ids
            .map((id: string) => metaobjectMap.get(id))
            .filter(Boolean)
            .map((node: any) => {
              const fields = Array.isArray(node.fields) ? node.fields : [];
              const getField = (key: string) => fields.find((f: any) => f.key === key)?.value;

              const label =
                getField("label") ||
                getField("name") ||
                getField("title") ||
                node.handle ||
                node.id;

              const colorValue = getField("color") || getField("hex") || label;

              return {
                name: label,
                value: colorValue,
              };
            });
        } catch {
          return [];
        }
      }

      const normalizeColorEntry = (entry: any) => {
        if (entry == null) return null;
        if (typeof entry === "string") {
          return { name: entry, value: entry };
        }
        if (typeof entry === "object") {
          const name = entry.name || entry.label || entry.title || entry.value;
          const value = entry.color || entry.hex || entry.value || entry.name;
          if (value) {
            return { name: name || value, value };
          }
        }
        return null;
      };

      const fromJson = (jsonValue: any) => {
        if (Array.isArray(jsonValue)) {
          return jsonValue.map(normalizeColorEntry).filter(Boolean);
        }
        if (typeof jsonValue === "object") {
          if (Array.isArray(jsonValue.colors)) {
            return jsonValue.colors.map(normalizeColorEntry).filter(Boolean);
          }
          const single = normalizeColorEntry(jsonValue);
          return single ? [single] : [];
        }
        if (typeof jsonValue === "string") {
          return [normalizeColorEntry(jsonValue)].filter(Boolean);
        }
        return [];
      };

      // list系 or JSONっぽい値
      if (type.startsWith("list.") || raw.trim().startsWith("[") || raw.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(raw);
          return fromJson(parsed);
        } catch {
          // JSON失敗時はフォールバック
        }
      }

      // カンマ区切り or 単一値
      const parts = raw.split(",").map((v: string) => v.trim()).filter(Boolean);
      return parts.map(normalizeColorEntry).filter(Boolean);
    };

    const resolveHex = (value: string) => {
      const v = value.trim();
      if (v.startsWith("#")) return v;

      const colorHexMap: { [key: string]: string } = {
        white: "#FFFFFF",
        black: "#000000",
        red: "#FF0000",
        blue: "#0000FF",
        green: "#00FF00",
        yellow: "#FFFF00",
        pink: "#FFC0CB",
        gray: "#808080",
        grey: "#808080",
        navy: "#000080",
        brown: "#A52A2A",
        orange: "#FFA500",
        purple: "#800080",
        "ホワイト": "#FFFFFF",
        "白": "#FFFFFF",
        "ブラック": "#000000",
        "黒": "#000000",
        "レッド": "#FF0000",
        "赤": "#FF0000",
        "ブルー": "#0000FF",
        "青": "#0000FF",
        "グリーン": "#00FF00",
        "緑": "#00FF00",
        "イエロー": "#FFFF00",
        "黄": "#FFFF00",
        "ピンク": "#FFC0CB",
        "グレー": "#808080",
        "ネイビー": "#000080",
        "ブラウン": "#A52A2A",
        "オレンジ": "#FFA500",
        "パープル": "#800080",
      };

      return colorHexMap[v.toLowerCase()] || "#CCCCCC";
    };

    // データを整形
    const products = collectionData.products.edges.map((edge: any) => {
      const node = edge.node;
      
      // デバッグ: ノードの構造を確認
      console.log(`\n=== Product: ${node.title} ===`);
      console.log(`Total images: ${node.images.edges.length}`);
      node.images.edges.forEach((img: any, idx: number) => {
        console.log(`  Image ${idx}: altText="${img.node.altText}", url="${img.node.url.substring(img.node.url.lastIndexOf('/') + 1)}"`);
      });
      console.log(`Total variants: ${node.variants.edges.length}`);
      node.variants.edges.forEach((v: any, idx: number) => {
        console.log(`  Variant ${idx}: ${v.node.title}, hasImage=${!!v.node.image}`);
      });
      
      // メタフィールドから色を取得（custom.color）
      const metafieldColors = parseMetafieldColors(node.metafield);
      
      console.log(`Metafield for ${node.title}:`, {
        hasMetafield: !!node.metafield,
        type: node.metafield?.type,
        valueLength: node.metafield?.value?.length || 0,
        referencesCount: node.metafield?.references?.nodes?.length || 0,
        parsedColorsCount: metafieldColors.length,
        colorNames: metafieldColors.map((c: any) => c.name)
      });

      // 色オプションを見つける
      const colorOption = node.options?.find((opt: any) => 
        opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'カラー'
      );
      
      console.log(`Color option found: ${!!colorOption}, values: ${colorOption?.values.join(', ') || 'none'}`);
      
      // 色ごとにバリアントと画像をグループ化
      const colors: Array<{ name: string; hex: string; image: string | null }> = [];

      if (metafieldColors.length > 0) {
        metafieldColors.forEach((colorItem: any) => {
          const colorValue = (colorItem.value || colorItem.name || "").toString();
          if (!colorValue) return;
          const colorName = (colorItem.name || colorValue).toString();

          // この色に対応するバリアントを見つける（大文字小文字を区別しない）
          const variantForColor = node.variants.edges.find((v: any) =>
            v.node.title.toLowerCase().includes(colorName.toLowerCase())
          );

          let colorImage = variantForColor?.node.image?.url || null;
          
          // バリアントに画像がない場合、商品の画像から色名でマッチするものを探す
          if (!colorImage) {
            const matchingImage = node.images.edges.find((img: any) => {
              const url = (img.node.url || "").toLowerCase();
              const colorLower = colorName.toLowerCase();
              
              return url.includes(colorLower) ||
                     (colorLower === 'ブラック' && (url.includes('black') || url.includes('-bl-'))) ||
                     (colorLower === 'ホワイト' && (url.includes('white') || url.includes('-wh-')));
            });
            
            colorImage = matchingImage?.node.url || null;
            console.log(`  ${colorName}: matched image = ${colorImage ? colorImage.substring(colorImage.lastIndexOf('/') + 1) : "not found"}`);
          }

          colors.push({
            name: colorName,
            hex: resolveHex(colorValue),
            image: colorImage,
          });
        });
      } else if (colorOption && colorOption.values) {
        colorOption.values.forEach((colorValue: string) => {
          // この色に対応するバリアントを見つける
          const variantForColor = node.variants.edges.find((v: any) => 
            v.node.selectedOptions.some((opt: any) => 
              (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'カラー') && 
              opt.value === colorValue
            )
          );
          
          // バリアントに画像がない場合、商品の画像から色名でマッチするものを探す
          let colorImage = variantForColor?.node.image?.url || null;
          
          // デバッグ: バリアント画像を確認
          console.log(`${node.title} - ${colorValue}:`, {
            variantImage: variantForColor?.node.image?.url || "none",
            totalImages: node.images.edges.length,
          });
          
          if (!colorImage) {
            // 画像のaltTextまたはURLから色を推測
            const matchingImage = node.images.edges.find((img: any) => {
              const altText = (img.node.altText || "").toLowerCase();
              const url = (img.node.url || "").toLowerCase();
              const colorLower = colorValue.toLowerCase();
              
              // デバッグログ
              console.log(`  Checking image:`, {
                altText,
                url: url.substring(url.lastIndexOf('/') + 1),
                colorLower,
                matches: altText.includes(colorLower) || url.includes(colorLower)
              });
              
              // altTextまたはURLに色名が含まれているか
              return altText.includes(colorLower) || url.includes(colorLower) ||
                     // 英語名もチェック
                     (colorLower === 'ブラック' && (altText.includes('black') || url.includes('black') || url.includes('-bl-'))) ||
                     (colorLower === 'ホワイト' && (altText.includes('white') || url.includes('white') || url.includes('-wh-'))) ||
                     (colorLower === '白' && (altText.includes('white') || url.includes('white') || url.includes('-wh-'))) ||
                     (colorLower === '黒' && (altText.includes('black') || url.includes('black') || url.includes('-bl-')));
            });
            
            colorImage = matchingImage?.node.url || null;
            console.log(`  Matched image:`, colorImage ? "found" : "not found");
          }
          
          const hex = resolveHex(colorValue);
          
          colors.push({
            name: colorValue,
            hex: hex,
            image: colorImage,
          });
        });
      } else {
        // colorOptionがない場合、バリアントのタイトルから色を抽出
        const colorSet = new Set<string>();
        node.variants.edges.forEach((v: any) => {
          // バリアントタイトルから色を抽出（例: "ホワイト / S" -> "ホワイト"）
          const title = v.node.title || "";
          const parts = title.split("/").map((p: string) => p.trim());
          if (parts.length > 0) {
            colorSet.add(parts[0]);
          }
        });
        
        console.log(`Extracted colors from variants: ${Array.from(colorSet).join(', ')}`);
        
        colorSet.forEach((colorValue: string) => {
          // この色に対応するバリアントを見つける
          const variantForColor = node.variants.edges.find((v: any) => 
            v.node.title.startsWith(colorValue)
          );
          
          let colorImage = variantForColor?.node.image?.url || null;
          
          if (!colorImage) {
            // 画像URLから色を推測
            const matchingImage = node.images.edges.find((img: any) => {
              const url = (img.node.url || "").toLowerCase();
              const colorLower = colorValue.toLowerCase();
              
              return url.includes(colorLower) ||
                     (colorLower === 'ブラック' && (url.includes('black') || url.includes('-bl-'))) ||
                     (colorLower === 'ホワイト' && (url.includes('white') || url.includes('-wh-')));
            });
            
            colorImage = matchingImage?.node.url || null;
            console.log(`  ${colorValue}: matched image = ${colorImage ? "found" : "not found"}`);
          }
          
          colors.push({
            name: colorValue,
            hex: resolveHex(colorValue),
            image: colorImage,
          });
        });
      }
      
      return {
        id: node.id,
        title: node.title,
        description: node.description,
        handle: node.handle,
        image: node.images.edges[0]?.node.url || "",
        imageAlt: node.images.edges[0]?.node.altText || node.title,
        price: node.variants.edges[0]?.node.priceV2.amount || "0",
        currencyCode: node.variants.edges[0]?.node.priceV2.currencyCode || "JPY",
        variantId: node.variants.edges[0]?.node.id || "",
        colors: colors,
      };
    });

    // デバッグログ
    console.log("Products with colors:", JSON.stringify(products.map(p => ({
      title: p.title,
      colors: p.colors
    })), null, 2));

    return json({
      success: true,
      products,
      pageInfo: collectionData.products.pageInfo,
    });
  } catch (error) {
    console.error("Collection products fetch error:", error);
    return json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
};
