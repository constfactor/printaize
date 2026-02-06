/**
 * トップページ → customizeページの内容を表示
 */

import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import PrintAIze from "~/components/PrintAIze";
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
  // デフォルトで box-tshirt-short を表示
  const product = getProductById("box-tshirt-short");

  if (!product) {
    throw new Response("商品が見つかりません", { status: 404 });
  }

  return json({ product });
}

export default function Index() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      {/* メインコンテンツ */}
      <PrintAIze product={product} />
    </motion.div>
  );
}
