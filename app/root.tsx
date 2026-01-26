/**
 * Remixアプリのルートコンポーネント
 */

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

// 環境変数をクライアントに渡す
export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        
        {/* Google Fonts - 日本語フォント（全フォント） */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&family=M+PLUS+1p:wght@400;700&family=M+PLUS+2:wght@400;700&family=Murecho:wght@400;700&family=Zen+Maru+Gothic:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&family=Zen+Kaku+Gothic+Antique:wght@400;700&family=Zen+Old+Mincho:wght@400;700&family=Zen+Kurenaido&family=Zen+Antique&family=Zen+Antique+Soft&family=Kosugi+Maru&family=Kosugi&family=Sawarabi+Mincho&family=Sawarabi+Gothic&family=Klee+One:wght@400;600&family=Shippori+Mincho:wght@400;700&family=Shippori+Antique&family=Shippori+Antique+B1&family=Yusei+Magic&family=Yomogi&family=BIZ+UDPGothic:wght@400;700&family=BIZ+UDPMincho:wght@400;700&family=Dela+Gothic+One&family=DotGothic16&family=Hina+Mincho&family=Kiwi+Maru:wght@400;500&family=Reggae+One&family=RocknRoll+One&family=Potta+One&family=Train+One&family=Rampart+One&family=Kaisei+Decol:wght@400;700&family=Kaisei+HarunoUmi:wght@400;700&family=Kaisei+Tokumin:wght@400;700&family=Kaisei+Opti:wght@400;700&family=Stick&family=Mochiy+Pop+One&family=Mochiy+Pop+P+One&family=New+Tegomin&family=Hachi+Maru+Pop&family=Otomanopee+One&family=Shirokuma&family=Slackkey&family=Cherry+Bomb+One&family=Monomaniac+One&family=Palette+Mosaic&family=Yuji+Syuku&family=Yuji+Boku&family=Yuji+Mai&display=swap" rel="stylesheet" />
        
        {/* Fabric.jsをCDNから読み込む */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"></script>
        
        <style>{`
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
        `}</style>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
