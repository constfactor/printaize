/**
 * カスタマイズページ（商品選択後）
 */

import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import TShirtCustomizer from "~/components/TShirtCustomizer";
import { getProductById } from "~/lib/products";

export const meta: MetaFunction = () => {
  return [
    { title: "デザインカスタマイズ | PrintAIze" },
    {
      name: "description",
      content: "AIで画像生成も可能！自分だけのオリジナルデザインを作成しよう！",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("product");

  if (!productId) {
    throw new Response("商品が選択されていません", { status: 400 });
  }

  const product = getProductById(productId);

  if (!product) {
    throw new Response("商品が見つかりません", { status: 404 });
  }

  return json({ product });
}

export default function Customize() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              🎨 {product.name}
            </h1>
            <p style={{ margin: "5px 0 0", opacity: 0.95, fontSize: "14px" }}>
              {product.description}
            </p>
          </div>
          <Link
            to="/"
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              border: "2px solid rgba(255,255,255,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
            }}
          >
            ← 商品を変更
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ padding: "20px 0" }}>
        <TShirtCustomizer product={product} />
      </main>

      {/* フッター */}
      <footer
        style={{
          background: "linear-gradient(135deg, #434343 0%, #000000 100%)",
          color: "white",
          padding: "30px 20px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            © 2026 PrintAIze | Powered by AI & Shopify
          </p>
        </div>
      </footer>
    </div>
  );
}
