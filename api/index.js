var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// server.js
import { createRequestHandler } from "@remix-run/vercel";

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  loader: () => loader
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
async function loader({ request }) {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    }
  });
}
function App() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "ja", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {}),
      /* @__PURE__ */ jsx2("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx2("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
      /* @__PURE__ */ jsx2("link", { href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&family=M+PLUS+1p:wght@400;700&family=M+PLUS+2:wght@400;700&family=Murecho:wght@400;700&family=Zen+Maru+Gothic:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&family=Zen+Kaku+Gothic+Antique:wght@400;700&family=Zen+Old+Mincho:wght@400;700&family=Zen+Kurenaido&family=Zen+Antique&family=Zen+Antique+Soft&family=Kosugi+Maru&family=Kosugi&family=Sawarabi+Mincho&family=Sawarabi+Gothic&family=Klee+One:wght@400;600&family=Shippori+Mincho:wght@400;700&family=Shippori+Antique&family=Shippori+Antique+B1&family=Yusei+Magic&family=Yomogi&family=BIZ+UDPGothic:wght@400;700&family=BIZ+UDPMincho:wght@400;700&family=Dela+Gothic+One&family=DotGothic16&family=Hina+Mincho&family=Kiwi+Maru:wght@400;500&family=Reggae+One&family=RocknRoll+One&family=Potta+One&family=Train+One&family=Rampart+One&family=Kaisei+Decol:wght@400;700&family=Kaisei+HarunoUmi:wght@400;700&family=Kaisei+Tokumin:wght@400;700&family=Kaisei+Opti:wght@400;700&family=Stick&family=Mochiy+Pop+One&family=Mochiy+Pop+P+One&family=New+Tegomin&family=Hachi+Maru+Pop&family=Otomanopee+One&family=Shirokuma&family=Slackkey&family=Cherry+Bomb+One&family=Monomaniac+One&family=Palette+Mosaic&family=Yuji+Syuku&family=Yuji+Boku&family=Yuji+Mai&display=swap", rel: "stylesheet" }),
      /* @__PURE__ */ jsx2("style", { children: `
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                         'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                         'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f5f5f5;
          }
          
          canvas {
            display: block;
          }
        ` })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx2(
        "script",
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js",
          crossOrigin: "anonymous"
        }
      ),
      /* @__PURE__ */ jsx2(
        "script",
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
          crossOrigin: "anonymous"
        }
      ),
      /* @__PURE__ */ jsx2(
        "script",
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
          crossOrigin: "anonymous"
        }
      ),
      /* @__PURE__ */ jsx2(Outlet, {}),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`
          }
        }
      ),
      /* @__PURE__ */ jsx2(Scripts, {}),
      /* @__PURE__ */ jsx2(LiveReload, {})
    ] })
  ] });
}

// app/routes/api.add-to-cart-multiple.tsx
var api_add_to_cart_multiple_exports = {};
__export(api_add_to_cart_multiple_exports, {
  action: () => action
});
import { json as json2 } from "@remix-run/node";

// app/lib/shopify.server.ts
var SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "", SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "", STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
async function shopifyFetch({
  query,
  variables = {}
}) {
  try {
    let response = await fetch(STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({ query, variables })
    });
    if (!response.ok)
      throw new Error(`Shopify API Error: ${response.statusText}`);
    let json8 = await response.json();
    if (json8.errors)
      throw new Error(`GraphQL Errors: ${JSON.stringify(json8.errors)}`);
    return json8.data;
  } catch (error) {
    throw console.error("Shopify API Error:", error), error;
  }
}
async function createCart(lineItems) {
  let mutation = `
    mutation createCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, variables = {
    input: {
      lines: lineItems.map((item) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
        attributes: item.customAttributes
      }))
    }
  };
  return (await shopifyFetch({ query: mutation, variables })).cartCreate;
}
async function addCustomTshirtToCart(designImageUrl, designImageUrlHD, productVariantId = "gid://shopify/ProductVariant/48602131661024") {
  return await createCart([
    {
      variantId: productVariantId,
      quantity: 1,
      customAttributes: [
        { key: "design_image", value: designImageUrl },
        { key: "design_image_hd", value: designImageUrlHD }
      ]
    }
  ]);
}
async function addAIGeneratedTshirtToCart(designImageUrl, designImageUrlHD, prompt, productVariantId = "gid://shopify/ProductVariant/48602131661024") {
  return await createCart([
    {
      variantId: productVariantId,
      quantity: 1,
      customAttributes: [
        { key: "design_image", value: designImageUrl },
        { key: "design_image_hd", value: designImageUrlHD },
        { key: "ai_prompt", value: prompt }
      ]
    }
  ]);
}

// app/routes/api.add-to-cart-multiple.tsx
async function action({ request }) {
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  try {
    let body = await request.json(), { items } = body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return json2(
        { error: "\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u3059\u308B\u30A2\u30A4\u30C6\u30E0\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093" },
        { status: 400 }
      );
    console.log("\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u3059\u308B\u30A2\u30A4\u30C6\u30E0\u6570:", items.length);
    let result = await createCart(items);
    return result.userErrors && result.userErrors.length > 0 ? (console.error("Shopify userErrors:", result.userErrors), json2(
      {
        success: !1,
        error: result.userErrors[0].message,
        details: result.userErrors
      },
      { status: 400 }
    )) : json2({
      success: !0,
      checkoutUrl: result.cart.checkoutUrl,
      cartId: result.cart.id
    });
  } catch (error) {
    return console.error("\u30AB\u30FC\u30C8\u8FFD\u52A0\u30A8\u30E9\u30FC:", error), json2(
      {
        success: !1,
        error: error instanceof Error ? error.message : "\u30AB\u30FC\u30C8\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
      },
      { status: 500 }
    );
  }
}

// app/routes/api.cloudinary-signature.tsx
var api_cloudinary_signature_exports = {};
__export(api_cloudinary_signature_exports, {
  action: () => action2
});
import { json as json3 } from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function action2({ request }) {
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  try {
    let body = await request.json(), { folder = "tshirt-designs" } = body;
    console.log("Cloudinary\u8A2D\u5B9A\u78BA\u8A8D:", {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
      apiSecretExists: !!process.env.CLOUDINARY_API_SECRET
    });
    let timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3), params = {
      timestamp,
      folder
    };
    console.log("\u7F72\u540D\u751F\u6210\u30D1\u30E9\u30E1\u30FC\u30BF:", params);
    let signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );
    return console.log("\u7F72\u540D\u751F\u6210\u6210\u529F"), json3({
      success: !0,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    });
  } catch (error) {
    return console.error("\u7F72\u540D\u751F\u6210\u30A8\u30E9\u30FC:", error), json3(
      {
        success: !1,
        error: error instanceof Error ? error.message : "\u7F72\u540D\u306E\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
      },
      { status: 500 }
    );
  }
}

// app/routes/api.generate-image.tsx
var api_generate_image_exports = {};
__export(api_generate_image_exports, {
  action: () => action3
});
import { json as json4 } from "@remix-run/node";

// app/lib/replicate.server.ts
import Replicate from "replicate";
var replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || ""
});
async function generateImage(prompt, options = {}) {
  try {
    let {
      width = 1024,
      height = 1024,
      negativePrompt = "blurry, low quality, distorted, ugly",
      numOutputs = 1
    } = options;
    console.log("AI\u753B\u50CF\u751F\u6210\u3092\u958B\u59CB:", prompt);
    let output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          negative_prompt: negativePrompt,
          width,
          height,
          num_outputs: numOutputs,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }
    );
    return console.log("AI\u753B\u50CF\u751F\u6210\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F"), Array.isArray(output) ? output[0] : output;
  } catch (error) {
    throw console.error("Replicate AI Error:", error), new Error("AI\u753B\u50CF\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
  }
}

// app/routes/api.generate-image.tsx
async function action3({ request }) {
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  try {
    let body = await request.json(), { prompt, width, height, negativePrompt } = body;
    if (!prompt || prompt.trim().length === 0)
      return json4(
        { error: "\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044" },
        { status: 400 }
      );
    let imageUrl = await generateImage(prompt, {
      width: width || 1024,
      height: height || 1024,
      negativePrompt: negativePrompt || "blurry, low quality, distorted"
    });
    return json4({
      success: !0,
      imageUrl,
      prompt
    });
  } catch (error) {
    return console.error("AI\u753B\u50CF\u751F\u6210\u30A8\u30E9\u30FC:", error), json4(
      {
        success: !1,
        error: error instanceof Error ? error.message : "\u753B\u50CF\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
      },
      { status: 500 }
    );
  }
}

// app/routes/api.upload-image.tsx
var api_upload_image_exports = {};
__export(api_upload_image_exports, {
  action: () => action4
});
import { json as json5 } from "@remix-run/node";
import { v2 as cloudinary2 } from "cloudinary";
cloudinary2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function action4({ request }) {
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return console.error("JSON\u30D1\u30FC\u30B9\u30A8\u30E9\u30FC:", parseError), json5(
        {
          success: !1,
          error: "\u30EA\u30AF\u30A8\u30B9\u30C8\u30DC\u30C7\u30A3\u306E\u89E3\u6790\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u753B\u50CF\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002"
        },
        { status: 413 }
        // Payload Too Large
      );
    }
    let { imageData } = body;
    if (!imageData)
      return json5(
        { success: !1, error: "\u753B\u50CF\u30C7\u30FC\u30BF\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093" },
        { status: 400 }
      );
    let sizeInMB = (imageData.length / (1024 * 1024)).toFixed(2);
    if (console.log(`\u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u958B\u59CB - \u30B5\u30A4\u30BA: ${sizeInMB}MB`), parseFloat(sizeInMB) > 15)
      return console.error("\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059:", sizeInMB, "MB"), json5(
        {
          success: !1,
          error: `\u753B\u50CF\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059 (${sizeInMB}MB)\u300210MB\u4EE5\u4E0B\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`
        },
        { status: 413 }
      );
    let uploadResult = await cloudinary2.uploader.upload(imageData, {
      folder: "tshirt-designs",
      // Cloudinaryのフォルダ名
      resource_type: "image",
      format: "png",
      // PNG形式を維持（背景透過のため）
      transformation: [
        { quality: "auto:best" },
        // 自動品質最適化
        { fetch_format: "auto" }
        // 最適なフォーマットを自動選択（透過保持）
      ],
      timeout: 12e4
      // タイムアウトを120秒に延長
    });
    return console.log("\u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6210\u529F:", uploadResult.secure_url), json5({
      success: !0,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });
  } catch (error) {
    return console.error("\u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", error), error instanceof Error && (console.error("\u30A8\u30E9\u30FC\u30E1\u30C3\u30BB\u30FC\u30B8:", error.message), console.error("\u30A8\u30E9\u30FC\u30B9\u30BF\u30C3\u30AF:", error.stack)), json5(
      {
        success: !1,
        error: error instanceof Error ? error.message : "\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
      },
      { status: 500 }
    );
  }
}

// app/routes/api.add-to-cart.tsx
var api_add_to_cart_exports = {};
__export(api_add_to_cart_exports, {
  action: () => action5
});
import { json as json6 } from "@remix-run/node";
async function action5({ request }) {
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  try {
    let body = await request.json(), { variantId, quantity, customAttributes, designImageUrl, designImageUrlHD, isAIGenerated, aiPrompt, productVariantId } = body, finalDesignImageUrl = designImageUrl, finalDesignImageUrlHD = designImageUrlHD, finalVariantId = productVariantId || variantId;
    if (customAttributes && Array.isArray(customAttributes)) {
      let designImageAttr = customAttributes.find((attr) => attr.key === "design_image"), designImageHDAttr = customAttributes.find((attr) => attr.key === "design_image_hd");
      designImageAttr && (finalDesignImageUrl = designImageAttr.value), designImageHDAttr && (finalDesignImageUrlHD = designImageHDAttr.value);
    }
    if (!finalDesignImageUrl)
      return json6(
        { error: "\u30C7\u30B6\u30A4\u30F3\u753B\u50CF\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093" },
        { status: 400 }
      );
    if (console.log("Design Image URL length:", finalDesignImageUrl.length), finalDesignImageUrlHD && console.log("Design Image HD URL length:", finalDesignImageUrlHD.length), finalDesignImageUrl.length > 255)
      return json6(
        { error: `\u30C7\u30B6\u30A4\u30F3\u753B\u50CFURL\u304C\u9577\u3059\u304E\u307E\u3059\uFF08${finalDesignImageUrl.length}\u6587\u5B57\u3001\u6700\u5927255\u6587\u5B57\uFF09` },
        { status: 400 }
      );
    if (finalDesignImageUrlHD && finalDesignImageUrlHD.length > 255)
      return json6(
        { error: `HD\u753B\u50CFURL\u304C\u9577\u3059\u304E\u307E\u3059\uFF08${finalDesignImageUrlHD.length}\u6587\u5B57\u3001\u6700\u5927255\u6587\u5B57\uFF09` },
        { status: 400 }
      );
    let result;
    return isAIGenerated && aiPrompt ? result = await addAIGeneratedTshirtToCart(
      finalDesignImageUrl,
      finalDesignImageUrlHD,
      aiPrompt,
      finalVariantId
    ) : result = await addCustomTshirtToCart(finalDesignImageUrl, finalDesignImageUrlHD, finalVariantId), result.userErrors && result.userErrors.length > 0 ? (console.error("Shopify userErrors:", result.userErrors), json6(
      {
        success: !1,
        error: result.userErrors[0].message,
        details: result.userErrors
      },
      { status: 400 }
    )) : json6({
      success: !0,
      checkoutUrl: result.cart.checkoutUrl,
      cartId: result.cart.id
    });
  } catch (error) {
    return console.error("\u30AB\u30FC\u30C8\u8FFD\u52A0\u30A8\u30E9\u30FC:", error), json6(
      {
        success: !1,
        error: error instanceof Error ? error.message : "\u30AB\u30FC\u30C8\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
      },
      { status: 500 }
    );
  }
}

// app/routes/customize.tsx
var customize_exports = {};
__export(customize_exports, {
  default: () => Customize,
  loader: () => loader2,
  meta: () => meta
});
import { json as json7 } from "@remix-run/node";
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { motion as motion2 } from "framer-motion";

// app/components/PrintAIze.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Icon = ({ type, size = 20, color = "currentColor" }) => /* @__PURE__ */ jsx3("span", { style: { display: "inline-flex", alignItems: "center", verticalAlign: "middle" }, children: {
  clipboard: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
  check: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M5 13l4 4L19 7" }) }),
  warning: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
  info: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx3("path", { d: "M12 16v-4m0-4h.01" })
  ] }),
  lightbulb: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M9 21h6m-6 0v-2m6 2v-2m-9-7a6 6 0 1112 0c0 3.31-2.31 6-5 8H9c-2.69-2-5-4.69-5-8z" }) }),
  cart: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("circle", { cx: "9", cy: "21", r: "1" }),
    /* @__PURE__ */ jsx3("circle", { cx: "20", cy: "21", r: "1" }),
    /* @__PURE__ */ jsx3("path", { d: "M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" })
  ] }),
  save: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("path", { d: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" }),
    /* @__PURE__ */ jsx3("path", { d: "M17 21v-8H7v8M7 3v5h8" })
  ] }),
  refresh: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" }) }),
  loading: /* @__PURE__ */ jsxs2(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      style: {
        animation: "spin 1s linear infinite"
      },
      children: [
        /* @__PURE__ */ jsx3(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            strokeDasharray: "60",
            strokeDashoffset: "40"
          }
        ),
        /* @__PURE__ */ jsx3("style", { children: `
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        ` })
      ]
    }
  ),
  image: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx3("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsx3("path", { d: "M21 15l-5-5L5 21" })
  ] }),
  text: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M4 7V4h16v3M9 20h6M12 4v16" }) }),
  palette: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("circle", { cx: "13.5", cy: "6.5", r: ".5" }),
    /* @__PURE__ */ jsx3("circle", { cx: "17.5", cy: "10.5", r: ".5" }),
    /* @__PURE__ */ jsx3("circle", { cx: "8.5", cy: "7.5", r: ".5" }),
    /* @__PURE__ */ jsx3("circle", { cx: "6.5", cy: "12.5", r: ".5" }),
    /* @__PURE__ */ jsx3("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" })
  ] }),
  trash: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" }) }),
  plus: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M12 5v14m-7-7h14" }) }),
  robot: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("rect", { x: "3", y: "11", width: "18", height: "10", rx: "2" }),
    /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "5", r: "2" }),
    /* @__PURE__ */ jsx3("path", { d: "M12 7v4m-4 5h.01M16 16h.01" })
  ] }),
  camera: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("path", { d: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" }),
    /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  upload: /* @__PURE__ */ jsx3("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v12" }) }),
  zoomIn: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("path", { d: "M21 3l-9 9m0 0v-6m0 6h6" }),
    /* @__PURE__ */ jsx3("path", { d: "M3 21l9-9m0 0v6m0-6H6" })
  ] }),
  zoomOut: /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [
    /* @__PURE__ */ jsx3("path", { d: "M15 9l6-6m0 0h-6m6 0v6" }),
    /* @__PURE__ */ jsx3("path", { d: "M9 15l-6 6m0 0h6m-6 0v-6" })
  ] })
}[type] || null }), FONT_LIST = [
  // 日本語フォント - Google Fonts
  { value: "Noto Sans JP", label: "Noto Sans JP", family: "'Noto Sans JP', sans-serif", type: "japanese" },
  { value: "Noto Serif JP", label: "Noto Serif JP", family: "'Noto Serif JP', serif", type: "japanese" },
  { value: "BIZ UDPGothic", label: "BIZ UDP\u30B4\u30B7\u30C3\u30AF", family: "'BIZ UDPGothic', sans-serif", type: "japanese" },
  { value: "BIZ UDPMincho", label: "BIZ UDP\u660E\u671D", family: "'BIZ UDPMincho', serif", type: "japanese" },
  { value: "M PLUS 1p", label: "M PLUS 1p", family: "'M PLUS 1p', sans-serif", type: "japanese" },
  { value: "M PLUS 2", label: "M PLUS 2", family: "'M PLUS 2', sans-serif", type: "japanese" },
  { value: "M PLUS Rounded 1c", label: "M PLUS Rounded 1c", family: "'M PLUS Rounded 1c', sans-serif", type: "japanese" },
  { value: "Murecho", label: "Murecho", family: "'Murecho', sans-serif", type: "japanese" },
  { value: "Zen Maru Gothic", label: "Zen Maru Gothic", family: "'Zen Maru Gothic', sans-serif", type: "japanese" },
  { value: "Zen Kaku Gothic New", label: "Zen Kaku Gothic New", family: "'Zen Kaku Gothic New', sans-serif", type: "japanese" },
  { value: "Zen Kaku Gothic Antique", label: "Zen Kaku Gothic Antique", family: "'Zen Kaku Gothic Antique', sans-serif", type: "japanese" },
  { value: "Zen Old Mincho", label: "Zen Old Mincho", family: "'Zen Old Mincho', serif", type: "japanese" },
  { value: "Zen Kurenaido", label: "Zen Kurenaido", family: "'Zen Kurenaido', sans-serif", type: "japanese" },
  { value: "Zen Antique", label: "Zen Antique", family: "'Zen Antique', serif", type: "japanese" },
  { value: "Zen Antique Soft", label: "Zen Antique Soft", family: "'Zen Antique Soft', serif", type: "japanese" },
  { value: "Kosugi", label: "Kosugi", family: "'Kosugi', sans-serif", type: "japanese" },
  { value: "Kosugi Maru", label: "Kosugi Maru", family: "'Kosugi Maru', sans-serif", type: "japanese" },
  { value: "Sawarabi Mincho", label: "Sawarabi Mincho", family: "'Sawarabi Mincho', serif", type: "japanese" },
  { value: "Sawarabi Gothic", label: "Sawarabi Gothic", family: "'Sawarabi Gothic', sans-serif", type: "japanese" },
  { value: "Klee One", label: "Klee One", family: "'Klee One', cursive", type: "japanese" },
  { value: "Shippori Mincho", label: "Shippori Mincho", family: "'Shippori Mincho', serif", type: "japanese" },
  { value: "Shippori Antique", label: "Shippori Antique", family: "'Shippori Antique', sans-serif", type: "japanese" },
  { value: "Shippori Antique B1", label: "Shippori Antique B1", family: "'Shippori Antique B1', sans-serif", type: "japanese" },
  { value: "Yusei Magic", label: "Yusei Magic", family: "'Yusei Magic', sans-serif", type: "japanese" },
  { value: "Yomogi", label: "Yomogi", family: "'Yomogi', cursive", type: "japanese" },
  { value: "Dela Gothic One", label: "\u30C7\u30E9\u30B4\u30B7\u30C3\u30AF", family: "'Dela Gothic One', sans-serif", type: "japanese" },
  { value: "DotGothic16", label: "\u30C9\u30C3\u30C8\u30B4\u30B7\u30C3\u30AF16", family: "'DotGothic16', sans-serif", type: "japanese" },
  { value: "Hina Mincho", label: "\u3072\u306A\u660E\u671D", family: "'Hina Mincho', serif", type: "japanese" },
  { value: "Kaisei Decol", label: "\u89E3\u661F\u30C7\u30B3\u30FC\u30EB", family: "'Kaisei Decol', serif", type: "japanese" },
  { value: "Kaisei HarunoUmi", label: "Kaisei HarunoUmi", family: "'Kaisei HarunoUmi', serif", type: "japanese" },
  { value: "Kaisei Tokumin", label: "Kaisei Tokumin", family: "'Kaisei Tokumin', serif", type: "japanese" },
  { value: "Kaisei Opti", label: "Kaisei Opti", family: "'Kaisei Opti', serif", type: "japanese" },
  { value: "Kiwi Maru", label: "\u30AD\u30A6\u30A4\u4E38", family: "'Kiwi Maru', sans-serif", type: "japanese" },
  { value: "Reggae One", label: "Reggae One", family: "'Reggae One', cursive", type: "japanese" },
  { value: "RocknRoll One", label: "RocknRoll One", family: "'RocknRoll One', sans-serif", type: "japanese" },
  { value: "Potta One", label: "Potta One", family: "'Potta One', cursive", type: "japanese" },
  { value: "Train One", label: "Train One", family: "'Train One', cursive", type: "japanese" },
  { value: "Rampart One", label: "Rampart One", family: "'Rampart One', cursive", type: "japanese" },
  { value: "Stick", label: "Stick", family: "'Stick', sans-serif", type: "japanese" },
  { value: "Mochiy Pop One", label: "Mochiy Pop One", family: "'Mochiy Pop One', sans-serif", type: "japanese" },
  { value: "Mochiy Pop P One", label: "Mochiy Pop P One", family: "'Mochiy Pop P One', sans-serif", type: "japanese" },
  { value: "New Tegomin", label: "New Tegomin", family: "'New Tegomin', serif", type: "japanese" },
  { value: "Hachi Maru Pop", label: "Hachi Maru Pop", family: "'Hachi Maru Pop', sans-serif", type: "japanese" },
  { value: "Otomanopee One", label: "Otomanopee One", family: "'Otomanopee One', sans-serif", type: "japanese" },
  { value: "Shirokuma", label: "Shirokuma", family: "'Shirokuma', cursive", type: "japanese" },
  { value: "Slackkey", label: "Slackkey", family: "'Slackkey', cursive", type: "japanese" },
  { value: "Cherry Bomb One", label: "Cherry Bomb One", family: "'Cherry Bomb One', cursive", type: "japanese" },
  { value: "Monomaniac One", label: "Monomaniac One", family: "'Monomaniac One', sans-serif", type: "japanese" },
  { value: "Palette Mosaic", label: "Palette Mosaic", family: "'Palette Mosaic', cursive", type: "japanese" },
  { value: "Yuji Syuku", label: "Yuji Syuku", family: "'Yuji Syuku', serif", type: "japanese" },
  { value: "Yuji Boku", label: "Yuji Boku", family: "'Yuji Boku', serif", type: "japanese" },
  { value: "Yuji Mai", label: "Yuji Mai", family: "'Yuji Mai', serif", type: "japanese" },
  // システムフォント（日本語）
  { value: "Hiragino Kaku Gothic ProN", label: "\u30D2\u30E9\u30AE\u30CE\u89D2\u30B4\u30B7\u30C3\u30AF", family: "'Hiragino Kaku Gothic ProN', sans-serif", type: "japanese" },
  { value: "Yu Gothic", label: "\u6E38\u30B4\u30B7\u30C3\u30AF", family: "'Yu Gothic', sans-serif", type: "japanese" },
  { value: "Meiryo", label: "\u30E1\u30A4\u30EA\u30AA", family: "Meiryo, sans-serif", type: "japanese" },
  // 英語フォント
  { value: "Arial", label: "Arial", family: "Arial, sans-serif", type: "english" },
  { value: "Helvetica", label: "Helvetica", family: "Helvetica, sans-serif", type: "english" },
  { value: "Times New Roman", label: "Times New Roman", family: "'Times New Roman', serif", type: "english" },
  { value: "Georgia", label: "Georgia", family: "Georgia, serif", type: "english" },
  { value: "Courier New", label: "Courier New", family: "'Courier New', monospace", type: "english" },
  { value: "Verdana", label: "Verdana", family: "Verdana, sans-serif", type: "english" },
  { value: "Trebuchet MS", label: "Trebuchet MS", family: "'Trebuchet MS', sans-serif", type: "english" },
  { value: "Comic Sans MS", label: "Comic Sans MS", family: "'Comic Sans MS', cursive", type: "english" },
  { value: "Impact", label: "Impact", family: "Impact, sans-serif", type: "english" },
  { value: "Palatino", label: "Palatino", family: "Palatino, serif", type: "english" },
  { value: "Garamond", label: "Garamond", family: "Garamond, serif", type: "english" }
], CANVAS_SIZE = 800;
function PrintAIze({ product }) {
  let canvasRef = useRef(null), fabricCanvasRef = useRef(null), fileInputRef = useRef(null), [uploadedImages, setUploadedImages] = useState([]), [isLoading, setIsLoading] = useState(!1), [isFabricReady, setIsFabricReady] = useState(!1), [showCopyrightModal, setShowCopyrightModal] = useState(!1), [copyrightAgreed, setCopyrightAgreed] = useState(!1), [imageQualityWarning, setImageQualityWarning] = useState(null), pendingImageRef = useRef(null), [fabricLoaded, setFabricLoaded] = useState(!1), [aiPrompt, setAiPrompt] = useState(""), [isGenerating, setIsGenerating] = useState(!1), [lastAIPrompt, setLastAIPrompt] = useState(""), [generatedImageUrl, setGeneratedImageUrl] = useState(""), [textInput, setTextInput] = useState(""), [textColor, setTextColor] = useState("#000000"), [fontSize, setFontSize] = useState(40), [fontFamily, setFontFamily] = useState("Noto Sans JP"), firstTextObjectRef = useRef(null), [isFontDropdownOpen, setIsFontDropdownOpen] = useState(!1), [selectedObject, setSelectedObject] = useState(null), [activeFontTab, setActiveFontTab] = useState("japanese"), historyRef = useRef([]), historyStepRef = useRef(0), [canUndo, setCanUndo] = useState(!1), [canRedo, setCanRedo] = useState(!1), isHistoryInitializedRef = useRef(!1), isLoadingHistoryRef = useRef(!1), [isAddingToCart, setIsAddingToCart] = useState(!1), [loadingMessage, setLoadingMessage] = useState(""), [isModalOpen, setIsModalOpen] = useState(!1), [modalColor, setModalColor] = useState(product.colors[0].name), [modalQuantities, setModalQuantities] = useState(() => {
    let initial = {};
    return product.colors.forEach((color) => {
      initial[color.name] = {
        S: 0,
        M: color.name === product.colors[0].name ? 1 : 0,
        // 最初のカラーのみMを1に
        L: 0,
        XL: 0,
        XXL: 0
      };
    }), initial;
  }), [selectedColor, setSelectedColor] = useState(product.colors[0]), [selectedSize, setSelectedSize] = useState("M"), sizes = ["S", "M", "L", "XL", "XXL"], [isMobile, setIsMobile] = useState(!1), [isZoomed, setIsZoomed] = useState(!1), [showTrash, setShowTrash] = useState(!1), [isOverTrash, setIsOverTrash] = useState(!1), [snapGuides, setSnapGuides] = useState({ vertical: null, horizontal: null }), [activeTab, setActiveTab] = useState("item"), [isOverlayOpen, setIsOverlayOpen] = useState(!1);
  useEffect(() => {
    let handleEscape = (e) => {
      e.key === "Escape" && isZoomed && fabricCanvasRef.current && (fabricCanvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]), fabricCanvasRef.current.renderAll(), setIsZoomed(!1));
    };
    return document.addEventListener("keydown", handleEscape), () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isZoomed]), useEffect(() => {
    let checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    return checkMobile(), window.addEventListener("resize", checkMobile), () => window.removeEventListener("resize", checkMobile);
  }, []);
  let fontDropdownRef = useRef(null);
  useEffect(() => {
    let handleClickOutside = (e) => {
      isFontDropdownOpen && fontDropdownRef.current && !fontDropdownRef.current.contains(e.target) && setIsFontDropdownOpen(!1);
    };
    return isFontDropdownOpen && document.addEventListener("click", handleClickOutside), () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFontDropdownOpen]), useEffect(() => {
    if (typeof window > "u" || !window.gsap || !window.ScrollTrigger)
      return;
    let gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    return gsap.registerPlugin(ScrollTrigger), isMobile || (gsap.fromTo(
      ".product-header",
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-header",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    ), gsap.to(".canvas-container", {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".canvas-container",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    })), () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);
  let getCurrentMockupImage = () => {
    let colorSlug = selectedColor.name === "\u30DB\u30EF\u30A4\u30C8" || selectedColor.name === "\u30AA\u30D5\u30DB\u30EF\u30A4\u30C8" ? "white" : "black";
    return `/images/products/${product.id}-${colorSlug}.png`;
  }, getPrintAreaInPixels = (canvasSize) => {
    let baseScale = 0.6, topOffset = 0;
    product.id === "box-tshirt-short" || product.id === "box-tshirt-long" || product.id === "sweatshirt" ? (baseScale = 0.36, topOffset = -20) : product.id === "hoodie" && (baseScale = 0.24, topOffset = 0);
    let scale = canvasSize * baseScale, ratio = product.printAreaWidth / product.printAreaHeight, width, height;
    return ratio > 1 ? (width = scale, height = scale / ratio) : (height = scale, width = scale * ratio), {
      width: Math.round(width),
      height: Math.round(height),
      left: Math.round((canvasSize - width) / 2),
      top: Math.round((canvasSize - height) / 2) + topOffset
    };
  };
  useEffect(() => {
    let checkCount = 0, isLoaded = !1, checkFabric = setInterval(() => {
      checkCount++, typeof window < "u" && typeof window.fabric < "u" && (isLoaded = !0, setFabricLoaded(!0), clearInterval(checkFabric));
    }, 100), timeout = setTimeout(() => {
      clearInterval(checkFabric), isLoaded || console.error("\u274C Fabric.js\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
    }, 1e4);
    return () => {
      clearInterval(checkFabric), clearTimeout(timeout);
    };
  }, []), useEffect(() => {
    if (!canvasRef.current || !fabricLoaded || typeof window.fabric > "u")
      return;
    let fabricLib = window.fabric, canvas = new fabricLib.Canvas(canvasRef.current, {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      backgroundColor: "#fafafa",
      selection: !0,
      preserveObjectStacking: !0,
      // 選択時にz-orderを変更しない
      allowTouchScrolling: !0,
      // モバイルでスクロールを許可
      stopContextMenu: !0,
      // コンテキストメニューを無効化
      fireRightClick: !1,
      // 右クリックイベントを無効化
      fireMiddleClick: !1,
      // 中クリックイベントを無効化
      enablePointerEvents: !0
      // ポインターイベントを有効化
    });
    window.innerWidth < 768 && canvasRef.current && (canvasRef.current.style.touchAction = "pan-y"), fabricCanvasRef.current = canvas, setIsFabricReady(!0);
    let isMobileDevice = window.innerWidth < 768, controlSize = isMobileDevice ? 32 : 24, cornerSize = isMobileDevice ? 28 : 20;
    fabricLib.Object.prototype.set({
      borderColor: "#667eea",
      cornerColor: "#667eea",
      cornerStyle: "circle",
      transparentCorners: !1,
      cornerSize,
      touchCornerSize: isMobileDevice ? 40 : cornerSize,
      // タッチ時はさらに大きく
      padding: isMobileDevice ? 10 : 5
    });
    let deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E", deleteControlSize = isMobileDevice ? 32 : 24, deleteControl = new fabricLib.Control({
      x: 0.5,
      y: -0.5,
      offsetY: isMobileDevice ? -20 : -16,
      offsetX: isMobileDevice ? 20 : 16,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) => {
        let target = transform.target;
        if (target && target.name !== "printArea") {
          firstTextObjectRef.current === target && (firstTextObjectRef.current = null, setTextInput("")), canvas.remove(target), canvas.renderAll(), setSelectedObject(null), setIsLoading(!1);
          let initialState = historyRef.current[0];
          historyRef.current = [initialState], historyStepRef.current = 0, updateHistoryButtons();
        }
        return !0;
      },
      render: (ctx, left, top, styleOverride, fabricObject) => {
        ctx.save(), ctx.translate(left, top), ctx.rotate(fabricLib.util.degreesToRadians(fabricObject.angle || 0)), ctx.drawImage(deleteImg, -deleteControlSize / 2, -deleteControlSize / 2, deleteControlSize, deleteControlSize), ctx.restore();
      },
      cornerSize: deleteControlSize
    }), deleteImg = document.createElement("img");
    deleteImg.src = deleteIcon, fabricLib.Object.prototype.controls.deleteControl = deleteControl;
    let mockupImageUrl = getCurrentMockupImage();
    fabricLib.Image.fromURL(
      mockupImageUrl,
      (img) => {
        if (!img || !img.width) {
          console.error("Failed to load image:", mockupImageUrl);
          return;
        }
        let scaleX = canvas.width / (img.width || 1), scaleY = canvas.height / (img.height || 1), scale = Math.min(scaleX, scaleY) * 0.95;
        img.scale(scale), img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: "center",
          originY: "center",
          selectable: !1,
          evented: !1
        }), img.setControlsVisibility({
          deleteControl: !1
        }), canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        let printArea2 = getPrintAreaInPixels(CANVAS_SIZE), getPrintAreaStrokeColor = () => {
          let colorName = selectedColor.name.toLowerCase();
          return colorName.includes("\u30D6\u30E9\u30C3\u30AF") || colorName.includes("black") ? "white" : "#000000";
        }, printRect = new fabricLib.Rect({
          left: printArea2.left,
          top: printArea2.top,
          width: printArea2.width,
          height: printArea2.height,
          fill: "transparent",
          stroke: getPrintAreaStrokeColor(),
          strokeWidth: 0.25,
          strokeDashArray: [2, 2],
          // 2pt線分の破線
          selectable: !1,
          evented: !1,
          name: "printArea"
          // 識別用
        });
        printRect.setControlsVisibility({
          deleteControl: !1
        }), canvas.add(printRect), setTimeout(() => {
          if (!isHistoryInitializedRef.current) {
            let json8 = JSON.stringify(canvas.toJSON(["selectable", "evented", "name"]));
            historyRef.current = [json8], historyStepRef.current = 0, isHistoryInitializedRef.current = !0, updateHistoryButtons();
          }
        }, 100);
      },
      { crossOrigin: "anonymous" }
    );
    let printArea = getPrintAreaInPixels(CANVAS_SIZE), touchListenersAdded = !1, canvasElement = canvasRef.current, canvasWrapper = canvas.wrapperEl;
    if (isMobileDevice && canvasWrapper) {
      let lastDistance = 0, initialDistance = 0, initialScale = { x: 1, y: 1 }, initialAngle = 0, cumulativeAngle = 0, lastAngle = 0, isGesture = !1, rotationEnabled = !1, gestureFrameCount = 0, lastCenter = { x: 0, y: 0 }, getTouchDistance = (touch1, touch2) => {
        let dx = touch1.clientX - touch2.clientX, dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      }, getTouchAngle = (touch1, touch2) => {
        let dx = touch2.clientX - touch1.clientX, dy = touch2.clientY - touch1.clientY;
        return Math.atan2(dy, dx) * 180 / Math.PI;
      }, getTouchCenter = (touch1, touch2) => ({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      }), handleTouchStart = (e) => {
        if (e.touches.length === 2) {
          canvasWrapper.style.touchAction = "none", isGesture = !0;
          let activeObject = canvas.getActiveObject();
          if (!activeObject || activeObject.name === "printArea") {
            let rect = canvasWrapper.getBoundingClientRect(), canvasScale = CANVAS_SIZE / rect.width, touch1 = e.touches[0], pointer = {
              x: (touch1.clientX - rect.left) * canvasScale,
              y: (touch1.clientY - rect.top) * canvasScale
            }, target = canvas.findTarget(e, !1);
            target && target.name !== "printArea" && (canvas.setActiveObject(target), activeObject = target);
          }
          activeObject && activeObject.name !== "printArea" && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), initialDistance = getTouchDistance(e.touches[0], e.touches[1]), lastDistance = initialDistance, initialScale = {
            x: activeObject.scaleX || 1,
            y: activeObject.scaleY || 1
          }, initialAngle = getTouchAngle(e.touches[0], e.touches[1]), lastAngle = initialAngle, cumulativeAngle = 0, rotationEnabled = !1, gestureFrameCount = 0, lastCenter = getTouchCenter(e.touches[0], e.touches[1]), activeObject.hasControls && activeObject.setControlsVisibility({
            mt: !1,
            mb: !1,
            ml: !1,
            mr: !1,
            tl: !1,
            tr: !1,
            bl: !1,
            br: !1,
            mtr: !1
          }), canvas.renderAll());
        }
      }, handleTouchMove = (e) => {
        if (e.touches.length === 2 && isGesture) {
          let activeObject = canvas.getActiveObject();
          if (activeObject && activeObject.name !== "printArea") {
            e.preventDefault(), e.stopPropagation(), gestureFrameCount++;
            let currentCenter = getTouchCenter(e.touches[0], e.touches[1]), rect = canvasWrapper.getBoundingClientRect(), canvasScale = CANVAS_SIZE / rect.width;
            if (lastCenter.x !== 0) {
              let dx = (currentCenter.x - lastCenter.x) * canvasScale, dy = (currentCenter.y - lastCenter.y) * canvasScale;
              activeObject.left = (activeObject.left || 0) + dx, activeObject.top = (activeObject.top || 0) + dy;
            }
            lastCenter = currentCenter;
            let currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
            if (initialDistance > 0) {
              let enhancedRatio = 1 + (currentDistance / initialDistance - 1) * 1.5, newScaleX = initialScale.x * enhancedRatio, newScaleY = initialScale.y * enhancedRatio;
              newScaleX > 0.05 && newScaleX < 15 && newScaleY > 0.05 && newScaleY < 15 && (activeObject.scaleX = newScaleX, activeObject.scaleY = newScaleY);
            }
            let currentAngle = getTouchAngle(e.touches[0], e.touches[1]), angleDiff = currentAngle - lastAngle;
            angleDiff > 180 && (angleDiff -= 360), angleDiff < -180 && (angleDiff += 360), cumulativeAngle += angleDiff, !rotationEnabled && gestureFrameCount > 3 && Math.abs(cumulativeAngle) > 15 && (rotationEnabled = !0), rotationEnabled && (activeObject.angle = (activeObject.angle || 0) + angleDiff), lastAngle = currentAngle, activeObject.setCoords();
            let objBounds = activeObject.getBoundingRect(!0);
            objBounds.left < printArea.left && (activeObject.left += printArea.left - objBounds.left), objBounds.top < printArea.top && (activeObject.top += printArea.top - objBounds.top), objBounds.left + objBounds.width > printArea.left + printArea.width && (activeObject.left -= objBounds.left + objBounds.width - (printArea.left + printArea.width)), objBounds.top + objBounds.height > printArea.top + printArea.height && (activeObject.top -= objBounds.top + objBounds.height - (printArea.top + printArea.height)), activeObject.setCoords(), canvas.renderAll();
          }
        }
      }, handleTouchEnd = (e) => {
        if (e.touches.length < 2) {
          canvasWrapper.style.touchAction = "pan-y", isGesture = !1, lastDistance = 0, initialDistance = 0, initialScale = { x: 1, y: 1 }, initialAngle = 0, cumulativeAngle = 0, lastAngle = 0, rotationEnabled = !1, gestureFrameCount = 0, lastCenter = { x: 0, y: 0 };
          let activeObject = canvas.getActiveObject();
          if (activeObject && activeObject.name !== "printArea") {
            activeObject.setCoords();
            let objBounds = activeObject.getBoundingRect(!0);
            objBounds.left < printArea.left && (activeObject.left += printArea.left - objBounds.left), objBounds.top < printArea.top && (activeObject.top += printArea.top - objBounds.top), objBounds.left + objBounds.width > printArea.left + printArea.width && (activeObject.left -= objBounds.left + objBounds.width - (printArea.left + printArea.width)), objBounds.top + objBounds.height > printArea.top + printArea.height && (activeObject.top -= objBounds.top + objBounds.height - (printArea.top + printArea.height)), activeObject.setCoords(), activeObject.hasControls && activeObject.setControlsVisibility({
              mt: !1,
              mb: !1,
              ml: !1,
              mr: !1,
              tl: !0,
              tr: !0,
              bl: !0,
              br: !0,
              mtr: !0,
              deleteControl: !0
            }), canvas.renderAll(), saveHistory();
          }
        }
      };
      canvasWrapper.addEventListener("touchstart", handleTouchStart, { passive: !1, capture: !0 }), canvasWrapper.addEventListener("touchmove", handleTouchMove, { passive: !1, capture: !0 }), canvasWrapper.addEventListener("touchend", handleTouchEnd, { capture: !0 }), touchListenersAdded = !0, canvas._touchHandlers = {
        element: canvasWrapper,
        start: handleTouchStart,
        move: handleTouchMove,
        end: handleTouchEnd
      };
    }
    canvas.on("object:moving", (e) => {
      let obj = e.target;
      if (!obj || obj.name === "printArea")
        return;
      if (e.e && e.e.shiftKey) {
        obj._movingStart || (obj._movingStart = { x: obj.left, y: obj.top });
        let dx = Math.abs(obj.left - obj._movingStart.x), dy = Math.abs(obj.top - obj._movingStart.y);
        dx > dy ? obj.top = obj._movingStart.y : obj.left = obj._movingStart.x;
      } else
        obj._movingStart = null;
      obj.setCoords();
      let objBounds = obj.getBoundingRect(!0), trashZoneStart = printArea.top + printArea.height, trashZoneThreshold = trashZoneStart + 20, trashZoneActive = trashZoneStart + 60, objectBottom = objBounds.top + objBounds.height;
      objectBottom > trashZoneThreshold ? (setShowTrash(!0), objectBottom > trashZoneActive ? setIsOverTrash(!0) : setIsOverTrash(!1)) : (setShowTrash(!1), setIsOverTrash(!1)), canvasRef.current && (canvasRef.current.style.touchAction = "none");
      let snapThreshold = 10, centerX = printArea.left + printArea.width / 2, centerY = printArea.top + printArea.height / 2, objCenterX = objBounds.left + objBounds.width / 2, objCenterY = objBounds.top + objBounds.height / 2;
      obj._lastPos || (obj._lastPos = { x: obj.left, y: obj.top });
      let moveX = Math.abs(obj.left - obj._lastPos.x), moveY = Math.abs(obj.top - obj._lastPos.y), isHorizontalMove = moveX > moveY * 2, isVerticalMove = moveY > moveX * 2;
      obj._lastPos = { x: obj.left, y: obj.top };
      let newGuides = { vertical: null, horizontal: null };
      (!isHorizontalMove || Math.abs(objCenterX - centerX) < snapThreshold * 3) && Math.abs(objCenterX - centerX) < snapThreshold && (obj.left += centerX - objCenterX, newGuides.vertical = centerX), (!isVerticalMove || Math.abs(objCenterY - centerY) < snapThreshold * 3) && Math.abs(objCenterY - centerY) < snapThreshold && (obj.top += centerY - objCenterY, newGuides.horizontal = centerY), (!isHorizontalMove || Math.abs(objBounds.left - printArea.left) < snapThreshold * 3) && Math.abs(objBounds.left - printArea.left) < snapThreshold && (obj.left += printArea.left - objBounds.left, newGuides.vertical = printArea.left + objBounds.width / 2);
      let rightEdge = printArea.left + printArea.width;
      (!isHorizontalMove || Math.abs(objBounds.left + objBounds.width - rightEdge) < snapThreshold * 3) && Math.abs(objBounds.left + objBounds.width - rightEdge) < snapThreshold && (obj.left += rightEdge - (objBounds.left + objBounds.width), newGuides.vertical = rightEdge - objBounds.width / 2), (!isVerticalMove || Math.abs(objBounds.top - printArea.top) < snapThreshold * 3) && Math.abs(objBounds.top - printArea.top) < snapThreshold && (obj.top += printArea.top - objBounds.top, newGuides.horizontal = printArea.top + objBounds.height / 2);
      let bottomEdge = printArea.top + printArea.height;
      (!isVerticalMove || Math.abs(objBounds.top + objBounds.height - bottomEdge) < snapThreshold * 3) && Math.abs(objBounds.top + objBounds.height - bottomEdge) < snapThreshold && (obj.top += bottomEdge - (objBounds.top + objBounds.height), newGuides.horizontal = bottomEdge - objBounds.height / 2), setSnapGuides(newGuides), objBounds.left < printArea.left && (obj.left += printArea.left - objBounds.left), objBounds.left + objBounds.width > printArea.left + printArea.width && (obj.left -= objBounds.left + objBounds.width - (printArea.left + printArea.width)), objBounds.top < printArea.top && (obj.top += printArea.top - objBounds.top);
      let maxBottom = printArea.top + printArea.height + 100;
      objBounds.top + objBounds.height > maxBottom && (obj.top -= objBounds.top + objBounds.height - maxBottom);
    }), canvas.on("object:scaling", (e) => {
      let obj = e.target;
      if (!obj || obj.name === "printArea")
        return;
      obj.setCoords();
      let objBounds = obj.getBoundingRect(!0);
      objBounds.left < printArea.left && (obj.left += printArea.left - objBounds.left), objBounds.top < printArea.top && (obj.top += printArea.top - objBounds.top), objBounds.left + objBounds.width > printArea.left + printArea.width && (obj.left -= objBounds.left + objBounds.width - (printArea.left + printArea.width)), objBounds.top + objBounds.height > printArea.top + printArea.height && (obj.top -= objBounds.top + objBounds.height - (printArea.top + printArea.height));
    }), canvas.on("object:rotating", (e) => {
      let obj = e.target;
      if (!obj || obj.name === "printArea")
        return;
      e.e && e.e.shiftKey && (obj.angle = Math.round(obj.angle / 15) * 15), obj.setCoords();
      let objBounds = obj.getBoundingRect(!0);
      objBounds.left < printArea.left && (obj.left += printArea.left - objBounds.left), objBounds.top < printArea.top && (obj.top += printArea.top - objBounds.top), objBounds.left + objBounds.width > printArea.left + printArea.width && (obj.left -= objBounds.left + objBounds.width - (printArea.left + printArea.width)), objBounds.top + objBounds.height > printArea.top + printArea.height && (obj.top -= objBounds.top + objBounds.height - (printArea.top + printArea.height));
    });
    let isOutsideInteraction = !1;
    canvas.on("mouse:down:before", (e) => {
      if (!e.e)
        return;
      let pointer = canvas.getPointer(e.e);
      (pointer.x < printArea.left || pointer.x > printArea.left + printArea.width || pointer.y < printArea.top || pointer.y > printArea.top + printArea.height) && window.innerWidth < 768 ? (isOutsideInteraction = !0, e.e.preventDefault(), e.e.stopPropagation(), canvasRef.current && (canvasRef.current.style.touchAction = "pan-y"), canvas.selection = !1, canvas.discardActiveObject(), canvas.renderAll()) : (isOutsideInteraction = !1, canvas.selection = !0);
    }), canvas.on("mouse:down", (e) => {
      if (isOutsideInteraction)
        return !1;
      let pointer = canvas.getPointer(e.e), clickedOnObject = canvas.findTarget(e.e, !1);
      if ((!clickedOnObject || clickedOnObject.name === "printArea") && (pointer.x < printArea.left || pointer.x > printArea.left + printArea.width || pointer.y < printArea.top || pointer.y > printArea.top + printArea.height) && window.innerWidth < 768)
        return canvasRef.current && (canvasRef.current.style.touchAction = "pan-y"), canvas.discardActiveObject(), canvas.renderAll(), !1;
    }), canvas.on("mouse:up", () => {
      isOutsideInteraction && (isOutsideInteraction = !1, canvas.selection = !0);
    }), canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null), canvasRef.current && (canvasRef.current.style.touchAction = "none");
    }), canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null), canvasRef.current && (canvasRef.current.style.touchAction = "none");
    }), canvas.on("selection:cleared", () => {
      setSelectedObject(null), setShowTrash(!1), setIsOverTrash(!1), setSnapGuides({ vertical: null, horizontal: null }), canvasRef.current && window.innerWidth < 768 && (canvasRef.current.style.touchAction = "pan-y");
    }), canvas.on("object:modified", (e) => {
      let obj = e.target;
      if (obj && obj.name !== "printArea") {
        obj.setCoords();
        let objBounds = obj.getBoundingRect(!0), trashZoneActive = printArea.top + printArea.height + 60;
        if (objBounds.top + objBounds.height > trashZoneActive) {
          canvas.remove(obj), setShowTrash(!1), setIsOverTrash(!1), canvas.renderAll();
          return;
        }
      }
      if (setShowTrash(!1), setIsOverTrash(!1), setSnapGuides({ vertical: null, horizontal: null }), obj && obj._movingStart && (obj._movingStart = null), obj && obj._lastPos && (obj._lastPos = null), obj && obj.type === "i-text" && adjustTextSizeToFitPrintArea(obj), obj && obj.name !== "printArea") {
        obj.setCoords();
        let objBounds = obj.getBoundingRect(!0), needsAdjustment = !1;
        if (objBounds.left < printArea.left || objBounds.top < printArea.top || objBounds.left + objBounds.width > printArea.left + printArea.width || objBounds.top + objBounds.height > printArea.top + printArea.height) {
          let maxWidth = printArea.width, maxHeight = printArea.height;
          if (objBounds.width > maxWidth || objBounds.height > maxHeight) {
            let scaleX = maxWidth / objBounds.width, scaleY = maxHeight / objBounds.height, scale = Math.min(scaleX, scaleY);
            obj.scaleX *= scale, obj.scaleY *= scale, needsAdjustment = !0;
          }
          obj.setCoords();
          let newBounds = obj.getBoundingRect(!0);
          newBounds.left < printArea.left && (obj.left += printArea.left - newBounds.left, needsAdjustment = !0), newBounds.top < printArea.top && (obj.top += printArea.top - newBounds.top, needsAdjustment = !0), newBounds.left + newBounds.width > printArea.left + printArea.width && (obj.left -= newBounds.left + newBounds.width - (printArea.left + printArea.width), needsAdjustment = !0), newBounds.top + newBounds.height > printArea.top + printArea.height && (obj.top -= newBounds.top + newBounds.height - (printArea.top + printArea.height), needsAdjustment = !0), needsAdjustment && (obj.setCoords(), canvas.renderAll());
        }
      }
      saveHistory();
    }), canvas.on("object:added", () => saveHistory()), canvas.on("object:removed", () => saveHistory()), canvas.on("selection:created", (e) => {
      let obj = e.selected[0];
      setSelectedObject(obj), obj && obj.type === "i-text" && (setTextInput(obj.text || ""), firstTextObjectRef.current = obj);
    }), canvas.on("selection:updated", (e) => {
      let obj = e.selected[0];
      setSelectedObject(obj), obj && obj.type === "i-text" ? (setTextInput(obj.text || ""), firstTextObjectRef.current = obj) : (setTextInput(""), firstTextObjectRef.current = null);
    }), canvas.on("selection:cleared", () => {
      setSelectedObject(null), setTextInput(""), firstTextObjectRef.current = null;
    });
    let handleKeyDown = (e) => {
      let cmdOrCtrl = navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault(), handleRedo();
        return;
      }
      if (cmdOrCtrl && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault(), handleUndo();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && canvas.getActiveObject()) {
        let activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.name !== "printArea") {
          e.preventDefault(), firstTextObjectRef.current === activeObject && (firstTextObjectRef.current = null, setTextInput("")), canvas.remove(activeObject), canvas.renderAll(), setSelectedObject(null), setIsLoading(!1);
          let initialState = historyRef.current[0];
          historyRef.current = [initialState], historyStepRef.current = 0, updateHistoryButtons();
        }
      }
    };
    return window.addEventListener("keydown", handleKeyDown), () => {
      if (window.removeEventListener("keydown", handleKeyDown), fabricCanvasRef.current && fabricCanvasRef.current._touchHandlers) {
        let handlers = fabricCanvasRef.current._touchHandlers;
        handlers.element.removeEventListener("touchstart", handlers.start, { capture: !0 }), handlers.element.removeEventListener("touchmove", handlers.move, { capture: !0 }), handlers.element.removeEventListener("touchend", handlers.end, { capture: !0 });
      }
      fabricCanvasRef.current && fabricCanvasRef.current.dispose();
    };
  }, [fabricLoaded]), useEffect(() => {
    if (!fabricCanvasRef.current || !fabricLoaded || typeof window.fabric > "u")
      return;
    let fabricLib = window.fabric, canvas = fabricCanvasRef.current, mockupImageUrl = getCurrentMockupImage();
    fabricLib.Image.fromURL(mockupImageUrl, (img) => {
      if (!img || !img.width)
        return;
      let scaleX = canvas.width / (img.width || 1), scaleY = canvas.height / (img.height || 1), scale = Math.min(scaleX, scaleY) * 0.95;
      img.scale(scale), img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: !1,
        evented: !1
      }), img.setControlsVisibility({
        deleteControl: !1
      }), canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    }, { crossOrigin: "anonymous" }), canvas.getObjects().forEach((obj) => {
      if (obj.name === "printArea") {
        let colorName = selectedColor.name.toLowerCase(), newColor = colorName.includes("\u30D6\u30E9\u30C3\u30AF") || colorName.includes("black") ? "white" : "#000000";
        obj.set("stroke", newColor), canvas.renderAll();
      }
    });
  }, [selectedColor, fabricLoaded, getCurrentMockupImage]);
  let saveHistory = () => {
    if (!fabricCanvasRef.current || !isHistoryInitializedRef.current || isLoadingHistoryRef.current)
      return;
    let json8 = JSON.stringify(fabricCanvasRef.current.toJSON(["selectable", "evented", "name"]));
    historyRef.current = historyRef.current.slice(0, historyStepRef.current + 1), historyRef.current.push(json8), historyStepRef.current = historyRef.current.length - 1, historyRef.current.length > 50 && (historyRef.current.splice(1, 1), historyStepRef.current--), updateHistoryButtons();
  }, updateHistoryButtons = () => {
    let newCanUndo = historyStepRef.current > 0, newCanRedo = historyStepRef.current < historyRef.current.length - 1;
    setCanUndo(newCanUndo), setCanRedo(newCanRedo);
  }, handleUndo = () => {
    if (historyStepRef.current > 0 && fabricCanvasRef.current) {
      isLoadingHistoryRef.current = !0, historyStepRef.current--;
      let json8 = historyRef.current[historyStepRef.current];
      firstTextObjectRef.current = null, setTextInput(""), fabricCanvasRef.current.loadFromJSON(json8, () => {
        if (fabricCanvasRef.current?.discardActiveObject(), fabricCanvasRef.current?.renderAll(), requestAnimationFrame(() => {
          let backgroundImage = fabricCanvasRef.current?.backgroundImage;
          backgroundImage && (backgroundImage.set({
            selectable: !1,
            evented: !1
          }), backgroundImage.setControlsVisibility({
            deleteControl: !1
          })), fabricCanvasRef.current?.getObjects()?.forEach((obj) => {
            obj.name === "printArea" && (obj.set({
              selectable: !1,
              evented: !1
            }), obj.setControlsVisibility({
              deleteControl: !1
            }));
          }), fabricCanvasRef.current?.renderAll();
        }), setSelectedObject(null), historyStepRef.current === 0) {
          let initialState = historyRef.current[0];
          historyRef.current = [initialState], historyStepRef.current = 0;
        }
        updateHistoryButtons(), isLoadingHistoryRef.current = !1;
      });
    }
  }, handleRedo = () => {
    if (historyStepRef.current < historyRef.current.length - 1 && fabricCanvasRef.current) {
      isLoadingHistoryRef.current = !0, historyStepRef.current++;
      let json8 = historyRef.current[historyStepRef.current];
      firstTextObjectRef.current = null, setTextInput(""), fabricCanvasRef.current.loadFromJSON(json8, () => {
        fabricCanvasRef.current?.discardActiveObject(), fabricCanvasRef.current?.renderAll(), requestAnimationFrame(() => {
          let backgroundImage = fabricCanvasRef.current?.backgroundImage;
          backgroundImage && (backgroundImage.set({
            selectable: !1,
            evented: !1
          }), backgroundImage.setControlsVisibility({
            deleteControl: !1
          })), fabricCanvasRef.current?.getObjects()?.forEach((obj) => {
            obj.name === "printArea" && (obj.set({
              selectable: !1,
              evented: !1
            }), obj.setControlsVisibility({
              deleteControl: !1
            }));
          }), fabricCanvasRef.current?.renderAll();
        }), setSelectedObject(null), updateHistoryButtons(), isLoadingHistoryRef.current = !1;
      });
    }
  }, checkImageQuality = (file, width, height) => {
    let fileSizeMB = file.size / 1048576;
    return fileSizeMB > 100 ? {
      isGood: !1,
      message: `[WARNING] \u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059\uFF08${fileSizeMB.toFixed(1)}MB\uFF09
100MB\u4EE5\u4E0B\u3092\u63A8\u5968\u3057\u307E\u3059\u3002`
    } : width < 1182 || height < 1475 ? {
      isGood: !1,
      message: `[WARNING] \u753B\u50CF\u30B5\u30A4\u30BA\u304C\u5C0F\u3055\u3059\u304E\u307E\u3059

\u73FE\u5728: ${width} \xD7 ${height}px
\u6700\u4F4E: 1182 \xD7 1475px (150 DPI)
\u63A8\u5968: 2953 \xD7 3685px (300 DPI)

\u5370\u5237\u6642\u306B\u753B\u8CEA\u304C\u7C97\u304F\u306A\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002`
    } : width < 2953 || height < 3685 ? {
      isGood: !0,
      message: `[INFO] \u753B\u50CF\u30B5\u30A4\u30BA\u306F\u4F7F\u7528\u53EF\u80FD\u3067\u3059\u304C\u3001\u3088\u308A\u9AD8\u753B\u8CEA\u3092\u304A\u6C42\u3081\u306E\u5834\u5408\u306F\u5927\u304D\u306A\u753B\u50CF\u3092\u63A8\u5968\u3057\u307E\u3059

\u73FE\u5728: ${width} \xD7 ${height}px
\u63A8\u5968: 2953 \xD7 3685px (300 DPI)`
    } : {
      isGood: !0,
      message: `[SUCCESS] \u9AD8\u54C1\u8CEA\u306A\u753B\u50CF\u3067\u3059\uFF01

${width} \xD7 ${height}px
\u5370\u5237\u306B\u6700\u9069\u306A\u30B5\u30A4\u30BA\u3067\u3059\u3002`
    };
  }, processImageUpload = (file, event) => {
    setIsLoading(!0);
    let reader = new FileReader();
    reader.onload = (e) => {
      let imageUrl = e.target?.result, img = new Image();
      img.onload = () => {
        let qualityCheck = checkImageQuality(file, img.width, img.height);
        if (setImageQualityWarning(qualityCheck.message), !qualityCheck.isGood && !confirm(`${qualityCheck.message}

\u305D\u308C\u3067\u3082\u3053\u306E\u753B\u50CF\u3092\u4F7F\u7528\u3057\u307E\u3059\u304B\uFF1F`)) {
          setIsLoading(!1), setImageQualityWarning(null), event.target.value = "";
          return;
        }
        setUploadedImages((prev) => [...prev, imageUrl]), fabricCanvasRef.current && typeof window.fabric < "u" ? window.fabric.Image.fromURL(imageUrl, (fabricImg) => {
          let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width), maxWidth = printArea.width * 0.8, maxHeight = printArea.height * 0.8, scale = Math.min(
            maxWidth / (fabricImg.width || 1),
            maxHeight / (fabricImg.height || 1),
            1
          );
          fabricImg.scale(scale);
          let isMobileView = window.innerWidth < 768;
          fabricImg.set({
            left: printArea.left + printArea.width / 2,
            top: printArea.top + printArea.height / 2,
            originX: "center",
            originY: "center",
            selectable: !0,
            hasControls: !isMobileView,
            // スマホではコントロール非表示
            hasBorders: !isMobileView
            // スマホでは枠線も非表示
          }), fabricImg.originalImageData = imageUrl, fabricImg.originalWidth = img.width, fabricImg.originalHeight = img.height, canvas.add(fabricImg), canvas.setActiveObject(fabricImg), canvas.renderAll(), setIsLoading(!1), event.target.value = "";
        }) : (setIsLoading(!1), event.target.value = "");
      }, img.src = imageUrl;
    }, reader.onerror = () => {
      setIsLoading(!1), event.target.value = "";
    }, reader.readAsDataURL(file);
  }, handleImageUpload = (event) => {
    let files = event.target.files;
    if (!files || files.length === 0) {
      setIsLoading(!1);
      return;
    }
    let file = files[0];
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} \u306F\u753B\u50CF\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF08PNG, JPG, GIF\u306A\u3069\u3092\u4F7F\u7528\u3057\u3066\u304F\u3060\u3055\u3044\uFF09`), event.target.value = "";
      return;
    }
    if (!copyrightAgreed) {
      pendingImageRef.current = file, setShowCopyrightModal(!0);
      return;
    }
    processImageUpload(file, event);
  }, handleCopyrightAgree = () => {
    if (setCopyrightAgreed(!0), setShowCopyrightModal(!1), pendingImageRef.current && fileInputRef.current) {
      let dummyEvent = {
        target: fileInputRef.current,
        currentTarget: fileInputRef.current
      };
      processImageUpload(pendingImageRef.current, dummyEvent), pendingImageRef.current = null;
    }
  }, handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      alert("\u751F\u6210\u3057\u305F\u3044\u753B\u50CF\u306E\u8AAC\u660E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    setIsGenerating(!0);
    try {
      let data = await (await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          width: 1024,
          height: 1024
        })
      })).json();
      data.success && data.imageUrl ? (setGeneratedImageUrl(data.imageUrl), setLastAIPrompt(aiPrompt), fabricCanvasRef.current && typeof window.fabric < "u" && window.fabric.Image.fromURL(data.imageUrl, (img) => {
        let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width), maxWidth = printArea.width * 0.8, maxHeight = printArea.height * 0.8, scale = Math.min(
          maxWidth / (img.width || 1),
          maxHeight / (img.height || 1),
          1
        );
        img.scale(scale);
        let isMobileView = window.innerWidth < 768;
        img.set({
          left: printArea.left + printArea.width / 2,
          top: printArea.top + printArea.height / 2,
          originX: "center",
          originY: "center",
          selectable: !0,
          hasControls: !isMobileView,
          // スマホではコントロール非表示
          hasBorders: !isMobileView
          // スマホでは枠線も非表示
        }), img.originalImageData = data.imageUrl, img.originalWidth = img.width, img.originalHeight = img.height, fabricCanvasRef.current?.add(img), fabricCanvasRef.current?.setActiveObject(img), fabricCanvasRef.current?.renderAll();
      }, { crossOrigin: "anonymous" }), setAiPrompt("")) : alert(data.error || "AI\u753B\u50CF\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
    } catch (error) {
      console.error("AI\u751F\u6210\u30A8\u30E9\u30FC:", error), alert("AI\u753B\u50CF\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
    } finally {
      setIsGenerating(!1);
    }
  }, adjustTextSizeToFitPrintArea = (textObj) => {
    if (!fabricCanvasRef.current)
      return;
    let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width);
    textObj.setCoords();
    let textBounds = textObj.getBoundingRect(!0), exceedsWidth = textBounds.width > printArea.width, exceedsHeight = textBounds.height > printArea.height;
    if (exceedsWidth || exceedsHeight) {
      let scaleX = printArea.width / textBounds.width, scaleY = printArea.height / textBounds.height, scale = Math.min(scaleX, scaleY) * 0.95, currentFontSize = textObj.fontSize, newFontSize = Math.floor(currentFontSize * scale);
      textObj.set({ fontSize: newFontSize }), setFontSize(newFontSize), textObj.set({
        left: printArea.left + printArea.width / 2,
        top: printArea.top + printArea.height / 2
      }), textObj.setCoords(), canvas.renderAll();
    }
  }, handleTextInputChange = (value) => {
    if (setTextInput(value), !fabricCanvasRef.current || typeof window.fabric > "u")
      return;
    let fabricLib = window.fabric, canvas = fabricCanvasRef.current;
    if (firstTextObjectRef.current && canvas.contains(firstTextObjectRef.current))
      firstTextObjectRef.current.set({ text: value }), value.trim() && adjustTextSizeToFitPrintArea(firstTextObjectRef.current), canvas.renderAll(), value.trim() && saveHistory();
    else if (value.trim() && !firstTextObjectRef.current) {
      let printArea = getPrintAreaInPixels(canvas.width), text = new fabricLib.IText(value, {
        left: printArea.left + printArea.width / 2,
        top: printArea.top + printArea.height / 2,
        originX: "center",
        originY: "center",
        fill: textColor,
        fontSize,
        fontFamily,
        selectable: !0,
        hasControls: !0,
        hasBorders: !0
      });
      canvas.add(text), canvas.setActiveObject(text), adjustTextSizeToFitPrintArea(text), canvas.renderAll(), firstTextObjectRef.current = text, saveHistory();
    }
  }, handleAddText = () => {
    if (!textInput.trim() || !fabricCanvasRef.current || typeof window.fabric > "u") {
      alert("\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    let fabricLib = window.fabric, canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width), text = new fabricLib.IText(textInput, {
      left: printArea.left + printArea.width / 2,
      top: printArea.top + printArea.height / 2,
      originX: "center",
      originY: "center",
      fill: textColor,
      fontSize,
      fontFamily,
      selectable: !0,
      hasControls: !0,
      hasBorders: !0
    });
    fabricCanvasRef.current.add(text), fabricCanvasRef.current.setActiveObject(text), fabricCanvasRef.current.renderAll(), firstTextObjectRef.current = null, setTextInput(""), saveHistory();
  }, handleChangeTextColor = (color) => {
    setTextColor(color), selectedObject && selectedObject.type === "i-text" && (selectedObject.set({ fill: color }), fabricCanvasRef.current?.renderAll(), saveHistory());
  }, handleChangeFontSize = (size) => {
    setFontSize(size), selectedObject && selectedObject.type === "i-text" && (selectedObject.set({ fontSize: size }), adjustTextSizeToFitPrintArea(selectedObject), fabricCanvasRef.current?.renderAll(), saveHistory());
  }, handleChangeFontFamily = (font) => {
    setFontFamily(font), selectedObject && selectedObject.type === "i-text" && (selectedObject.set({ fontFamily: font }), adjustTextSizeToFitPrintArea(selectedObject), fabricCanvasRef.current?.renderAll(), saveHistory());
  }, getFilteredFonts = () => FONT_LIST.filter((font) => font.type === activeFontTab), uploadToSupabaseDirect = async (imageDataUrl) => {
    try {
      let blob = await (await fetch(imageDataUrl)).blob(), timestamp = Date.now(), randomId = Math.random().toString(36).substring(2, 15), fileName = `design-${timestamp}-${randomId}.png`, { createClient } = await import("@supabase/supabase-js"), supabaseUrl = window.ENV?.SUPABASE_URL || "", supabaseKey = window.ENV?.SUPABASE_ANON_KEY || "";
      if (!supabaseUrl || !supabaseKey)
        throw new Error("Supabase\u8A2D\u5B9A\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
      let supabase = createClient(supabaseUrl, supabaseKey), { data, error } = await supabase.storage.from("printaize").upload(fileName, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: !1
      });
      if (error)
        throw console.error("Supabase\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", error), new Error(`Supabase\u3078\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`);
      let { data: urlData } = supabase.storage.from("printaize").getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch (error) {
      throw console.error("Supabase\u76F4\u63A5\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", error), error;
    }
  }, generateHighResolutionOutput = async (canvas, printArea) => new Promise((resolve, reject) => {
    try {
      let fabricLib = window.fabric;
      if (!fabricLib) {
        console.error("Fabric.js not loaded"), reject(new Error("Fabric.js not loaded"));
        return;
      }
      let targetWidth = 2953, targetHeight = 3685, scaleRatio = targetWidth / printArea.width, offscreenCanvas = new fabricLib.Canvas(null, {
        width: targetWidth,
        height: targetHeight,
        backgroundColor: "transparent"
      }), filteredObjects = canvas.getObjects().filter((obj) => obj.name !== "printArea"), totalObjects = filteredObjects.length;
      if (totalObjects === 0) {
        let dataURL = offscreenCanvas.toDataURL({ format: "png", quality: 1 });
        resolve(dataURL);
        return;
      }
      let loadedObjects = [], loadedCount = 0, timeout = setTimeout(() => {
        console.error("\u9AD8\u89E3\u50CF\u5EA6\u51FA\u529B\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8"), reject(new Error("\u9AD8\u89E3\u50CF\u5EA6\u51FA\u529B\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F"));
      }, 3e4), checkComplete = () => {
        if (loadedCount++, loadedCount === totalObjects) {
          clearTimeout(timeout);
          try {
            loadedObjects.sort((a, b) => a.index - b.index), loadedObjects.forEach((item) => {
              offscreenCanvas.add(item.fabricObj);
            }), offscreenCanvas.renderAll();
            let dataURL = offscreenCanvas.toDataURL({
              format: "png",
              multiplier: 1
            });
            resolve(dataURL);
          } catch (error) {
            console.error("Canvas render\u30A8\u30E9\u30FC:", error), reject(error);
          }
        }
      };
      filteredObjects.forEach((obj, index) => {
        try {
          let relativeLeft = (obj.left - printArea.left) * scaleRatio, relativeTop = (obj.top - printArea.top) * scaleRatio;
          if (obj.type === "image" && obj.originalImageData)
            fabricLib.Image.fromURL(
              obj.originalImageData,
              (hdImg) => {
                if (!hdImg) {
                  console.error("\u753B\u50CF\u8AAD\u307F\u8FBC\u307F\u5931\u6557"), checkComplete();
                  return;
                }
                try {
                  let originalWidth = obj.originalWidth, originalHeight = obj.originalHeight;
                  if (!originalWidth || !originalHeight) {
                    console.warn("originalWidth/Height \u304C\u672A\u8A2D\u5B9A\u3002\u73FE\u5728\u306E\u30B5\u30A4\u30BA\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002");
                    let newScaleX = obj.scaleX * scaleRatio, newScaleY = obj.scaleY * scaleRatio;
                    hdImg.set({
                      left: relativeLeft,
                      top: relativeTop,
                      scaleX: newScaleX,
                      scaleY: newScaleY,
                      angle: obj.angle
                    }), loadedObjects.push({ index, fabricObj: hdImg }), checkComplete();
                    return;
                  }
                  let newScale = obj.width * obj.scaleX / originalWidth * scaleRatio;
                  hdImg.set({
                    left: relativeLeft,
                    top: relativeTop,
                    scaleX: newScale,
                    scaleY: newScale,
                    angle: obj.angle,
                    originX: obj.originX,
                    originY: obj.originY,
                    flipX: obj.flipX,
                    flipY: obj.flipY
                  }), obj.filters && obj.filters.length > 0 && (hdImg.filters = obj.filters.map((filter) => Object.assign(Object.create(Object.getPrototypeOf(filter)), filter)), hdImg.applyFilters()), loadedObjects.push({ index, fabricObj: hdImg }), checkComplete();
                } catch (error) {
                  console.error("\u753B\u50CF\u8A2D\u5B9A\u30A8\u30E9\u30FC:", error), checkComplete();
                }
              },
              { crossOrigin: "anonymous" }
            );
          else if (obj.type === "text" || obj.type === "textbox" || obj.type === "i-text") {
            let hdText = new fabricLib.Text(obj.text, {
              left: relativeLeft,
              top: relativeTop,
              fontSize: obj.fontSize * scaleRatio,
              fontFamily: obj.fontFamily,
              fill: obj.fill,
              angle: obj.angle,
              originX: obj.originX,
              originY: obj.originY,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY
            });
            loadedObjects.push({ index, fabricObj: hdText }), checkComplete();
          } else
            checkComplete();
        } catch (error) {
          console.error("\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u51E6\u7406\u30A8\u30E9\u30FC:", error), checkComplete();
        }
      });
    } catch (error) {
      console.error("generateHighResolutionOutput \u30A8\u30E9\u30FC:", error), reject(error);
    }
  }), openCartModal = () => {
    setModalColor(selectedColor.name), setModalQuantities((prev) => {
      let currentColorQuantities = prev[selectedColor.name];
      return currentColorQuantities[selectedSize] === 0 ? {
        ...prev,
        [selectedColor.name]: {
          ...currentColorQuantities,
          [selectedSize]: 1
        }
      } : prev;
    }), setIsModalOpen(!0);
  }, closeCartModal = () => {
    setIsModalOpen(!1);
  }, handleAddToCartMultiple = async () => {
    let allSelections = [];
    if (Object.entries(modalQuantities).forEach(([color, sizes2]) => {
      Object.entries(sizes2).forEach(([size, quantity]) => {
        quantity > 0 && allSelections.push({ color, size, quantity });
      });
    }), allSelections.length === 0) {
      alert("\u30B5\u30A4\u30BA\u3068\u500B\u6570\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    closeCartModal(), await handleAddToCartWithOptions(allSelections);
  }, handleAddToCartWithOptions = async (allSelections) => {
    if (fabricCanvasRef.current) {
      setIsAddingToCart(!0), setLoadingMessage("\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u4E2D...\uFF08\u5C11\u3057\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\uFF09");
      try {
        let canvas = fabricCanvasRef.current, printAreaObj = canvas.getObjects().find((obj) => obj.id === "printArea" || obj.name === "printArea");
        printAreaObj ? (printAreaObj.visible = !1, canvas.renderAll()) : console.warn("\u30D7\u30EA\u30F3\u30C8\u7BC4\u56F2\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
        let dataURL = canvas.toDataURL({
          format: "png",
          quality: 1
        });
        printAreaObj && (printAreaObj.visible = !0, canvas.renderAll());
        let printArea = printAreaObj;
        if (!printArea) {
          let calculatedPrintArea = getPrintAreaInPixels(canvas.width);
          printArea = {
            left: calculatedPrintArea.left,
            top: calculatedPrintArea.top,
            width: calculatedPrintArea.width,
            height: calculatedPrintArea.height
          };
        }
        let dataURLHD;
        try {
          if (!printArea)
            throw new Error("\u30D7\u30EA\u30F3\u30C8\u7BC4\u56F2\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
          dataURLHD = await generateHighResolutionOutput(canvas, printArea);
        } catch (error) {
          console.error("\u9AD8\u89E3\u50CF\u5EA6\u51FA\u529B\u30A8\u30E9\u30FC:", error), alert(`\u9AD8\u89E3\u50CF\u5EA6\u51FA\u529B\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${error instanceof Error ? error.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`), setIsAddingToCart(!1), setLoadingMessage("");
          return;
        }
        let designImageUrl;
        try {
          designImageUrl = await uploadToSupabaseDirect(dataURL);
        } catch (uploadError) {
          console.error("\u30D7\u30EC\u30D3\u30E5\u30FC\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", uploadError), alert(`\u30D7\u30EC\u30D3\u30E5\u30FC\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${uploadError instanceof Error ? uploadError.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`), setIsAddingToCart(!1), setLoadingMessage("");
          return;
        }
        let designImageUrlHD;
        try {
          designImageUrlHD = await uploadToSupabaseDirect(dataURLHD);
        } catch (uploadError) {
          console.error("\u9AD8\u89E3\u50CF\u5EA6\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", uploadError), alert(`\u9AD8\u89E3\u50CF\u5EA6\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${uploadError instanceof Error ? uploadError.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`), setIsAddingToCart(!1), setLoadingMessage("");
          return;
        }
        let designImageId = null;
        try {
          let { createClient } = await import("@supabase/supabase-js"), supabaseUrl = window.ENV?.SUPABASE_URL || "", supabaseKey = window.ENV?.SUPABASE_ANON_KEY || "";
          if (supabaseUrl && supabaseKey) {
            let supabase = createClient(supabaseUrl, supabaseKey), { data: insertData, error: insertError } = await supabase.from("design_images").insert({
              preview_url: designImageUrl,
              hd_url: designImageUrlHD,
              metadata: {
                product_id: product.id,
                selections: allSelections
                // 全カラー・サイズの選択を保存
              }
            }).select().single();
            insertError ? console.error("\u30C7\u30B6\u30A4\u30F3\u753B\u50CF\u306E\u8A18\u9332\u30A8\u30E9\u30FC:", insertError) : insertData && (designImageId = insertData.id);
          }
        } catch (dbError) {
          console.warn("\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u8A18\u9332\u5931\u6557\uFF08\u7D9A\u884C\uFF09:", dbError);
        }
        let cartItems = allSelections.map((selection) => ({
          variantId: getVariantId(selection.color, selection.size),
          quantity: selection.quantity,
          customAttributes: [
            { key: "design_image", value: designImageUrl },
            { key: "design_image_hd", value: designImageUrlHD }
          ]
        })), checkoutUrl = "";
        try {
          let response = await fetch("/api/add-to-cart-multiple", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartItems
            })
          });
          if (!response.ok)
            throw new Error(`\u30AB\u30FC\u30C8\u8FFD\u52A0API\u30A8\u30E9\u30FC: ${response.status}`);
          checkoutUrl = (await response.json()).checkoutUrl;
        } catch (error) {
          console.error("\u30AB\u30FC\u30C8\u8FFD\u52A0\u30A8\u30E9\u30FC:", error), alert(`\u30AB\u30FC\u30C8\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${error instanceof Error ? error.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`), setIsAddingToCart(!1), setLoadingMessage("");
          return;
        }
        checkoutUrl ? window.location.href = checkoutUrl : alert("\u30C1\u30A7\u30C3\u30AF\u30A2\u30A6\u30C8URL\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      } catch (error) {
        console.error("\u30AB\u30FC\u30C8\u8FFD\u52A0\u30A8\u30E9\u30FC:", error), alert(`\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002

\u30A8\u30E9\u30FC: ${error instanceof Error ? error.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`);
      } finally {
        setIsAddingToCart(!1), setLoadingMessage("");
      }
    }
  }, getVariantId = (color, size) => `gid://shopify/ProductVariant/${{
    \u30DB\u30EF\u30A4\u30C8: {
      S: "48602131628256",
      M: "48602131661024",
      L: "48602131693792",
      XL: "48602131726560",
      XXL: "48602131759328"
    },
    \u30D6\u30E9\u30C3\u30AF: {
      S: "48602131792096",
      M: "48602131824864",
      L: "48602131857632",
      XL: "48602131890400",
      XXL: "48602131923168"
    }
  }[color]?.[size] || "48602131661024"}`, handleAddToCart = async () => {
    if (fabricCanvasRef.current) {
      setIsAddingToCart(!0), setLoadingMessage("\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u4E2D...\uFF08\u5C11\u3057\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\uFF09");
      try {
        let canvas = fabricCanvasRef.current, printAreaRect = canvas.getObjects().find((obj) => obj.name === "printArea");
        printAreaRect && (printAreaRect.visible = !1, canvas.renderAll());
        let dataURL = canvas.toDataURL({
          format: "png",
          quality: 1
        });
        printAreaRect && (printAreaRect.visible = !0, canvas.renderAll());
        let printArea = getPrintAreaInPixels(canvas.width), dataURLHD = await generateHighResolutionOutput(canvas, printArea), uploadData = await (await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageData: dataURL
          })
        })).json();
        if (!uploadData.success) {
          alert(uploadData.error || "\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
          return;
        }
        let designImageUrlHD;
        try {
          designImageUrlHD = await uploadToSupabaseDirect(dataURLHD);
        } catch (uploadError) {
          console.error("\u9AD8\u89E3\u50CF\u5EA6\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC:", uploadError), alert(`\u9AD8\u89E3\u50CF\u5EA6\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${uploadError instanceof Error ? uploadError.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC"}`);
          return;
        }
        let designImageUrl = uploadData.imageUrl, designImageId = null;
        try {
          let { createClient } = await import("@supabase/supabase-js"), supabaseUrl = window.ENV?.SUPABASE_URL || "", supabaseKey = window.ENV?.SUPABASE_ANON_KEY || "";
          if (supabaseUrl && supabaseKey) {
            let supabase = createClient(supabaseUrl, supabaseKey), { data: insertData, error: insertError } = await supabase.from("design_images").insert({
              preview_url: designImageUrl,
              hd_url: designImageUrlHD,
              metadata: {
                product_id: product.id,
                product_name: product.name,
                color: selectedColor.name,
                size: selectedSize
              }
            }).select("id").single();
            !insertError && insertData ? designImageId = insertData.id : console.warn("\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u8A18\u9332\u30A8\u30E9\u30FC\uFF08\u7D9A\u884C\uFF09:", insertError);
          }
        } catch (dbError) {
          console.warn("\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u8A18\u9332\u5931\u6557\uFF08\u7D9A\u884C\uFF09:", dbError);
        }
        let variantMapping = {
          \u30DB\u30EF\u30A4\u30C8: {
            S: "48602131628256",
            M: "48602131661024",
            L: "48602131693792",
            XL: "48602131726560",
            XXL: "48602131759328"
          },
          \u30D6\u30E9\u30C3\u30AF: {
            S: "48602131792096",
            M: "48602131824864",
            L: "48602131857632",
            XL: "48602131890400",
            XXL: "48602131923168"
          }
        }, colorKey = selectedColor.name.includes("\u30DB\u30EF\u30A4\u30C8") || selectedColor.name.includes("White") ? "\u30DB\u30EF\u30A4\u30C8" : "\u30D6\u30E9\u30C3\u30AF", productVariantId = `gid://shopify/ProductVariant/${variantMapping[colorKey]?.[selectedSize] || "48602131661024"}`, data = await (await fetch("/api/add-to-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            designImageUrl,
            // CloudinaryのURL（プレビュー用）
            designImageUrlHD,
            // CloudinaryのURL（印刷用・高解像度）
            isAIGenerated: !!lastAIPrompt,
            aiPrompt: lastAIPrompt,
            productId: product.id,
            productName: product.name,
            color: selectedColor.name,
            size: selectedSize,
            price: product.price,
            productVariantId
          })
        })).json();
        data.success && data.checkoutUrl ? window.location.href = data.checkoutUrl : alert(data.error || "\u30AB\u30FC\u30C8\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      } catch (error) {
        console.error("\u30AB\u30FC\u30C8\u8FFD\u52A0\u30A8\u30E9\u30FC:", error);
        let errorMessage = error instanceof Error ? error.message : "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC";
        alert(`\u30AB\u30FC\u30C8\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F

\u30A8\u30E9\u30FC: ${errorMessage}`);
      } finally {
        setIsAddingToCart(!1), setLoadingMessage("");
      }
    }
  }, handleUploadClick = () => fileInputRef.current?.click(), handleRemoveSelected = () => {
    if (fabricCanvasRef.current && selectedObject) {
      firstTextObjectRef.current === selectedObject && (firstTextObjectRef.current = null, setTextInput("")), fabricCanvasRef.current.remove(selectedObject), fabricCanvasRef.current.renderAll(), setSelectedObject(null), setIsLoading(!1);
      let initialState = historyRef.current[0];
      historyRef.current = [initialState], historyStepRef.current = 0, updateHistoryButtons();
    }
  }, handleCenterVertical = () => {
    if (fabricCanvasRef.current && selectedObject) {
      let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width);
      selectedObject.set({
        top: printArea.top + printArea.height / 2,
        originY: "center"
      }), selectedObject.setCoords(), canvas.renderAll(), saveHistory();
    }
  }, handleCenterHorizontal = () => {
    if (fabricCanvasRef.current && selectedObject) {
      let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width);
      selectedObject.set({
        left: printArea.left + printArea.width / 2,
        originX: "center"
      }), selectedObject.setCoords(), canvas.renderAll(), saveHistory();
    }
  }, handleBringForward = () => {
    fabricCanvasRef.current && selectedObject && (fabricCanvasRef.current.bringForward(selectedObject), fabricCanvasRef.current.renderAll());
  }, handleSendBackwards = () => {
    fabricCanvasRef.current && selectedObject && (fabricCanvasRef.current.sendBackwards(selectedObject), fabricCanvasRef.current.renderAll());
  }, handleFitToPrintArea = () => {
    if (!fabricCanvasRef.current || !selectedObject)
      return;
    let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width), scaleX = printArea.width / selectedObject.width, scaleY = printArea.height / selectedObject.height, scale = Math.min(scaleX, scaleY);
    selectedObject.set({
      scaleX: scale,
      scaleY: scale,
      left: printArea.left + printArea.width / 2,
      top: printArea.top + printArea.height / 2
    }), selectedObject.setCoords(), canvas.renderAll(), saveHistory();
  }, undo = () => {
    if (!(!canUndo || !fabricCanvasRef.current) && historyStepRef.current > 0) {
      historyStepRef.current--, isLoadingHistoryRef.current = !0;
      let canvas = fabricCanvasRef.current, historyData = historyRef.current[historyStepRef.current];
      canvas.loadFromJSON(historyData, () => {
        canvas.renderAll(), isLoadingHistoryRef.current = !1, setCanUndo(historyStepRef.current > 0), setCanRedo(historyStepRef.current < historyRef.current.length - 1);
      });
    }
  }, redo = () => {
    if (!(!canRedo || !fabricCanvasRef.current) && historyStepRef.current < historyRef.current.length - 1) {
      historyStepRef.current++, isLoadingHistoryRef.current = !0;
      let canvas = fabricCanvasRef.current, historyData = historyRef.current[historyStepRef.current];
      canvas.loadFromJSON(historyData, () => {
        canvas.renderAll(), isLoadingHistoryRef.current = !1, setCanUndo(historyStepRef.current > 0), setCanRedo(historyStepRef.current < historyRef.current.length - 1);
      });
    }
  }, centerVertically = () => {
    if (!fabricCanvasRef.current || !selectedObject)
      return;
    let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width);
    selectedObject.set({
      top: printArea.top + printArea.height / 2
    }), selectedObject.setCoords(), canvas.renderAll(), saveHistory();
  }, centerHorizontally = () => {
    if (!fabricCanvasRef.current || !selectedObject)
      return;
    let canvas = fabricCanvasRef.current, printArea = getPrintAreaInPixels(canvas.width);
    selectedObject.set({
      left: printArea.left + printArea.width / 2
    }), selectedObject.setCoords(), canvas.renderAll(), saveHistory();
  }, bringForward = () => handleBringForward(), sendBackward = () => handleSendBackwards(), fitToPrintArea = () => handleFitToPrintArea(), handleClearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.getObjects().forEach((obj) => {
        fabricCanvasRef.current?.remove(obj);
      }), fabricCanvasRef.current.renderAll(), setUploadedImages([]), setSelectedObject(null), setIsLoading(!1), firstTextObjectRef.current = null, setTextInput("");
      let initialState = historyRef.current[0];
      historyRef.current = [initialState], historyStepRef.current = 0, updateHistoryButtons();
    }
  }, handleSaveDesign = () => {
    if (fabricCanvasRef.current) {
      let dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1
      }), link = document.createElement("a");
      link.download = "tshirt-design.png", link.href = dataURL, link.click();
    }
  };
  return fabricLoaded ? /* @__PURE__ */ jsxs2(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      style: {
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        padding: 0,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        backgroundColor: "#ffffff"
      },
      children: [
        /* @__PURE__ */ jsxs2(
          motion.div,
          {
            style: {
              width: isMobile ? "100%" : "40%",
              height: isMobile ? "auto" : "100vh",
              backgroundColor: "#ffffff",
              borderRight: isMobile ? "none" : "1px solid #f0f0f0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxs2(
                motion.div,
                {
                  className: "product-header",
                  initial: { y: -20, opacity: 0 },
                  animate: { y: 0, opacity: 1 },
                  transition: { delay: 0.2, duration: 0.5 },
                  style: {
                    padding: isMobile ? "24px 20px" : "40px",
                    borderBottom: "1px solid #f0f0f0"
                  },
                  children: [
                    /* @__PURE__ */ jsx3("h1", { style: {
                      margin: 0,
                      fontSize: isMobile ? "24px" : "32px",
                      fontWeight: "600",
                      letterSpacing: "-0.02em",
                      color: "#1d1d1f",
                      lineHeight: 1.2
                    }, children: product.name }),
                    /* @__PURE__ */ jsx3("div", { style: {
                      marginTop: "8px",
                      fontSize: isMobile ? "14px" : "16px",
                      color: "#6e6e73",
                      lineHeight: 1.5
                    }, children: product.description }),
                    /* @__PURE__ */ jsxs2("div", { style: {
                      marginTop: "16px",
                      fontSize: isMobile ? "28px" : "32px",
                      fontWeight: "600",
                      color: "#1d1d1f",
                      letterSpacing: "-0.01em"
                    }, children: [
                      "\xA5",
                      product.price.toLocaleString(),
                      /* @__PURE__ */ jsx3("span", { style: { fontSize: "16px", fontWeight: "400", color: "#86868b", marginLeft: "8px" }, children: "\u7A0E\u8FBC" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs2(
                motion.div,
                {
                  initial: { y: -10, opacity: 0 },
                  animate: { y: 0, opacity: 1 },
                  transition: { delay: 0.3, duration: 0.5 },
                  style: {
                    display: "flex",
                    gap: "8px",
                    padding: isMobile ? "16px 20px" : "20px 40px",
                    borderBottom: "1px solid #f0f0f0",
                    flexWrap: "wrap",
                    overflowX: "auto"
                  },
                  children: [
                    (!isMobile || !selectedObject) && [
                      { id: "item", label: "\u30A2\u30A4\u30C6\u30E0" },
                      { id: "ai", label: "AI" },
                      { id: "images", label: "\u753B\u50CF" },
                      { id: "text", label: "\u30C6\u30AD\u30B9\u30C8" }
                    ].map((tab) => /* @__PURE__ */ jsx3(
                      motion.button,
                      {
                        onClick: () => {
                          setActiveTab(tab.id), isMobile && setIsOverlayOpen(!0);
                        },
                        whileHover: { scale: 1.02 },
                        whileTap: { scale: 0.98 },
                        style: {
                          padding: "10px 20px",
                          borderRadius: "980px",
                          border: activeTab === tab.id ? "1.5px solid #1d1d1f" : "1.5px solid #d2d2d7",
                          backgroundColor: activeTab === tab.id ? "#1d1d1f" : "transparent",
                          color: activeTab === tab.id ? "#ffffff" : "#1d1d1f",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          letterSpacing: "-0.01em",
                          whiteSpace: "nowrap"
                        },
                        children: tab.label
                      },
                      tab.id
                    )),
                    isMobile && selectedObject && /* @__PURE__ */ jsxs2(Fragment, { children: [
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: undo,
                          disabled: !canUndo,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: canUndo ? "#fff" : "#f5f5f7",
                            color: canUndo ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: canUndo ? "pointer" : "not-allowed",
                            whiteSpace: "nowrap"
                          },
                          children: "\u21B6"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: redo,
                          disabled: !canRedo,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.05 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: canRedo ? "#fff" : "#f5f5f7",
                            color: canRedo ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: canRedo ? "pointer" : "not-allowed",
                            whiteSpace: "nowrap"
                          },
                          children: "\u21B7"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: centerVertically,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.1 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: "#fff",
                            color: "#1d1d1f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          },
                          children: "\u4E0A\u4E0B"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: centerHorizontally,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.15 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: "#fff",
                            color: "#1d1d1f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          },
                          children: "\u5DE6\u53F3"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: bringForward,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.2 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: "#fff",
                            color: "#1d1d1f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          },
                          children: "\u624B\u524D"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: sendBackward,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.25 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: "#fff",
                            color: "#1d1d1f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          },
                          children: "\u5965"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: fitToPrintArea,
                          initial: { scale: 0.8, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: { duration: 0.2, delay: 0.3 },
                          style: {
                            padding: "10px 16px",
                            borderRadius: "980px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: "#fff",
                            color: "#1d1d1f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          },
                          children: "\u6700\u5927"
                        }
                      )
                    ] })
                  ]
                }
              ),
              !isMobile && /* @__PURE__ */ jsx3("div", { style: {
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "40px"
              }, children: /* @__PURE__ */ jsxs2(AnimatePresence, { mode: "wait", children: [
                activeTab === "item" && /* @__PURE__ */ jsx3(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 },
                    transition: { duration: 0.3 },
                    children: /* @__PURE__ */ jsx3("p", { style: { margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#6e6e73" }, children: "\u3053\u3061\u3089\u306F\u30C6\u30B9\u30C8\u30C6\u30AD\u30B9\u30C8\u3067\u3059\u3002\u5546\u54C1\u306E\u8A73\u7D30\u60C5\u5831\u3084\u9078\u629E\u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u5C06\u6765\u7684\u306B\u8FFD\u52A0\u4E88\u5B9A\u3067\u3059\u3002" })
                  },
                  "item"
                ),
                activeTab === "ai" && /* @__PURE__ */ jsxs2(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 },
                    transition: { duration: 0.3 },
                    style: { display: "flex", flexDirection: "column", gap: "20px" },
                    children: [
                      /* @__PURE__ */ jsxs2("div", { children: [
                        /* @__PURE__ */ jsx3("label", { style: {
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#1d1d1f",
                          marginBottom: "8px"
                        }, children: "\u30D7\u30ED\u30F3\u30D7\u30C8" }),
                        /* @__PURE__ */ jsx3(
                          "textarea",
                          {
                            value: aiPrompt,
                            onChange: (e) => setAiPrompt(e.target.value),
                            placeholder: "\u4F8B: \u5B87\u5B99\u3092\u98DB\u3076\u732B\u3001\u30B5\u30A4\u30D0\u30FC\u30D1\u30F3\u30AF\u306A\u90FD\u5E02...",
                            rows: 4,
                            disabled: isGenerating,
                            style: {
                              width: "100%",
                              padding: "12px",
                              borderRadius: "12px",
                              border: "1.5px solid #d2d2d7",
                              fontSize: "15px",
                              resize: "vertical",
                              fontFamily: "inherit",
                              boxSizing: "border-box"
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: handleGenerateAI,
                          disabled: isGenerating || !aiPrompt.trim(),
                          whileHover: !isGenerating && aiPrompt.trim() ? { scale: 1.02 } : {},
                          whileTap: !isGenerating && aiPrompt.trim() ? { scale: 0.98 } : {},
                          style: {
                            padding: "14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: isGenerating || !aiPrompt.trim() ? "#d2d2d7" : "#0071e3",
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "500",
                            cursor: isGenerating || !aiPrompt.trim() ? "not-allowed" : "pointer"
                          },
                          children: isGenerating ? "\u23F3 \u751F\u6210\u4E2D..." : "\u2728 AI\u3067\u753B\u50CF\u751F\u6210"
                        }
                      ),
                      lastAIPrompt && /* @__PURE__ */ jsxs2("p", { style: { fontSize: "13px", color: "#6e6e73", margin: 0 }, children: [
                        '\u6700\u5F8C\u306E\u751F\u6210: "',
                        lastAIPrompt,
                        '"'
                      ] })
                    ]
                  },
                  "ai"
                ),
                activeTab === "images" && /* @__PURE__ */ jsxs2(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 },
                    transition: { duration: 0.3 },
                    style: { display: "flex", flexDirection: "column", gap: "20px" },
                    children: [
                      /* @__PURE__ */ jsx3(
                        "input",
                        {
                          ref: fileInputRef,
                          type: "file",
                          accept: "image/*",
                          multiple: !0,
                          onChange: handleImageUpload,
                          style: { display: "none" }
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: handleUploadClick,
                          disabled: isLoading,
                          whileHover: isLoading ? {} : { scale: 1.02 },
                          whileTap: isLoading ? {} : { scale: 0.98 },
                          style: {
                            padding: "14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: isLoading ? "#d2d2d7" : "#0071e3",
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "500",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                          },
                          children: isLoading ? /* @__PURE__ */ jsxs2(Fragment, { children: [
                            /* @__PURE__ */ jsx3(Icon, { type: "loading", size: 18, color: "white" }),
                            " \u8AAD\u307F\u8FBC\u307F\u4E2D..."
                          ] }) : /* @__PURE__ */ jsxs2(Fragment, { children: [
                            /* @__PURE__ */ jsx3(Icon, { type: "upload", size: 18, color: "white" }),
                            " \u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
                          ] })
                        }
                      ),
                      uploadedImages.length > 0 && /* @__PURE__ */ jsxs2("div", { children: [
                        /* @__PURE__ */ jsx3("h3", { style: { fontSize: "15px", fontWeight: "600", marginBottom: "12px" }, children: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6E08\u307F\u753B\u50CF" }),
                        /* @__PURE__ */ jsx3("div", { style: {
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                          gap: "12px"
                        }, children: uploadedImages.map((imgUrl, index) => /* @__PURE__ */ jsx3(
                          "div",
                          {
                            style: {
                              borderRadius: "8px",
                              overflow: "hidden",
                              aspectRatio: "1 / 1",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            },
                            children: /* @__PURE__ */ jsx3(
                              "img",
                              {
                                src: imgUrl,
                                alt: `Uploaded ${index + 1}`,
                                style: {
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }
                              }
                            )
                          },
                          index
                        )) })
                      ] })
                    ]
                  },
                  "images"
                ),
                activeTab === "text" && /* @__PURE__ */ jsxs2(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 },
                    transition: { duration: 0.3 },
                    style: { display: "flex", flexDirection: "column", gap: "20px" },
                    children: [
                      /* @__PURE__ */ jsxs2("div", { children: [
                        /* @__PURE__ */ jsx3("label", { style: {
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#1d1d1f",
                          marginBottom: "8px"
                        }, children: "\u30C6\u30AD\u30B9\u30C8" }),
                        /* @__PURE__ */ jsx3(
                          "input",
                          {
                            type: "text",
                            value: textInput,
                            onChange: (e) => handleTextInputChange(e.target.value),
                            placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
                            style: {
                              width: "100%",
                              padding: "12px",
                              borderRadius: "12px",
                              border: "1.5px solid #d2d2d7",
                              fontSize: "15px",
                              fontFamily: "inherit",
                              boxSizing: "border-box"
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "16px" }, children: [
                        /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                          /* @__PURE__ */ jsx3("label", { style: {
                            display: "block",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#1d1d1f",
                            marginBottom: "8px"
                          }, children: "\u8272" }),
                          /* @__PURE__ */ jsx3(
                            "input",
                            {
                              type: "color",
                              value: textColor,
                              onChange: (e) => handleChangeTextColor(e.target.value),
                              style: {
                                width: "100%",
                                height: "44px",
                                borderRadius: "12px",
                                border: "1.5px solid #d2d2d7",
                                cursor: "pointer"
                              }
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                          /* @__PURE__ */ jsxs2("label", { style: {
                            display: "block",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#1d1d1f",
                            marginBottom: "8px"
                          }, children: [
                            "\u30B5\u30A4\u30BA: ",
                            fontSize,
                            "px"
                          ] }),
                          /* @__PURE__ */ jsx3(
                            "input",
                            {
                              type: "range",
                              min: "10",
                              max: "100",
                              value: fontSize,
                              onChange: (e) => handleChangeFontSize(Number(e.target.value)),
                              style: { width: "100%", height: "44px" }
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: handleAddText,
                          disabled: !textInput.trim(),
                          whileHover: textInput.trim() ? { scale: 1.02 } : {},
                          whileTap: textInput.trim() ? { scale: 0.98 } : {},
                          style: {
                            padding: "14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: textInput.trim() ? "#0071e3" : "#d2d2d7",
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "500",
                            cursor: textInput.trim() ? "pointer" : "not-allowed"
                          },
                          children: "\u30C6\u30AD\u30B9\u30C8\u3092\u8FFD\u52A0"
                        }
                      )
                    ]
                  },
                  "text"
                )
              ] }) }),
              /* @__PURE__ */ jsx3(AnimatePresence, { children: isMobile && isOverlayOpen && /* @__PURE__ */ jsxs2(Fragment, { children: [
                /* @__PURE__ */ jsx3(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.3 },
                    onClick: () => setIsOverlayOpen(!1),
                    style: {
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      zIndex: 1e3
                    }
                  }
                ),
                /* @__PURE__ */ jsxs2(
                  motion.div,
                  {
                    initial: { y: "100%", opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: "100%", opacity: 0 },
                    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                    style: {
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      maxHeight: "80vh",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                      boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
                      zIndex: 1001,
                      overflowY: "auto",
                      padding: "24px"
                    },
                    children: [
                      /* @__PURE__ */ jsx3(
                        "button",
                        {
                          onClick: () => setIsOverlayOpen(!1),
                          style: {
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#1d1d1f"
                          },
                          children: "\xD7"
                        }
                      ),
                      /* @__PURE__ */ jsxs2("div", { style: { marginTop: "20px" }, children: [
                        activeTab === "item" && /* @__PURE__ */ jsx3("div", { children: /* @__PURE__ */ jsx3("p", { style: { margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#6e6e73" }, children: "\u3053\u3061\u3089\u306F\u30C6\u30B9\u30C8\u30C6\u30AD\u30B9\u30C8\u3067\u3059\u3002\u5546\u54C1\u306E\u8A73\u7D30\u60C5\u5831\u3084\u9078\u629E\u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u5C06\u6765\u7684\u306B\u8FFD\u52A0\u4E88\u5B9A\u3067\u3059\u3002" }) }),
                        activeTab === "ai" && /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                          /* @__PURE__ */ jsxs2("div", { children: [
                            /* @__PURE__ */ jsx3("label", { style: {
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#1d1d1f",
                              marginBottom: "8px"
                            }, children: "\u30D7\u30ED\u30F3\u30D7\u30C8" }),
                            /* @__PURE__ */ jsx3(
                              "textarea",
                              {
                                value: aiPrompt,
                                onChange: (e) => setAiPrompt(e.target.value),
                                placeholder: "\u4F8B: \u5B87\u5B99\u3092\u98DB\u3076\u732B\u3001\u30B5\u30A4\u30D0\u30FC\u30D1\u30F3\u30AF\u306A\u90FD\u5E02...",
                                rows: 4,
                                disabled: isGenerating,
                                style: {
                                  width: "100%",
                                  padding: "12px",
                                  borderRadius: "12px",
                                  border: "1.5px solid #d2d2d7",
                                  fontSize: "15px",
                                  resize: "vertical",
                                  fontFamily: "inherit",
                                  boxSizing: "border-box"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx3(
                            "button",
                            {
                              onClick: () => {
                                handleGenerateAI(), setIsOverlayOpen(!1);
                              },
                              disabled: isGenerating || !aiPrompt.trim(),
                              style: {
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: isGenerating || !aiPrompt.trim() ? "#d2d2d7" : "#0071e3",
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "500",
                                cursor: isGenerating || !aiPrompt.trim() ? "not-allowed" : "pointer"
                              },
                              children: isGenerating ? "\u23F3 \u751F\u6210\u4E2D..." : "\u2728 AI\u3067\u753B\u50CF\u751F\u6210"
                            }
                          )
                        ] }),
                        activeTab === "images" && /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                          /* @__PURE__ */ jsx3(
                            "button",
                            {
                              onClick: () => {
                                handleUploadClick(), setIsOverlayOpen(!1);
                              },
                              disabled: isLoading,
                              style: {
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: isLoading ? "#d2d2d7" : "#0071e3",
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "500",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px"
                              },
                              children: isLoading ? /* @__PURE__ */ jsxs2(Fragment, { children: [
                                /* @__PURE__ */ jsx3(Icon, { type: "loading", size: 18, color: "white" }),
                                " \u8AAD\u307F\u8FBC\u307F\u4E2D..."
                              ] }) : /* @__PURE__ */ jsxs2(Fragment, { children: [
                                /* @__PURE__ */ jsx3(Icon, { type: "upload", size: 18, color: "white" }),
                                " \u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
                              ] })
                            }
                          ),
                          uploadedImages.length > 0 && /* @__PURE__ */ jsxs2("div", { children: [
                            /* @__PURE__ */ jsx3("h3", { style: { fontSize: "15px", fontWeight: "600", marginBottom: "12px" }, children: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6E08\u307F\u753B\u50CF" }),
                            /* @__PURE__ */ jsx3("div", { style: {
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                              gap: "12px"
                            }, children: uploadedImages.map((imgUrl, index) => /* @__PURE__ */ jsx3(
                              "div",
                              {
                                style: {
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  aspectRatio: "1 / 1",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                },
                                children: /* @__PURE__ */ jsx3(
                                  "img",
                                  {
                                    src: imgUrl,
                                    alt: `Uploaded ${index + 1}`,
                                    style: {
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover"
                                    }
                                  }
                                )
                              },
                              index
                            )) })
                          ] })
                        ] }),
                        activeTab === "text" && /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                          /* @__PURE__ */ jsxs2("div", { children: [
                            /* @__PURE__ */ jsx3("label", { style: {
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#1d1d1f",
                              marginBottom: "8px"
                            }, children: "\u30C6\u30AD\u30B9\u30C8" }),
                            /* @__PURE__ */ jsx3(
                              "input",
                              {
                                type: "text",
                                value: textInput,
                                onChange: (e) => handleTextInputChange(e.target.value),
                                placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
                                style: {
                                  width: "100%",
                                  padding: "12px",
                                  borderRadius: "12px",
                                  border: "1.5px solid #d2d2d7",
                                  fontSize: "15px",
                                  fontFamily: "inherit",
                                  boxSizing: "border-box"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "16px" }, children: [
                            /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                              /* @__PURE__ */ jsx3("label", { style: {
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#1d1d1f",
                                marginBottom: "8px"
                              }, children: "\u8272" }),
                              /* @__PURE__ */ jsx3(
                                "input",
                                {
                                  type: "color",
                                  value: textColor,
                                  onChange: (e) => handleChangeTextColor(e.target.value),
                                  style: {
                                    width: "100%",
                                    height: "44px",
                                    borderRadius: "12px",
                                    border: "1.5px solid #d2d2d7",
                                    cursor: "pointer"
                                  }
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                              /* @__PURE__ */ jsxs2("label", { style: {
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#1d1d1f",
                                marginBottom: "8px"
                              }, children: [
                                "\u30B5\u30A4\u30BA: ",
                                fontSize,
                                "px"
                              ] }),
                              /* @__PURE__ */ jsx3(
                                "input",
                                {
                                  type: "range",
                                  min: "10",
                                  max: "100",
                                  value: fontSize,
                                  onChange: (e) => handleChangeFontSize(Number(e.target.value)),
                                  style: { width: "100%", height: "44px" }
                                }
                              )
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx3(
                            "button",
                            {
                              onClick: () => {
                                handleAddText(), setIsOverlayOpen(!1);
                              },
                              disabled: !textInput.trim(),
                              style: {
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: textInput.trim() ? "#0071e3" : "#d2d2d7",
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "500",
                                cursor: textInput.trim() ? "pointer" : "not-allowed"
                              },
                              children: "\u30C6\u30AD\u30B9\u30C8\u3092\u8FFD\u52A0"
                            }
                          )
                        ] })
                      ] })
                    ]
                  }
                )
              ] }) }),
              !isMobile && /* @__PURE__ */ jsxs2(
                motion.div,
                {
                  style: {
                    padding: "40px",
                    borderTop: "1px solid #f0f0f0"
                  },
                  children: [
                    /* @__PURE__ */ jsx3("h3", { style: {
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#1d1d1f",
                      marginBottom: "16px"
                    }, children: "\u7DE8\u96C6\u30C4\u30FC\u30EB" }),
                    /* @__PURE__ */ jsxs2("div", { style: {
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "12px"
                    }, children: [
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: undo,
                          disabled: !canUndo,
                          whileHover: canUndo ? { scale: 1.05 } : {},
                          whileTap: canUndo ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: canUndo ? "#fff" : "#f5f5f7",
                            color: canUndo ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: canUndo ? "pointer" : "not-allowed"
                          },
                          children: "\u21B6 \u5143\u306B\u623B\u3059"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: redo,
                          disabled: !canRedo,
                          whileHover: canRedo ? { scale: 1.05 } : {},
                          whileTap: canRedo ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: canRedo ? "#fff" : "#f5f5f7",
                            color: canRedo ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: canRedo ? "pointer" : "not-allowed"
                          },
                          children: "\u21B7 \u3084\u308A\u76F4\u3057"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: centerVertically,
                          disabled: !selectedObject,
                          whileHover: selectedObject ? { scale: 1.05 } : {},
                          whileTap: selectedObject ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: selectedObject ? "#fff" : "#f5f5f7",
                            color: selectedObject ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: selectedObject ? "pointer" : "not-allowed"
                          },
                          children: "\u4E0A\u4E0B\u4E2D\u592E"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: centerHorizontally,
                          disabled: !selectedObject,
                          whileHover: selectedObject ? { scale: 1.05 } : {},
                          whileTap: selectedObject ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: selectedObject ? "#fff" : "#f5f5f7",
                            color: selectedObject ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: selectedObject ? "pointer" : "not-allowed"
                          },
                          children: "\u5DE6\u53F3\u4E2D\u592E"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: bringForward,
                          disabled: !selectedObject,
                          whileHover: selectedObject ? { scale: 1.05 } : {},
                          whileTap: selectedObject ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: selectedObject ? "#fff" : "#f5f5f7",
                            color: selectedObject ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: selectedObject ? "pointer" : "not-allowed"
                          },
                          children: "\u624B\u524D\u3078"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: sendBackward,
                          disabled: !selectedObject,
                          whileHover: selectedObject ? { scale: 1.05 } : {},
                          whileTap: selectedObject ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: selectedObject ? "#fff" : "#f5f5f7",
                            color: selectedObject ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: selectedObject ? "pointer" : "not-allowed"
                          },
                          children: "\u5965\u3078"
                        }
                      ),
                      /* @__PURE__ */ jsx3(
                        motion.button,
                        {
                          onClick: fitToPrintArea,
                          disabled: !selectedObject,
                          whileHover: selectedObject ? { scale: 1.05 } : {},
                          whileTap: selectedObject ? { scale: 0.95 } : {},
                          style: {
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1.5px solid #d2d2d7",
                            backgroundColor: selectedObject ? "#fff" : "#f5f5f7",
                            color: selectedObject ? "#1d1d1f" : "#86868b",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: selectedObject ? "pointer" : "not-allowed",
                            gridColumn: "1 / -1"
                          },
                          children: "\u30D7\u30EA\u30F3\u30C8\u7BC4\u56F2\u6700\u5927"
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx3(
                motion.div,
                {
                  style: {
                    padding: isMobile ? "20px" : "40px",
                    borderTop: "1px solid #f0f0f0"
                  },
                  children: /* @__PURE__ */ jsx3(
                    motion.button,
                    {
                      onClick: () => setIsModalOpen(!0),
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      style: {
                        width: "100%",
                        padding: "16px 24px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#0071e3",
                        color: "#ffffff",
                        fontSize: "17px",
                        fontWeight: "500",
                        cursor: "pointer",
                        letterSpacing: "-0.01em"
                      },
                      children: "\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0"
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          motion.div,
          {
            initial: { x: 20, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { delay: 0.4, duration: 0.6 },
            style: {
              width: isMobile ? "100%" : "60%",
              height: isMobile ? "60vh" : "100vh",
              backgroundColor: "#f5f5f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: isMobile ? "20px" : "40px"
            },
            children: [
              /* @__PURE__ */ jsx3(
                "div",
                {
                  className: "canvas-container",
                  style: {
                    width: "100%",
                    maxWidth: "min(800px, 100%)",
                    aspectRatio: isMobile ? "3 / 4" : "1 / 1",
                    position: "relative"
                  },
                  children: /* @__PURE__ */ jsxs2("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: isMobile ? "10px" : "40px",
                    width: "100%",
                    boxSizing: "border-box"
                  }, children: [
                    /* @__PURE__ */ jsxs2(
                      "div",
                      {
                        style: {
                          border: "none",
                          borderRadius: "0",
                          overflow: "hidden",
                          boxShadow: "none",
                          backgroundColor: "#fafafa",
                          width: "100%",
                          maxWidth: isMobile ? "100vw" : "min(800px, 100%)",
                          margin: "0 auto",
                          position: "relative",
                          aspectRatio: "1 / 1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          touchAction: isMobile ? "pan-y" : "auto"
                        },
                        children: [
                          /* @__PURE__ */ jsx3(
                            "button",
                            {
                              onClick: () => {
                                if (!fabricCanvasRef.current)
                                  return;
                                let canvas = fabricCanvasRef.current;
                                if (isZoomed)
                                  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]), setIsZoomed(!1);
                                else {
                                  let printArea = getPrintAreaInPixels(CANVAS_SIZE), centerX = printArea.left + printArea.width / 2, centerY = printArea.top + printArea.height / 2, zoom = isMobile ? 2 : 1.7, point = new window.fabric.Point(centerX, centerY);
                                  canvas.zoomToPoint(point, zoom), setIsZoomed(!0);
                                }
                                canvas.renderAll();
                              },
                              style: {
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: "none",
                                backgroundColor: "white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                                transition: "all 0.2s ease"
                              },
                              onMouseEnter: (e) => {
                                e.currentTarget.style.transform = "scale(1.1)", e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.transform = "scale(1)", e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                              },
                              title: isZoomed ? "\u5143\u306E\u30B5\u30A4\u30BA\u306B\u623B\u3059" : "\u30D7\u30EA\u30F3\u30C8\u30A8\u30EA\u30A2\u3092\u62E1\u5927",
                              children: /* @__PURE__ */ jsx3(Icon, { type: isZoomed ? "zoomIn" : "zoomOut", size: 20, color: "#667eea" })
                            }
                          ),
                          /* @__PURE__ */ jsx3(
                            "canvas",
                            {
                              ref: canvasRef,
                              style: {
                                display: "block",
                                width: "100%",
                                height: "100%",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain"
                              }
                            }
                          ),
                          showTrash && /* @__PURE__ */ jsxs2(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                bottom: isMobile ? "30px" : "40px",
                                left: "50%",
                                transform: `translateX(-50%) scale(${isOverTrash ? 1.15 : 1})`,
                                width: isMobile ? "70px" : "80px",
                                height: isMobile ? "70px" : "80px",
                                borderRadius: "50%",
                                backgroundColor: isOverTrash ? "#ff4444" : "#666",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: isOverTrash ? "0 6px 20px rgba(255,68,68,0.5)" : "0 4px 12px rgba(0,0,0,0.3)",
                                transition: "all 0.2s ease",
                                zIndex: 15,
                                animation: "trashBounce 0.3s ease"
                              },
                              children: [
                                /* @__PURE__ */ jsx3(Icon, { type: "trash", size: isMobile ? 32 : 36, color: "white" }),
                                /* @__PURE__ */ jsx3("style", { children: `
                    @keyframes trashBounce {
                      0% {
                        transform: translateX(-50%) scale(0.8);
                        opacity: 0;
                      }
                      50% {
                        transform: translateX(-50%) scale(1.1);
                      }
                      100% {
                        transform: translateX(-50%) scale(1);
                        opacity: 1;
                      }
                    }
                  ` })
                              ]
                            }
                          ),
                          (snapGuides.vertical !== null || snapGuides.horizontal !== null) && /* @__PURE__ */ jsxs2(
                            "svg",
                            {
                              style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                                zIndex: 5
                              },
                              children: [
                                snapGuides.vertical !== null && /* @__PURE__ */ jsx3(
                                  "line",
                                  {
                                    x1: `${snapGuides.vertical / CANVAS_SIZE * 100}%`,
                                    y1: "0",
                                    x2: `${snapGuides.vertical / CANVAS_SIZE * 100}%`,
                                    y2: "100%",
                                    stroke: "#ff00ff",
                                    strokeWidth: "1",
                                    strokeDasharray: "5,5",
                                    opacity: "0.8"
                                  }
                                ),
                                snapGuides.horizontal !== null && /* @__PURE__ */ jsx3(
                                  "line",
                                  {
                                    x1: "0",
                                    y1: `${snapGuides.horizontal / CANVAS_SIZE * 100}%`,
                                    x2: "100%",
                                    y2: `${snapGuides.horizontal / CANVAS_SIZE * 100}%`,
                                    stroke: "#ff00ff",
                                    strokeWidth: "1",
                                    strokeDasharray: "5,5",
                                    opacity: "0.8"
                                  }
                                )
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs2("div", { style: {
                      marginTop: "15px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: isMobile ? "8px" : "10px",
                      justifyContent: "center",
                      width: "100%",
                      maxWidth: isMobile ? "100%" : "800px"
                    }, children: [
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleUndo,
                          disabled: !canUndo,
                          style: {
                            ...historyButtonStyle(canUndo),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u5143\u306B\u623B\u3059 (Cmd/Ctrl+Z)",
                          children: [
                            /* @__PURE__ */ jsxs2("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx3("path", { d: "M3 7v6h6" }),
                              /* @__PURE__ */ jsx3("path", { d: "M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" })
                            ] }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u5143\u306B\u623B\u3059" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleRedo,
                          disabled: !canRedo,
                          style: {
                            ...historyButtonStyle(canRedo),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u3084\u308A\u76F4\u3057 (Cmd/Ctrl+Shift+Z)",
                          children: [
                            /* @__PURE__ */ jsxs2("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx3("path", { d: "M21 7v6h-6" }),
                              /* @__PURE__ */ jsx3("path", { d: "M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" })
                            ] }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u3084\u308A\u76F4\u3057" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleCenterVertical,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u4E0A\u4E0B\u4E2D\u592E",
                          children: [
                            /* @__PURE__ */ jsx3("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx3("path", { d: "M12 5v14M5 12l7-7 7 7M5 12l7 7 7-7" }) }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u4E0A\u4E0B\u4E2D\u592E" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleCenterHorizontal,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u5DE6\u53F3\u4E2D\u592E",
                          children: [
                            /* @__PURE__ */ jsx3("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx3("path", { d: "M5 12h14M12 5l-7 7 7 7M12 5l7 7-7 7" }) }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u5DE6\u53F3\u4E2D\u592E" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleBringForward,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u624B\u524D\u306B\u79FB\u52D5",
                          children: [
                            /* @__PURE__ */ jsxs2("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx3("rect", { x: "9", y: "13", width: "10", height: "10", rx: "2", ry: "2", opacity: "0.5" }),
                              /* @__PURE__ */ jsx3("rect", { x: "5", y: "1", width: "10", height: "10", rx: "2", ry: "2" })
                            ] }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u624B\u524D\u3078" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleSendBackwards,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u5965\u306B\u79FB\u52D5",
                          children: [
                            /* @__PURE__ */ jsxs2("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx3("rect", { x: "5", y: "1", width: "10", height: "10", rx: "2", ry: "2", opacity: "0.5" }),
                              /* @__PURE__ */ jsx3("rect", { x: "9", y: "13", width: "10", height: "10", rx: "2", ry: "2" })
                            ] }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u5965\u3078" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleFitToPrintArea,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px"
                          },
                          title: "\u5370\u5237\u9762\u3092\u8986\u3046",
                          children: [
                            /* @__PURE__ */ jsx3("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx3("path", { d: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" }) }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u30D7\u30EA\u30F3\u30C8\u7BC4\u56F2\u6700\u5927" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onClick: handleRemoveSelected,
                          disabled: !selectedObject,
                          style: {
                            ...historyButtonStyle(!!selectedObject),
                            padding: isMobile ? "8px 10px" : "10px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: isMobile ? "60px" : "70px",
                            backgroundColor: selectedObject ? "#e74c3c" : "#cccccc"
                          },
                          title: "\u524A\u9664 (Delete/Backspace)",
                          children: [
                            /* @__PURE__ */ jsxs2("svg", { width: isMobile ? "18" : "20", height: isMobile ? "18" : "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx3("polyline", { points: "3 6 5 6 21 6" }),
                              /* @__PURE__ */ jsx3("path", { d: "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" }),
                              /* @__PURE__ */ jsx3("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
                              /* @__PURE__ */ jsx3("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
                            ] }),
                            /* @__PURE__ */ jsx3("span", { style: { fontSize: isMobile ? "9px" : "10px" }, children: "\u524A\u9664" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs2("div", { style: {
                      ...infoBoxStyle,
                      width: "100%",
                      maxWidth: isMobile ? "100%" : "800px",
                      backgroundColor: "#ffffff",
                      marginTop: isMobile ? "15px" : "20px",
                      padding: isMobile ? "15px" : "20px"
                    }, children: [
                      /* @__PURE__ */ jsx3("h3", { style: {
                        marginTop: 0,
                        fontSize: isMobile ? "14px" : "16px"
                      }, children: "\u{1F4DD} \u4F7F\u3044\u65B9" }),
                      /* @__PURE__ */ jsxs2("ul", { style: {
                        marginBottom: 0,
                        lineHeight: 1.6,
                        paddingLeft: isMobile ? "18px" : "20px",
                        fontSize: isMobile ? "12px" : "13px"
                      }, children: [
                        /* @__PURE__ */ jsx3("li", { children: "\u{1F916} AI\u306B\u753B\u50CF\u3092\u751F\u6210\u3055\u305B\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059" }),
                        /* @__PURE__ */ jsx3("li", { children: "\u{1F4F7} \u753B\u50CF\u3092\u8907\u6570\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u91CD\u306D\u5408\u308F\u305B\u3067\u304D\u307E\u3059" }),
                        /* @__PURE__ */ jsx3("li", { children: "\u270F\uFE0F \u30C6\u30AD\u30B9\u30C8\u3092\u8FFD\u52A0\u3057\u3066\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA\u3067\u304D\u307E\u3059" }),
                        /* @__PURE__ */ jsx3("li", { children: "\u{1F3A8} \u753B\u50CF\u306B\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9069\u7528\u3067\u304D\u307E\u3059" }),
                        /* @__PURE__ */ jsx3("li", { children: "\u{1F6D2} \u5B8C\u6210\u3057\u305F\u3089Shopify\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u3067\u304D\u307E\u3059" })
                      ] })
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx3("div", { style: {
                display: isMobile ? "block" : "none",
                width: "100%",
                backgroundColor: "#ffffff",
                overflowY: "auto",
                overflowX: "hidden"
              }, children: /* @__PURE__ */ jsxs2("div", { style: {
                ...panelStyle,
                padding: isMobile ? "25px 20px" : "40px 30px",
                wordWrap: "break-word",
                overflowWrap: "break-word"
              }, children: [
                /* @__PURE__ */ jsx3("h2", { style: {
                  marginTop: 0,
                  color: "#1a1a1a",
                  marginBottom: isMobile ? "20px" : "30px",
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "400",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }, children: "\u5546\u54C1\u8A73\u7D30" }),
                /* @__PURE__ */ jsx3("div", { style: sectionStyle, children: /* @__PURE__ */ jsxs2("div", { style: {
                  padding: "0",
                  backgroundColor: "transparent",
                  borderRadius: "0",
                  marginBottom: "20px"
                }, children: [
                  /* @__PURE__ */ jsx3("h3", { style: { ...sectionTitleStyle, marginTop: 0 }, children: "\u5546\u54C1\u8AAC\u660E" }),
                  /* @__PURE__ */ jsx3("p", { style: {
                    fontSize: "13px",
                    color: "#666",
                    lineHeight: "1.8",
                    margin: 0,
                    letterSpacing: "0.02em"
                  }, children: product.description })
                ] }) }),
                /* @__PURE__ */ jsxs2("div", { style: sectionStyle, children: [
                  /* @__PURE__ */ jsx3("h3", { style: sectionTitleStyle, children: "\u672C\u4F53\u30AB\u30E9\u30FC" }),
                  /* @__PURE__ */ jsx3("div", { style: { display: "flex", gap: "10px", marginBottom: "20px" }, children: product.colors.map((color) => /* @__PURE__ */ jsxs2(
                    "button",
                    {
                      onClick: () => setSelectedColor(color),
                      style: {
                        flex: 1,
                        padding: "14px 10px",
                        border: selectedColor.name === color.name ? "1px solid #1a1a1a" : "1px solid #d0d0d0",
                        borderRadius: "0",
                        backgroundColor: selectedColor.name === color.name ? "#f5f5f5" : "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px"
                      },
                      onMouseEnter: (e) => {
                        selectedColor.name !== color.name && (e.currentTarget.style.borderColor = "#888");
                      },
                      onMouseLeave: (e) => {
                        selectedColor.name !== color.name && (e.currentTarget.style.borderColor = "#d0d0d0");
                      },
                      children: [
                        /* @__PURE__ */ jsx3(
                          "div",
                          {
                            style: {
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: color.hex,
                              border: color.hex === "#FFFFFF" || color.hex === "#F5F5DC" ? "2px solid #e0e0e0" : "none",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx3("span", { style: {
                          fontSize: "12px",
                          fontWeight: selectedColor.name === color.name ? "bold" : "normal",
                          color: selectedColor.name === color.name ? "#667eea" : "#666"
                        }, children: color.name })
                      ]
                    },
                    color.name
                  )) })
                ] }),
                /* @__PURE__ */ jsxs2("div", { style: sectionStyle, children: [
                  /* @__PURE__ */ jsx3("h3", { style: sectionTitleStyle, children: "\u30B5\u30A4\u30BA" }),
                  /* @__PURE__ */ jsx3("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "8px",
                    marginBottom: "20px"
                  }, children: sizes.map((size) => /* @__PURE__ */ jsx3(
                    "button",
                    {
                      onClick: () => setSelectedSize(size),
                      style: {
                        padding: "14px 8px",
                        border: selectedSize === size ? "1px solid #1a1a1a" : "1px solid #d0d0d0",
                        borderRadius: "0",
                        backgroundColor: selectedSize === size ? "#1a1a1a" : "white",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "400",
                        letterSpacing: "0.05em",
                        color: selectedSize === size ? "white" : "#666",
                        transition: "all 0.3s ease"
                      },
                      onMouseEnter: (e) => {
                        selectedSize !== size && (e.currentTarget.style.backgroundColor = "#fafafa", e.currentTarget.style.borderColor = "#888");
                      },
                      onMouseLeave: (e) => {
                        selectedSize !== size && (e.currentTarget.style.backgroundColor = "white", e.currentTarget.style.borderColor = "#d0d0d0");
                      },
                      children: size
                    },
                    size
                  )) })
                ] }),
                /* @__PURE__ */ jsx3("hr", { style: dividerStyle }),
                /* @__PURE__ */ jsx3(
                  "button",
                  {
                    onClick: openCartModal,
                    disabled: isAddingToCart,
                    style: {
                      ...buttonStyle("#5c6ac4", !isAddingToCart),
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: "bold",
                      padding: isMobile ? "14px" : "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "24px"
                    },
                    children: isAddingToCart ? /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }, children: [
                      /* @__PURE__ */ jsxs2("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                        /* @__PURE__ */ jsx3(Icon, { type: "loading", size: 20, color: "white" }),
                        "\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0\u4E2D..."
                      ] }),
                      /* @__PURE__ */ jsx3("span", { style: { fontSize: "13px" }, children: "\uFF08\u5C11\u3057\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\uFF09" })
                    ] }) : /* @__PURE__ */ jsxs2(Fragment, { children: [
                      /* @__PURE__ */ jsx3(Icon, { type: "cart", size: 20, color: "white" }),
                      " \u30AB\u30FC\u30C8\u306B\u8FFD\u52A0"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx3("hr", { style: dividerStyle }),
                /* @__PURE__ */ jsx3("h2", { style: { marginTop: 0, color: "#333" }, children: "\u30C7\u30B6\u30A4\u30F3\u7DE8\u96C6" }),
                /* @__PURE__ */ jsxs2("div", { style: sectionStyle, children: [
                  /* @__PURE__ */ jsx3("h3", { style: sectionTitleStyle, children: "\u{1F4F7} \u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9" }),
                  /* @__PURE__ */ jsx3(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/*",
                      multiple: !0,
                      onChange: handleImageUpload,
                      style: { display: "none" }
                    }
                  ),
                  /* @__PURE__ */ jsx3(
                    "button",
                    {
                      onClick: handleUploadClick,
                      disabled: isLoading,
                      style: {
                        ...buttonStyle("#3498db", !isLoading),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      },
                      children: isLoading ? /* @__PURE__ */ jsxs2(Fragment, { children: [
                        /* @__PURE__ */ jsx3(Icon, { type: "loading", size: 18, color: "white" }),
                        " \u8AAD\u307F\u8FBC\u307F\u4E2D..."
                      ] }) : /* @__PURE__ */ jsxs2(Fragment, { children: [
                        /* @__PURE__ */ jsx3(Icon, { type: "upload", size: 18, color: "white" }),
                        " \u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx3("hr", { style: dividerStyle }),
                /* @__PURE__ */ jsxs2("div", { style: sectionStyle, children: [
                  /* @__PURE__ */ jsx3("h3", { style: sectionTitleStyle, children: "\u{1F916} AI\u753B\u50CF\u751F\u6210" }),
                  /* @__PURE__ */ jsx3(
                    "textarea",
                    {
                      value: aiPrompt,
                      onChange: (e) => setAiPrompt(e.target.value),
                      placeholder: "\u4F8B: \u5B87\u5B99\u3092\u98DB\u3076\u732B\u3001\u30B5\u30A4\u30D0\u30FC\u30D1\u30F3\u30AF\u306A\u90FD\u5E02\u3001\u30AB\u30E9\u30D5\u30EB\u306A\u62BD\u8C61\u753B...",
                      rows: 3,
                      style: textareaStyle,
                      disabled: isGenerating
                    }
                  ),
                  /* @__PURE__ */ jsx3(
                    "button",
                    {
                      onClick: handleGenerateAI,
                      disabled: isGenerating,
                      style: primaryButtonStyle(isGenerating),
                      children: isGenerating ? "\u23F3 \u751F\u6210\u4E2D..." : "\u2728 AI\u3067\u753B\u50CF\u751F\u6210"
                    }
                  ),
                  lastAIPrompt && /* @__PURE__ */ jsxs2("p", { style: { fontSize: "12px", color: "#666", marginTop: "10px" }, children: [
                    '\u6700\u5F8C\u306E\u751F\u6210: "',
                    lastAIPrompt,
                    '"'
                  ] })
                ] }),
                /* @__PURE__ */ jsx3("hr", { style: dividerStyle }),
                /* @__PURE__ */ jsxs2("div", { style: sectionStyle, children: [
                  /* @__PURE__ */ jsx3("h3", { style: sectionTitleStyle, children: "\u270F\uFE0F \u30C6\u30AD\u30B9\u30C8\u8FFD\u52A0" }),
                  /* @__PURE__ */ jsx3(
                    "input",
                    {
                      type: "text",
                      value: textInput,
                      onChange: (e) => handleTextInputChange(e.target.value),
                      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
                      style: inputStyle
                    }
                  ),
                  /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "10px", marginBottom: "10px" }, children: [
                    /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                      /* @__PURE__ */ jsx3("label", { style: labelStyle, children: "\u8272" }),
                      /* @__PURE__ */ jsx3(
                        "input",
                        {
                          type: "color",
                          value: textColor,
                          onChange: (e) => handleChangeTextColor(e.target.value),
                          style: colorInputStyle
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs2("div", { style: { flex: 1 }, children: [
                      /* @__PURE__ */ jsxs2("label", { style: labelStyle, children: [
                        "\u30B5\u30A4\u30BA: ",
                        fontSize,
                        "px"
                      ] }),
                      /* @__PURE__ */ jsx3(
                        "input",
                        {
                          type: "range",
                          min: "10",
                          max: "100",
                          value: fontSize,
                          onChange: (e) => handleChangeFontSize(Number(e.target.value)),
                          style: { width: "100%" }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx3("label", { style: {
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "8px",
                    display: "block"
                  }, children: "\u30D5\u30A9\u30F3\u30C8\u306E\u9078\u629E" }),
                  /* @__PURE__ */ jsxs2("div", { ref: fontDropdownRef, style: { position: "relative", width: "100%" }, children: [
                    /* @__PURE__ */ jsxs2(
                      "div",
                      {
                        onClick: () => setIsFontDropdownOpen(!isFontDropdownOpen),
                        style: {
                          ...selectStyle,
                          cursor: "pointer",
                          fontFamily: FONT_LIST.find((f) => f.value === fontFamily)?.family || fontFamily,
                          fontSize: isMobile ? "14px" : "16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsx3("span", { children: FONT_LIST.find((f) => f.value === fontFamily)?.label || fontFamily }),
                          /* @__PURE__ */ jsx3("span", { style: { fontSize: "12px" }, children: isFontDropdownOpen ? "\u25B2" : "\u25BC" })
                        ]
                      }
                    ),
                    isFontDropdownOpen && /* @__PURE__ */ jsxs2("div", { style: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      border: "2px solid #4c51bf",
                      borderRadius: "8px",
                      maxHeight: "350px",
                      overflowY: "auto",
                      zIndex: 1e3,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      marginTop: "4px"
                    }, children: [
                      /* @__PURE__ */ jsxs2("div", { style: {
                        display: "flex",
                        borderBottom: "2px solid #e2e8f0",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                        zIndex: 1001
                      }, children: [
                        /* @__PURE__ */ jsx3(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation(), setActiveFontTab("japanese");
                            },
                            style: {
                              flex: 1,
                              padding: "12px",
                              border: "none",
                              backgroundColor: activeFontTab === "japanese" ? "#4c51bf" : "transparent",
                              color: activeFontTab === "japanese" ? "white" : "#4a5568",
                              fontWeight: activeFontTab === "japanese" ? "bold" : "normal",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              fontSize: isMobile ? "14px" : "16px"
                            },
                            children: "\u65E5\u672C\u8A9E"
                          }
                        ),
                        /* @__PURE__ */ jsx3(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation(), setActiveFontTab("english");
                            },
                            style: {
                              flex: 1,
                              padding: "12px",
                              border: "none",
                              backgroundColor: activeFontTab === "english" ? "#4c51bf" : "transparent",
                              color: activeFontTab === "english" ? "white" : "#4a5568",
                              fontWeight: activeFontTab === "english" ? "bold" : "normal",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              fontSize: isMobile ? "14px" : "16px"
                            },
                            children: "English"
                          }
                        )
                      ] }),
                      getFilteredFonts().map((font) => /* @__PURE__ */ jsx3(
                        "div",
                        {
                          onClick: () => {
                            handleChangeFontFamily(font.value), setIsFontDropdownOpen(!1);
                          },
                          style: {
                            padding: isMobile ? "10px 12px" : "12px 16px",
                            cursor: "pointer",
                            fontFamily: font.family,
                            fontSize: isMobile ? "14px" : "16px",
                            borderBottom: "1px solid #eee",
                            backgroundColor: fontFamily === font.value ? "#f0f0ff" : "transparent",
                            transition: "background-color 0.2s"
                          },
                          onMouseEnter: (e) => {
                            fontFamily !== font.value && (e.currentTarget.style.backgroundColor = "#f9f9f9");
                          },
                          onMouseLeave: (e) => {
                            fontFamily !== font.value && (e.currentTarget.style.backgroundColor = "transparent");
                          },
                          children: font.label
                        },
                        font.value
                      ))
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx3("hr", { style: dividerStyle }),
                /* @__PURE__ */ jsxs2(
                  "button",
                  {
                    onClick: handleClearCanvas,
                    style: {
                      ...buttonStyle("#ff8c42", !0),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    },
                    children: [
                      /* @__PURE__ */ jsx3(Icon, { type: "refresh", size: 18, color: "white" }),
                      " \u3059\u3079\u3066\u30AF\u30EA\u30A2"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs2(
                  "button",
                  {
                    onClick: handleSaveDesign,
                    style: {
                      ...buttonStyle("#00b894", !0),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    },
                    children: [
                      /* @__PURE__ */ jsx3(Icon, { type: "save", size: 18, color: "white" }),
                      " \u753B\u50CF\u3068\u3057\u3066\u4FDD\u5B58"
                    ]
                  }
                )
              ] }) })
            ]
          }
        ),
        showCopyrightModal && /* @__PURE__ */ jsx3("div", { style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1e4,
          padding: "20px"
        }, children: /* @__PURE__ */ jsxs2("div", { style: {
          backgroundColor: "white",
          borderRadius: "16px",
          padding: isMobile ? "24px" : "40px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
        }, children: [
          /* @__PURE__ */ jsxs2("h2", { style: {
            fontSize: isMobile ? "20px" : "24px",
            marginBottom: "20px",
            color: "#333",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }, children: [
            /* @__PURE__ */ jsx3(Icon, { type: "clipboard", size: 24, color: "#333" }),
            " \u753B\u50CF\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u524D\u306E\u3054\u78BA\u8A8D"
          ] }),
          /* @__PURE__ */ jsxs2("div", { style: {
            marginBottom: "24px",
            fontSize: isMobile ? "14px" : "15px",
            lineHeight: "1.8",
            color: "#555"
          }, children: [
            /* @__PURE__ */ jsxs2("h3", { style: { fontSize: isMobile ? "16px" : "18px", marginBottom: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ jsx3(Icon, { type: "check", size: 18, color: "#28a745" }),
              " \u63A8\u5968\u753B\u50CF\u30B5\u30A4\u30BA"
            ] }),
            /* @__PURE__ */ jsxs2("p", { style: { marginBottom: "16px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }, children: [
              /* @__PURE__ */ jsx3("strong", { children: "300 DPI\u4EE5\u4E0A" }),
              "\u306E\u9AD8\u89E3\u50CF\u5EA6\u753B\u50CF\u3092\u63A8\u5968\u3057\u307E\u3059\u3002",
              /* @__PURE__ */ jsx3("br", {}),
              "\u30D7\u30EA\u30F3\u30C8\u7BC4\u56F2: 250mm \xD7 312mm"
            ] }),
            /* @__PURE__ */ jsxs2("h3", { style: { fontSize: isMobile ? "16px" : "18px", marginBottom: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ jsx3(Icon, { type: "warning", size: 18, color: "#ffc107" }),
              " \u8457\u4F5C\u6A29\u30FB\u5229\u7528\u898F\u7D04"
            ] }),
            /* @__PURE__ */ jsxs2("ul", { style: { paddingLeft: "20px", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsxs2("li", { style: { marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsx3("strong", { children: "\u7B2C\u4E09\u8005\u306E\u8457\u4F5C\u6A29\u3092\u4FB5\u5BB3\u3059\u308B\u753B\u50CF" }),
                "\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044"
              ] }),
              /* @__PURE__ */ jsxs2("li", { style: { marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsx3("strong", { children: "\u8096\u50CF\u6A29" }),
                "\u3084",
                /* @__PURE__ */ jsx3("strong", { children: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u6A29" }),
                "\u3092\u4FB5\u5BB3\u3059\u308B\u753B\u50CF\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093"
              ] }),
              /* @__PURE__ */ jsxs2("li", { style: { marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsx3("strong", { children: "\u5546\u6A19\u6A29" }),
                "\u3092\u4FB5\u5BB3\u3059\u308B\u753B\u50CF\uFF08\u4F01\u696D\u30ED\u30B4\u306A\u3069\uFF09\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093"
              ] }),
              /* @__PURE__ */ jsxs2("li", { style: { marginBottom: "8px" }, children: [
                "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3055\u308C\u305F\u753B\u50CF\u306F",
                /* @__PURE__ */ jsx3("strong", { children: "\u304A\u5BA2\u69D8\u306E\u8CAC\u4EFB" }),
                "\u3067\u7BA1\u7406\u3055\u308C\u307E\u3059"
              ] }),
              /* @__PURE__ */ jsxs2("li", { style: { marginBottom: "8px" }, children: [
                "\u4E0D\u9069\u5207\u306A\u753B\u50CF\u304C\u767A\u898B\u3055\u308C\u305F\u5834\u5408\u3001",
                /* @__PURE__ */ jsx3("strong", { children: "\u4E88\u544A\u306A\u304F\u524A\u9664" }),
                "\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }, children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => {
                  setShowCopyrightModal(!1), pendingImageRef.current = null, fileInputRef.current && (fileInputRef.current.value = "");
                },
                style: {
                  flex: 1,
                  padding: "14px 24px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                },
                children: "\u30AD\u30E3\u30F3\u30BB\u30EB"
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: handleCopyrightAgree,
                style: {
                  flex: 1,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                },
                children: "\u540C\u610F\u3057\u3066\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
              }
            )
          ] })
        ] }) }),
        imageQualityWarning && (() => {
          let isWarning = imageQualityWarning.includes("[WARNING]"), isInfo = imageQualityWarning.includes("[INFO]"), isSuccess = imageQualityWarning.includes("[SUCCESS]"), message = imageQualityWarning.replace("[WARNING]", "").replace("[INFO]", "").replace("[SUCCESS]", "").trim();
          return /* @__PURE__ */ jsxs2("div", { style: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: isWarning ? "#fff3cd" : isInfo ? "#d1ecf1" : "#d4edda",
            border: `1px solid ${isWarning ? "#ffc107" : isInfo ? "#17a2b8" : "#28a745"}`,
            borderRadius: "8px",
            padding: "16px 20px",
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            fontSize: "13px",
            whiteSpace: "pre-line",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }, children: [
            /* @__PURE__ */ jsxs2("div", { style: { display: "flex", alignItems: "flex-start", gap: "8px" }, children: [
              /* @__PURE__ */ jsx3(Icon, { type: isWarning ? "warning" : isInfo ? "info" : "check", size: 20, color: isWarning ? "#ffc107" : isInfo ? "#17a2b8" : "#28a745" }),
              /* @__PURE__ */ jsx3("div", { style: { flex: 1 }, children: message })
            ] }),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => setImageQualityWarning(null),
                style: {
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600"
                },
                children: "\u9589\u3058\u308B"
              }
            )
          ] });
        })(),
        isModalOpen && /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1e4,
              padding: "20px"
            },
            onClick: closeCartModal,
            children: /* @__PURE__ */ jsxs2(
              "div",
              {
                style: {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: isMobile ? "24px" : "32px",
                  maxWidth: "500px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflow: "auto",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
                },
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs2("div", { style: { marginBottom: "24px" }, children: [
                    /* @__PURE__ */ jsx3("h2", { style: { margin: 0, fontSize: "24px", color: "#333" }, children: "\u{1F6D2} \u30AB\u30FC\u30C8\u306B\u8FFD\u52A0" }),
                    /* @__PURE__ */ jsx3("p", { style: { margin: "8px 0 0 0", fontSize: "14px", color: "#666" }, children: "\u30B5\u30A4\u30BA\u3068\u500B\u6570\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" })
                  ] }),
                  /* @__PURE__ */ jsxs2("div", { style: { marginBottom: "24px" }, children: [
                    /* @__PURE__ */ jsx3("label", { style: { display: "block", fontWeight: "bold", marginBottom: "12px", color: "#333" }, children: "\u30AB\u30E9\u30FC" }),
                    /* @__PURE__ */ jsx3("div", { style: { display: "flex", gap: "12px" }, children: product.colors.map((color) => /* @__PURE__ */ jsx3(
                      "button",
                      {
                        onClick: () => setModalColor(color.name),
                        style: {
                          flex: 1,
                          padding: "12px",
                          border: modalColor === color.name ? "2px solid #5c6ac4" : "2px solid #ddd",
                          borderRadius: "8px",
                          backgroundColor: modalColor === color.name ? "#f0f2ff" : "white",
                          color: modalColor === color.name ? "#5c6ac4" : "#333",
                          fontWeight: modalColor === color.name ? "bold" : "normal",
                          cursor: "pointer",
                          fontSize: "15px",
                          transition: "all 0.2s"
                        },
                        children: color.name
                      },
                      color.name
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxs2("div", { style: { marginBottom: "24px" }, children: [
                    /* @__PURE__ */ jsx3("label", { style: { display: "block", fontWeight: "bold", marginBottom: "12px", color: "#333" }, children: "\u30B5\u30A4\u30BA\u3068\u500B\u6570" }),
                    ["S", "M", "L", "XL", "XXL"].map((size) => {
                      let currentQuantity = modalQuantities[modalColor]?.[size] || 0;
                      return /* @__PURE__ */ jsxs2(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            marginBottom: "8px",
                            backgroundColor: currentQuantity > 0 ? "#f0f2ff" : "#f8f9fa",
                            borderRadius: "8px",
                            border: currentQuantity > 0 ? "2px solid #5c6ac4" : "2px solid transparent"
                          },
                          children: [
                            /* @__PURE__ */ jsx3("span", { style: { fontWeight: "500", fontSize: "16px", color: "#333" }, children: size }),
                            /* @__PURE__ */ jsxs2("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                              /* @__PURE__ */ jsx3(
                                "button",
                                {
                                  onClick: () => {
                                    setModalQuantities((prev) => ({
                                      ...prev,
                                      [modalColor]: {
                                        ...prev[modalColor],
                                        [size]: Math.max(0, (prev[modalColor]?.[size] || 0) - 1)
                                      }
                                    }));
                                  },
                                  style: {
                                    width: "32px",
                                    height: "32px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#666"
                                  },
                                  children: "-"
                                }
                              ),
                              /* @__PURE__ */ jsx3("span", { style: {
                                minWidth: "24px",
                                textAlign: "center",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: currentQuantity > 0 ? "#5c6ac4" : "#999"
                              }, children: currentQuantity }),
                              /* @__PURE__ */ jsx3(
                                "button",
                                {
                                  onClick: () => {
                                    setModalQuantities((prev) => ({
                                      ...prev,
                                      [modalColor]: {
                                        ...prev[modalColor],
                                        [size]: Math.min(99, (prev[modalColor]?.[size] || 0) + 1)
                                      }
                                    }));
                                  },
                                  style: {
                                    width: "32px",
                                    height: "32px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#666"
                                  },
                                  children: "+"
                                }
                              )
                            ] })
                          ]
                        },
                        size
                      );
                    })
                  ] }),
                  /* @__PURE__ */ jsx3(
                    "div",
                    {
                      style: {
                        padding: "16px",
                        backgroundColor: "#f0f2ff",
                        borderRadius: "8px",
                        marginBottom: "24px"
                      },
                      children: /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                        /* @__PURE__ */ jsx3("span", { style: { fontWeight: "bold", fontSize: "16px", color: "#333" }, children: "\u5408\u8A08" }),
                        /* @__PURE__ */ jsxs2("span", { style: { fontWeight: "bold", fontSize: "20px", color: "#5c6ac4" }, children: [
                          Object.values(modalQuantities).reduce((colorQty, sizes2) => colorQty + Object.values(sizes2).reduce((sum, qty) => sum + qty, 0), 0),
                          " \u70B9"
                        ] })
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "12px" }, children: [
                    /* @__PURE__ */ jsx3(
                      "button",
                      {
                        onClick: closeCartModal,
                        style: {
                          flex: 1,
                          padding: "14px",
                          border: "2px solid #ddd",
                          borderRadius: "8px",
                          backgroundColor: "white",
                          color: "#666",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer"
                        },
                        children: "\u30AD\u30E3\u30F3\u30BB\u30EB"
                      }
                    ),
                    /* @__PURE__ */ jsx3(
                      "button",
                      {
                        onClick: handleAddToCartMultiple,
                        disabled: Object.values(modalQuantities).reduce((colorQty, sizes2) => colorQty + Object.values(sizes2).reduce((sum, qty) => sum + qty, 0), 0) === 0,
                        style: {
                          flex: 1,
                          padding: "14px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: Object.values(modalQuantities).reduce((colorQty, sizes2) => colorQty + Object.values(sizes2).reduce((sum, qty) => sum + qty, 0), 0) === 0 ? "#ccc" : "#5c6ac4",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: Object.values(modalQuantities).reduce((colorQty, sizes2) => colorQty + Object.values(sizes2).reduce((sum, qty) => sum + qty, 0), 0) === 0 ? "not-allowed" : "pointer"
                        },
                        children: "\u30AB\u30FC\u30C8\u306B\u8FFD\u52A0"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  ) : /* @__PURE__ */ jsxs2("div", { style: { padding: "60px", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx3("h2", { children: "\u23F3 \u8AAD\u307F\u8FBC\u307F\u4E2D..." }),
    /* @__PURE__ */ jsx3("p", { style: { color: "#666", marginTop: "20px" }, children: "Fabric.js\u30E9\u30A4\u30D6\u30E9\u30EA\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u3059..." }),
    /* @__PURE__ */ jsx3("div", { style: {
      marginTop: "30px",
      width: "200px",
      height: "4px",
      backgroundColor: "#e0e0e0",
      margin: "30px auto",
      borderRadius: "2px",
      overflow: "hidden"
    }, children: /* @__PURE__ */ jsx3("div", { style: {
      width: "50%",
      height: "100%",
      backgroundColor: "#5c6ac4",
      animation: "loading 1.5s ease-in-out infinite"
    } }) }),
    /* @__PURE__ */ jsx3("style", { children: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
        ` })
  ] });
}
var panelStyle = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "0",
  boxShadow: "none",
  height: "100%"
}, sectionStyle = {
  marginBottom: "30px"
}, sectionTitleStyle = {
  fontSize: "11px",
  marginBottom: "16px",
  color: "#666",
  fontWeight: "400",
  letterSpacing: "0.15em",
  textTransform: "uppercase"
}, dividerStyle = {
  margin: "30px 0",
  border: "none",
  borderTop: "1px solid #e5e5e5"
}, buttonStyle = (bgColor, enabled) => ({
  width: "100%",
  padding: "14px 20px",
  marginBottom: "10px",
  backgroundColor: enabled ? "#1a1a1a" : "#e0e0e0",
  color: enabled ? "white" : "#999",
  border: "none",
  borderRadius: "0",
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: enabled ? "pointer" : "not-allowed",
  fontWeight: "400",
  transition: "all 0.3s ease"
}), primaryButtonStyle = (disabled) => ({
  width: "100%",
  padding: "16px 20px",
  backgroundColor: disabled ? "#e0e0e0" : "#1a1a1a",
  color: disabled ? "#999" : "white",
  border: "none",
  borderRadius: "0",
  fontSize: "13px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "400",
  transition: "all 0.3s ease"
});
var historyButtonStyle = (enabled) => ({
  flex: 1,
  padding: "12px",
  backgroundColor: enabled ? "#4a4a4a" : "#e0e0e0",
  color: enabled ? "white" : "#999",
  border: "none",
  borderRadius: "0",
  fontSize: "11px",
  letterSpacing: "0.05em",
  cursor: enabled ? "pointer" : "not-allowed",
  fontWeight: "400",
  transition: "all 0.3s ease"
}), inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "10px",
  border: "1px solid #d0d0d0",
  borderRadius: "0",
  fontSize: "13px",
  letterSpacing: "0.02em",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease"
}, textareaStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "2px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  resize: "vertical"
}, selectStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box"
}, colorInputStyle = {
  width: "100%",
  height: "40px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  cursor: "pointer"
}, labelStyle = {
  fontSize: "12px",
  display: "block",
  marginBottom: "5px",
  color: "#666",
  fontWeight: "500"
}, infoBoxStyle = {
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  fontSize: "13px",
  border: "1px solid #e0e0e0"
};

// app/lib/products.ts
var products = [
  {
    id: "box-tshirt-short",
    name: "\u30DC\u30C3\u30AF\u30B9\u30B7\u30EB\u30A8\u30C3\u30C8 / \u534A\u8896T\u30B7\u30E3\u30C4",
    description: "\u3086\u3063\u305F\u308A\u3068\u3057\u305F\u30DC\u30C3\u30AF\u30B9\u30B7\u30EB\u30A8\u30C3\u30C8\u306E\u534A\u8896T\u30B7\u30E3\u30C4\uFF08\u30E6\u30CB\u30BB\u30C3\u30AF\u30B9\uFF09",
    price: 2490,
    category: "tshirt",
    colors: [
      { name: "\u30DB\u30EF\u30A4\u30C8", hex: "#FFFFFF" },
      { name: "\u30D6\u30E9\u30C3\u30AF", hex: "#000000" }
    ],
    mockupImage: "/images/products/box-tshirt-short-white.png",
    printAreaWidth: 200,
    printAreaHeight: 250
  },
  {
    id: "box-tshirt-long",
    name: "\u30DC\u30C3\u30AF\u30B9\u30B7\u30EB\u30A8\u30C3\u30C8 / \u9577\u8896T\u30B7\u30E3\u30C4",
    description: "\u3086\u3063\u305F\u308A\u3068\u3057\u305F\u30DC\u30C3\u30AF\u30B9\u30B7\u30EB\u30A8\u30C3\u30C8\u306E\u9577\u8896T\u30B7\u30E3\u30C4\uFF08\u30E6\u30CB\u30BB\u30C3\u30AF\u30B9\uFF09",
    price: 2990,
    category: "longsleeve",
    colors: [
      { name: "\u30DB\u30EF\u30A4\u30C8", hex: "#FFFFFF" },
      { name: "\u30D6\u30E9\u30C3\u30AF", hex: "#000000" }
    ],
    mockupImage: "/images/products/box-tshirt-long-white.png",
    printAreaWidth: 200,
    printAreaHeight: 250
  },
  {
    id: "sweatshirt",
    name: "\u30B9\u30A6\u30A7\u30C3\u30C8\u30B7\u30E3\u30C4",
    description: "\u5FEB\u9069\u306A\u7740\u5FC3\u5730\u306E\u30B9\u30A6\u30A7\u30C3\u30C8\u30B7\u30E3\u30C4\uFF08\u30E6\u30CB\u30BB\u30C3\u30AF\u30B9\uFF09",
    price: 3990,
    category: "sweatshirt",
    colors: [
      { name: "\u30AA\u30D5\u30DB\u30EF\u30A4\u30C8", hex: "#F5F5DC" },
      { name: "\u30D6\u30E9\u30C3\u30AF", hex: "#000000" }
    ],
    mockupImage: "/images/products/sweatshirt-white.png",
    printAreaWidth: 220,
    printAreaHeight: 280
  },
  {
    id: "hoodie",
    name: "\u30B9\u30A6\u30A7\u30C3\u30C8\u30D7\u30EB\u30D1\u30FC\u30AB",
    description: "\u30D5\u30FC\u30C9\u4ED8\u304D\u30B9\u30A6\u30A7\u30C3\u30C8\u30D1\u30FC\u30AB\u30FC\uFF08\u30E6\u30CB\u30BB\u30C3\u30AF\u30B9\uFF09",
    price: 4990,
    category: "hoodie",
    colors: [
      { name: "\u30AA\u30D5\u30DB\u30EF\u30A4\u30C8", hex: "#F5F5DC" },
      { name: "\u30D6\u30E9\u30C3\u30AF", hex: "#000000" }
    ],
    mockupImage: "/images/products/hoodie-white.png",
    printAreaWidth: 220,
    printAreaHeight: 280
  }
];
function getProductById(id) {
  return products.find((p) => p.id === id);
}

// app/routes/customize.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var meta = () => [
  { title: "\u30C7\u30B6\u30A4\u30F3\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA | PrintAIze" },
  {
    name: "description",
    content: "AI\u3067\u753B\u50CF\u751F\u6210\u3082\u53EF\u80FD\uFF01\u81EA\u5206\u3060\u3051\u306E\u30AA\u30EA\u30B8\u30CA\u30EB\u30C7\u30B6\u30A4\u30F3\u3092\u4F5C\u6210\u3057\u3088\u3046\uFF01"
  }
];
async function loader2({ request }) {
  let productId = new URL(request.url).searchParams.get("product");
  if (!productId)
    throw new Response("\u5546\u54C1\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093", { status: 400 });
  let product = getProductById(productId);
  if (!product)
    throw new Response("\u5546\u54C1\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", { status: 404 });
  return json7({ product });
}
function Customize() {
  let { product } = useLoaderData2();
  return /* @__PURE__ */ jsx4(
    motion2.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      style: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        position: "relative"
      },
      children: /* @__PURE__ */ jsx4(PrintAIze, { product })
    }
  );
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta2
});
import { Link } from "@remix-run/react";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var meta2 = () => [
  { title: "\u5546\u54C1\u3092\u9078\u629E | PrintAIze" },
  {
    name: "description",
    content: "\u304A\u597D\u307F\u306E\u5546\u54C1\u3092\u9078\u3093\u3067\u30AA\u30EA\u30B8\u30CA\u30EB\u30C7\u30B6\u30A4\u30F3\u3092\u4F5C\u6210\u3057\u307E\u3057\u3087\u3046\uFF01"
  }
];
function Index() {
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      style: {
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      },
      children: [
        /* @__PURE__ */ jsx5(
          "header",
          {
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "40px 20px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            },
            children: /* @__PURE__ */ jsxs3("div", { style: { maxWidth: "1200px", margin: "0 auto", textAlign: "center" }, children: [
              /* @__PURE__ */ jsx5("h1", { style: { margin: 0, fontSize: "36px", fontWeight: "bold" }, children: "\u{1F3A8} PrintAIze" }),
              /* @__PURE__ */ jsx5("p", { style: { margin: "15px 0 0", opacity: 0.95, fontSize: "18px" }, children: "\u4E16\u754C\u306B\u4E00\u3064\u3060\u3051\u306E\u30AA\u30EA\u30B8\u30CA\u30EB\u30C7\u30B6\u30A4\u30F3\u3092\u4F5C\u6210\u3057\u3088\u3046" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs3("main", { style: { padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs3("div", { style: { textAlign: "center", marginBottom: "50px" }, children: [
            /* @__PURE__ */ jsx5("h2", { style: { fontSize: "28px", color: "#333", marginBottom: "15px" }, children: "\u5546\u54C1\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044" }),
            /* @__PURE__ */ jsx5("p", { style: { color: "#666", fontSize: "16px" }, children: "T\u30B7\u30E3\u30C4\u30FB\u30B9\u30A6\u30A7\u30C3\u30C8\u5546\u54C1\u306F\u7537\u5973\u517C\u7528\uFF08\u30E6\u30CB\u30BB\u30C3\u30AF\u30B9\uFF09\u3067\u3059" })
          ] }),
          /* @__PURE__ */ jsx5(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
                marginBottom: "60px"
              },
              children: products.map((product) => /* @__PURE__ */ jsx5(
                Link,
                {
                  to: `/customize?product=${product.id}`,
                  style: { textDecoration: "none" },
                  children: /* @__PURE__ */ jsxs3(
                    "div",
                    {
                      style: {
                        backgroundColor: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        border: "2px solid transparent"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "translateY(-8px)", e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)", e.currentTarget.style.borderColor = "#667eea";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)", e.currentTarget.style.borderColor = "transparent";
                      },
                      children: [
                        /* @__PURE__ */ jsxs3(
                          "div",
                          {
                            style: {
                              width: "100%",
                              height: "350px",
                              backgroundColor: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              overflow: "hidden"
                            },
                            children: [
                              /* @__PURE__ */ jsx5(
                                "img",
                                {
                                  src: product.mockupImage,
                                  alt: product.name,
                                  style: {
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain"
                                  },
                                  onError: (e) => {
                                    e.currentTarget.style.display = "none";
                                    let fallback = document.createElement("div");
                                    fallback.style.fontSize = "80px", fallback.style.opacity = "0.3", fallback.style.color = "#999999", fallback.textContent = product.category === "tshirt" ? "\u{1F455}" : product.category === "longsleeve" ? "\u{1F454}" : (product.category === "sweatshirt", "\u{1F9E5}"), e.currentTarget.parentElement?.appendChild(fallback);
                                  }
                                }
                              ),
                              product.id === "box-tshirt-short" && /* @__PURE__ */ jsx5(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    top: "15px",
                                    right: "15px",
                                    backgroundColor: "#ff6b6b",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                  },
                                  children: "\u4EBA\u6C17"
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs3("div", { style: { padding: "24px" }, children: [
                          /* @__PURE__ */ jsx5(
                            "h3",
                            {
                              style: {
                                margin: "0 0 10px",
                                fontSize: "18px",
                                color: "#333",
                                fontWeight: "600"
                              },
                              children: product.name
                            }
                          ),
                          /* @__PURE__ */ jsx5(
                            "p",
                            {
                              style: {
                                margin: "0 0 15px",
                                fontSize: "14px",
                                color: "#666",
                                lineHeight: "1.5"
                              },
                              children: product.description
                            }
                          ),
                          /* @__PURE__ */ jsxs3("div", { style: { marginBottom: "15px" }, children: [
                            /* @__PURE__ */ jsx5("div", { style: { fontSize: "12px", color: "#999", marginBottom: "8px" }, children: "\u30AB\u30E9\u30FC:" }),
                            /* @__PURE__ */ jsx5("div", { style: { display: "flex", gap: "8px" }, children: product.colors.map((color) => /* @__PURE__ */ jsx5(
                              "div",
                              {
                                style: {
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: color.hex,
                                  border: color.hex === "#FFFFFF" ? "2px solid #ddd" : "2px solid transparent",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                },
                                title: color.name
                              },
                              color.name
                            )) })
                          ] }),
                          /* @__PURE__ */ jsxs3(
                            "div",
                            {
                              style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingTop: "15px",
                                borderTop: "1px solid #eee"
                              },
                              children: [
                                /* @__PURE__ */ jsxs3("span", { style: { fontSize: "24px", fontWeight: "bold", color: "#667eea" }, children: [
                                  "\xA5",
                                  product.price.toLocaleString()
                                ] }),
                                /* @__PURE__ */ jsx5(
                                  "span",
                                  {
                                    style: {
                                      fontSize: "14px",
                                      color: "#667eea",
                                      fontWeight: "600"
                                    },
                                    children: "\u30C7\u30B6\u30A4\u30F3\u958B\u59CB \u2192"
                                  }
                                )
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  )
                },
                product.id
              ))
            }
          ),
          /* @__PURE__ */ jsxs3(
            "div",
            {
              style: {
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "40px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              },
              children: [
                /* @__PURE__ */ jsx5("h3", { style: { textAlign: "center", fontSize: "24px", marginBottom: "40px", color: "#333" }, children: "\u2728 \u30AB\u30B9\u30BF\u30DE\u30A4\u30BA\u6A5F\u80FD" }),
                /* @__PURE__ */ jsxs3(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "30px"
                    },
                    children: [
                      /* @__PURE__ */ jsxs3("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsx5("div", { style: { fontSize: "48px", marginBottom: "15px" }, children: "\u{1F916}" }),
                        /* @__PURE__ */ jsx5("h4", { style: { fontSize: "18px", marginBottom: "10px", color: "#333" }, children: "AI\u753B\u50CF\u751F\u6210" }),
                        /* @__PURE__ */ jsx5("p", { style: { fontSize: "14px", color: "#666", lineHeight: "1.6" }, children: "\u30C6\u30AD\u30B9\u30C8\u304B\u3089\u753B\u50CF\u3092\u751F\u6210\u3057\u3066\u3001\u30AA\u30EA\u30B8\u30CA\u30EB\u30C7\u30B6\u30A4\u30F3\u3092\u4F5C\u6210" })
                      ] }),
                      /* @__PURE__ */ jsxs3("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsx5("div", { style: { fontSize: "48px", marginBottom: "15px" }, children: "\u{1F4F7}" }),
                        /* @__PURE__ */ jsx5("h4", { style: { fontSize: "18px", marginBottom: "10px", color: "#333" }, children: "\u5199\u771F\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9" }),
                        /* @__PURE__ */ jsx5("p", { style: { fontSize: "14px", color: "#666", lineHeight: "1.6" }, children: "\u304A\u6C17\u306B\u5165\u308A\u306E\u5199\u771F\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u81EA\u7531\u306B\u914D\u7F6E" })
                      ] }),
                      /* @__PURE__ */ jsxs3("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsx5("div", { style: { fontSize: "48px", marginBottom: "15px" }, children: "\u270F\uFE0F" }),
                        /* @__PURE__ */ jsx5("h4", { style: { fontSize: "18px", marginBottom: "10px", color: "#333" }, children: "\u30C6\u30AD\u30B9\u30C8\u8FFD\u52A0" }),
                        /* @__PURE__ */ jsx5("p", { style: { fontSize: "14px", color: "#666", lineHeight: "1.6" }, children: "\u30D5\u30A9\u30F3\u30C8\u30FB\u30B5\u30A4\u30BA\u30FB\u8272\u3092\u81EA\u7531\u306B\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA" })
                      ] }),
                      /* @__PURE__ */ jsxs3("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsx5("div", { style: { fontSize: "48px", marginBottom: "15px" }, children: "\u{1F3A8}" }),
                        /* @__PURE__ */ jsx5("h4", { style: { fontSize: "18px", marginBottom: "10px", color: "#333" }, children: "\u30D5\u30A3\u30EB\u30BF\u30FC\u52B9\u679C" }),
                        /* @__PURE__ */ jsx5("p", { style: { fontSize: "14px", color: "#666", lineHeight: "1.6" }, children: "\u30B0\u30EC\u30FC\u30B9\u30B1\u30FC\u30EB\u3001\u30BB\u30D4\u30A2\u3001\u660E\u308B\u3055\u8ABF\u6574\u306A\u3069" })
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx5(
          "footer",
          {
            style: {
              background: "linear-gradient(135deg, #434343 0%, #000000 100%)",
              color: "white",
              padding: "40px 20px",
              textAlign: "center",
              marginTop: "60px"
            },
            children: /* @__PURE__ */ jsxs3("div", { style: { maxWidth: "1200px", margin: "0 auto" }, children: [
              /* @__PURE__ */ jsx5("h3", { style: { marginTop: 0, fontSize: "20px" }, children: "\u2728 AI\u753B\u50CF\u751F\u6210 \xD7 Shopify" }),
              /* @__PURE__ */ jsx5("p", { style: { margin: "10px 0", opacity: 0.8 }, children: "Powered by Replicate AI & Shopify Storefront API" }),
              /* @__PURE__ */ jsx5("p", { style: { margin: "20px 0 0", fontSize: "14px", opacity: 0.6 }, children: "\xA9 2026 PrintAIze | All Rights Reserved" })
            ] })
          }
        )
      ]
    }
  );
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-ZIWZUGLD.js", imports: ["/build/_shared/chunk-PPZXRGV2.js", "/build/_shared/chunk-2QEWK57A.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-A3XUC6IR.js", imports: ["/build/_shared/chunk-5VJRENMX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-EULQR4BC.js", imports: ["/build/_shared/chunk-MW6VZF3Z.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.add-to-cart": { id: "routes/api.add-to-cart", parentId: "root", path: "api/add-to-cart", index: void 0, caseSensitive: void 0, module: "/build/routes/api.add-to-cart-5PJLXWBB.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.add-to-cart-multiple": { id: "routes/api.add-to-cart-multiple", parentId: "root", path: "api/add-to-cart-multiple", index: void 0, caseSensitive: void 0, module: "/build/routes/api.add-to-cart-multiple-NSM6XVZW.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.cloudinary-signature": { id: "routes/api.cloudinary-signature", parentId: "root", path: "api/cloudinary-signature", index: void 0, caseSensitive: void 0, module: "/build/routes/api.cloudinary-signature-PYFPVBJG.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.generate-image": { id: "routes/api.generate-image", parentId: "root", path: "api/generate-image", index: void 0, caseSensitive: void 0, module: "/build/routes/api.generate-image-S34GWRTD.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.upload-image": { id: "routes/api.upload-image", parentId: "root", path: "api/upload-image", index: void 0, caseSensitive: void 0, module: "/build/routes/api.upload-image-5NVESI3N.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/customize": { id: "routes/customize", parentId: "root", path: "customize", index: void 0, caseSensitive: void 0, module: "/build/routes/customize-4BZ4LMSW.js", imports: ["/build/_shared/chunk-MW6VZF3Z.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "a8f8097e", hmr: void 0, url: "/build/manifest-A8F8097E.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/api.add-to-cart-multiple": {
    id: "routes/api.add-to-cart-multiple",
    parentId: "root",
    path: "api/add-to-cart-multiple",
    index: void 0,
    caseSensitive: void 0,
    module: api_add_to_cart_multiple_exports
  },
  "routes/api.cloudinary-signature": {
    id: "routes/api.cloudinary-signature",
    parentId: "root",
    path: "api/cloudinary-signature",
    index: void 0,
    caseSensitive: void 0,
    module: api_cloudinary_signature_exports
  },
  "routes/api.generate-image": {
    id: "routes/api.generate-image",
    parentId: "root",
    path: "api/generate-image",
    index: void 0,
    caseSensitive: void 0,
    module: api_generate_image_exports
  },
  "routes/api.upload-image": {
    id: "routes/api.upload-image",
    parentId: "root",
    path: "api/upload-image",
    index: void 0,
    caseSensitive: void 0,
    module: api_upload_image_exports
  },
  "routes/api.add-to-cart": {
    id: "routes/api.add-to-cart",
    parentId: "root",
    path: "api/add-to-cart",
    index: void 0,
    caseSensitive: void 0,
    module: api_add_to_cart_exports
  },
  "routes/customize": {
    id: "routes/customize",
    parentId: "root",
    path: "customize",
    index: void 0,
    caseSensitive: void 0,
    module: customize_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};

// server.js
var server_default = createRequestHandler({ build: server_build_exports, mode: "production" });
export {
  server_default as default
};
