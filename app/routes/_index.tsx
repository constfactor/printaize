/**
 * 商品選択ページ（トップページ）
 */

import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { products } from "~/lib/products";

export const meta: MetaFunction = () => {
  return [
    { title: "商品を選択 | PrintAIze" },
    {
      name: "description",
      content: "お好みの商品を選んでオリジナルデザインを作成しましょう！",
    },
  ];
};

export default function Index() {
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
          padding: "40px 20px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "36px", fontWeight: "bold" }}>
            🎨 PrintAIze
          </h1>
          <p style={{ margin: "15px 0 0", opacity: 0.95, fontSize: "18px" }}>
            世界に一つだけのオリジナルデザインを作成しよう
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "28px", color: "#333", marginBottom: "15px" }}>
            商品を選んでください
          </h2>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Tシャツ・スウェット商品は男女兼用（ユニセックス）です
          </p>
        </div>

        {/* 商品グリッド */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            marginBottom: "60px",
          }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/customize?product=${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                {/* 商品画像エリア */}
                <div
                  style={{
                    width: "100%",
                    height: "350px",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.mockupImage}
                    alt={product.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      // 画像読み込み失敗時のフォールバック
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.style.fontSize = '80px';
                      fallback.style.opacity = '0.3';
                      fallback.style.color = '#999999';
                      fallback.textContent = product.category === 'tshirt' ? '👕' :
                                            product.category === 'longsleeve' ? '👔' :
                                            product.category === 'sweatshirt' ? '🧥' : '🧥';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                  
                  {/* "人気" バッジ（最初の商品のみ） */}
                  {product.id === 'box-tshirt-short' && (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        backgroundColor: "#ff6b6b",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      人気
                    </div>
                  )}
                </div>

                {/* 商品情報 */}
                <div style={{ padding: "24px" }}>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: "18px",
                      color: "#333",
                      fontWeight: "600",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 15px",
                      fontSize: "14px",
                      color: "#666",
                      lineHeight: "1.5",
                    }}
                  >
                    {product.description}
                  </p>

                  {/* カラーバリエーション */}
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                      カラー:
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {product.colors.map((color) => (
                        <div
                          key={color.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: color.hex,
                            border: color.hex === '#FFFFFF' ? '2px solid #ddd' : '2px solid transparent',
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 価格 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "15px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}>
                      ¥{product.price.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#667eea",
                        fontWeight: "600",
                      }}
                    >
                      デザイン開始 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 特徴セクション */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ textAlign: "center", fontSize: "24px", marginBottom: "40px", color: "#333" }}>
            ✨ カスタマイズ機能
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🤖</div>
              <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>AI画像生成</h4>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                テキストから画像を生成して、オリジナルデザインを作成
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📷</div>
              <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>写真アップロード</h4>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                お気に入りの写真をアップロードして自由に配置
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>✏️</div>
              <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>テキスト追加</h4>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                フォント・サイズ・色を自由にカスタマイズ
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🎨</div>
              <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>フィルター効果</h4>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                グレースケール、セピア、明るさ調整など
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer
        style={{
          background: "linear-gradient(135deg, #434343 0%, #000000 100%)",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ marginTop: 0, fontSize: "20px" }}>
            ✨ AI画像生成 × Shopify
          </h3>
          <p style={{ margin: "10px 0", opacity: 0.8 }}>
            Powered by Replicate AI & Shopify Storefront API
          </p>
          <p style={{ margin: "20px 0 0", fontSize: "14px", opacity: 0.6 }}>
            © 2026 PrintAIze | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
