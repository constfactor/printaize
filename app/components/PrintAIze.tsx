/**
 * PrintAIze カスタマイザーコンポーネント
 * AIを活用したオリジナルプリントデザイン作成ツール
 * 
 * 機能:
 * - 画像アップロード＆編集
 * - AI画像生成（Replicate）
 * - テキスト追加＆編集
 * - フィルター適用
 * - 履歴管理（元に戻す/やり直し）
 * - Shopifyカートに追加
 */

import { useEffect, useRef, useState } from "react";
import type { Product } from "~/lib/products";

interface PrintAIzeProps {
  product: Product;
}

// SVGアイコンコンポーネント
const Icon = ({ type, size = 20, color = "currentColor" }: { type: string; size?: number; color?: string }) => {
  const icons: { [key: string]: JSX.Element } = {
    clipboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M5 13l4 4L19 7"/>
      </svg>
    ),
    warning: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>
      </svg>
    ),
    lightbulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M9 21h6m-6 0v-2m6 2v-2m-9-7a6 6 0 1112 0c0 3.31-2.31 6-5 8H9c-2.69-2-5-4.69-5-8z"/>
      </svg>
    ),
    cart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
    save: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
        <path d="M17 21v-8H7v8M7 3v5h8"/>
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/>
      </svg>
    ),
    loading: (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          strokeDasharray="60" 
          strokeDashoffset="40"
        />
        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </svg>
    ),
    image: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
    ),
    text: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
      </svg>
    ),
    palette: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/>
        <circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
    trash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 5v14m-7-7h14"/>
      </svg>
    ),
    robot: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
        <path d="M12 7v4m-4 5h.01M16 16h.01"/>
      </svg>
    ),
    camera: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v12"/>
      </svg>
    ),
    zoomIn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M21 3l-9 9m0 0v-6m0 6h6"/>
        <path d="M3 21l9-9m0 0v6m0-6H6"/>
      </svg>
    ),
    zoomOut: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M15 9l6-6m0 0h-6m6 0v6"/>
        <path d="M9 15l-6 6m0 0h6m-6 0v-6"/>
      </svg>
    ),
  };
  
  return <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>{icons[type] || null}</span>;
};

// フォントリスト定義（Google Fonts日本語フォント全種 + 英語フォント）
const FONT_LIST = [
  // 日本語フォント - Google Fonts
  { value: "Noto Sans JP", label: "Noto Sans JP", family: "'Noto Sans JP', sans-serif", type: "japanese" },
  { value: "Noto Serif JP", label: "Noto Serif JP", family: "'Noto Serif JP', serif", type: "japanese" },
  { value: "BIZ UDPGothic", label: "BIZ UDPゴシック", family: "'BIZ UDPGothic', sans-serif", type: "japanese" },
  { value: "BIZ UDPMincho", label: "BIZ UDP明朝", family: "'BIZ UDPMincho', serif", type: "japanese" },
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
  { value: "Dela Gothic One", label: "デラゴシック", family: "'Dela Gothic One', sans-serif", type: "japanese" },
  { value: "DotGothic16", label: "ドットゴシック16", family: "'DotGothic16', sans-serif", type: "japanese" },
  { value: "Hina Mincho", label: "ひな明朝", family: "'Hina Mincho', serif", type: "japanese" },
  { value: "Kaisei Decol", label: "解星デコール", family: "'Kaisei Decol', serif", type: "japanese" },
  { value: "Kaisei HarunoUmi", label: "Kaisei HarunoUmi", family: "'Kaisei HarunoUmi', serif", type: "japanese" },
  { value: "Kaisei Tokumin", label: "Kaisei Tokumin", family: "'Kaisei Tokumin', serif", type: "japanese" },
  { value: "Kaisei Opti", label: "Kaisei Opti", family: "'Kaisei Opti', serif", type: "japanese" },
  { value: "Kiwi Maru", label: "キウイ丸", family: "'Kiwi Maru', sans-serif", type: "japanese" },
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
  { value: "Hiragino Kaku Gothic ProN", label: "ヒラギノ角ゴシック", family: "'Hiragino Kaku Gothic ProN', sans-serif", type: "japanese" },
  { value: "Yu Gothic", label: "游ゴシック", family: "'Yu Gothic', sans-serif", type: "japanese" },
  { value: "Meiryo", label: "メイリオ", family: "Meiryo, sans-serif", type: "japanese" },
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
  { value: "Garamond", label: "Garamond", family: "Garamond, serif", type: "english" },
];

export default function PrintAIze({ product }: PrintAIzeProps) {
  // ========== ステップ1: 状態管理 ==========
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 画像関連
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFabricReady, setIsFabricReady] = useState(false);
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [imageQualityWarning, setImageQualityWarning] = useState<string | null>(null);
  const pendingImageRef = useRef<File | null>(null);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  
  // AI生成関連
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAIPrompt, setLastAIPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  
  // テキスト関連
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState("Noto Sans JP");
  const firstTextObjectRef = useRef<any>(null); // 初回のテキストオブジェクトを追跡
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [activeFontTab, setActiveFontTab] = useState<"japanese" | "english">("japanese"); // フォントタブの状態
  
  // 履歴管理
  const historyRef = useRef<string[]>([]);
  const historyStepRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isHistoryInitializedRef = useRef<boolean>(false); // 履歴初期化フラグ（refで管理）
  const isLoadingHistoryRef = useRef<boolean>(false); // undo/redo実行中フラグ
  
  // カート関連
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // モーダル関連
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColor, setModalColor] = useState(product.colors[0].name);
  // カラーごとに個数を保持
  const [modalQuantities, setModalQuantities] = useState<{ [color: string]: { [size: string]: number } }>(() => {
    const initial: { [color: string]: { [size: string]: number } } = {};
    product.colors.forEach(color => {
      initial[color.name] = {
        S: 0,
        M: color.name === product.colors[0].name ? 1 : 0, // 最初のカラーのみMを1に
        L: 0,
        XL: 0,
        XXL: 0,
      };
    });
    return initial;
  });
  
  // 商品選択関連
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // レスポンシブ対応
  const [isMobile, setIsMobile] = useState(false);
  
  // ズーム表示状態
  const [isZoomed, setIsZoomed] = useState(false);
  
  // ズーム時のESCキーハンドラー
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed && fabricCanvasRef.current) {
        // ズームをリセット
        fabricCanvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);
        fabricCanvasRef.current.renderAll();
        setIsZoomed(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isZoomed]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // フォントドロップダウン用のref
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  // フォントドロップダウンの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isFontDropdownOpen && fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };

    if (isFontDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFontDropdownOpen]);

  // カラーに基づいて商品画像のパスを生成
  const getCurrentMockupImage = () => {
    // カラー名から画像ファイル名を決定
    const colorSlug = 
      selectedColor.name === 'ホワイト' || selectedColor.name === 'オフホワイト' 
        ? 'white' 
        : 'black';
    return `/images/products/${product.id}-${colorSlug}.png`;
  };

  // プリント範囲を計算（mm → px変換）
  const getPrintAreaInPixels = (canvasSize: number) => {
    // 商品ごとにプリント範囲のスケールを調整
    let baseScale = 0.6; // デフォルト: キャンバスの60%
    let topOffset = 0; // デフォルト: オフセットなし
    
    // Tシャツ系：元の枠線の60%に縮小（0.6 * 0.6 = 0.36）+ 上に20px移動
    // パーカー：元の枠線の40%に縮小（0.6 * 0.4 = 0.24）
    if (product.id === 'box-tshirt-short' || product.id === 'box-tshirt-long' || product.id === 'sweatshirt') {
      baseScale = 0.36;
      topOffset = -20; // 上に20ピクセル移動
    } else if (product.id === 'hoodie') {
      baseScale = 0.24; // 40%に縮小
      topOffset = 0; // 中央配置
    }
    
    const scale = canvasSize * baseScale;
    const ratio = product.printAreaWidth / product.printAreaHeight;
    
    let width, height;
    if (ratio > 1) {
      // 横長
      width = scale;
      height = scale / ratio;
    } else {
      // 縦長
      height = scale;
      width = scale * ratio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height),
      left: Math.round((canvasSize - width) / 2),
      top: Math.round((canvasSize - height) / 2) + topOffset,
    };
  };

  // ========== ステップ1.5: Fabric.js読み込み待機 ==========
  useEffect(() => {
    // Fabric.jsがグローバルに読み込まれるまで待つ
    let checkCount = 0;
    let isLoaded = false;
    
    const checkFabric = setInterval(() => {
      checkCount++;
      if (typeof window !== 'undefined' && typeof (window as any).fabric !== 'undefined') {
        isLoaded = true;
        setFabricLoaded(true);
        clearInterval(checkFabric);
      }
    }, 100);

    // タイムアウト（10秒後）
    const timeout = setTimeout(() => {
      clearInterval(checkFabric);
      if (!isLoaded) {
        console.error('❌ Fabric.jsの読み込みに失敗しました');
      }
    }, 10000);

    return () => {
      clearInterval(checkFabric);
      clearTimeout(timeout);
    };
  }, []);

  // ========== ステップ2: Fabric.jsキャンバス初期化 ==========
  useEffect(() => {
    if (!canvasRef.current || !fabricLoaded || typeof (window as any).fabric === 'undefined') {
      return;
    }
    
    const fabricLib = (window as any).fabric;

    // キャンバスサイズは固定（800x800）- CSS transformでスケーリング
    const canvasSize = 800;
    
    // キャンバスを作成
    const canvas = new fabricLib.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: "#fafafa",
      selection: true,
      preserveObjectStacking: true, // 選択時にz-orderを変更しない
      allowTouchScrolling: true, // モバイルでスクロールを許可
      stopContextMenu: true, // コンテキストメニューを無効化
      fireRightClick: false, // 右クリックイベントを無効化
      fireMiddleClick: false, // 中クリックイベントを無効化
      enablePointerEvents: true, // ポインターイベントを有効化
    });
    
    // モバイルの場合、初期状態でtouchActionを設定
    if (window.innerWidth < 768 && canvasRef.current) {
      canvasRef.current.style.touchAction = "pan-y";
    }

    fabricCanvasRef.current = canvas;
    setIsFabricReady(true);
    
    // コントロールサイズを設定（モバイルは大きく、PCは通常サイズ）
    const isMobileDevice = window.innerWidth < 768;
    const controlSize = isMobileDevice ? 32 : 24; // モバイル: 32px, PC: 24px
    const cornerSize = isMobileDevice ? 28 : 20; // 角のコントロールサイズ
    
    // デフォルトコントロールのサイズを変更
    fabricLib.Object.prototype.set({
      borderColor: '#667eea',
      cornerColor: '#667eea',
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: cornerSize,
      touchCornerSize: isMobileDevice ? 40 : cornerSize, // タッチ時はさらに大きく
      padding: isMobileDevice ? 10 : 5,
    });

    // カスタム削除コントロールを追加
    const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    
    const deleteControlSize = isMobileDevice ? 32 : 24; // モバイルで大きく
    const deleteControl = new fabricLib.Control({
      x: 0.5,
      y: -0.5,
      offsetY: isMobileDevice ? -20 : -16,
      offsetX: isMobileDevice ? 20 : 16,
      cursorStyle: 'pointer',
      mouseUpHandler: (eventData: any, transform: any) => {
        const target = transform.target;
        if (target && target.name !== 'printArea') {
          // テキストオブジェクトの参照をクリア
          if (firstTextObjectRef.current === target) {
            firstTextObjectRef.current = null;
            setTextInput("");
          }
          
          // オブジェクトを削除して初期状態に完全リセット
          canvas.remove(target);
          canvas.renderAll();
          setSelectedObject(null);
          setIsLoading(false);
          
          // 履歴を初期状態にリセット（やり直しを無効化）
          const initialState = historyRef.current[0];
          historyRef.current = [initialState];
          historyStepRef.current = 0;
          updateHistoryButtons();
        }
        return true;
      },
      render: (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) => {
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabricLib.util.degreesToRadians(fabricObject.angle || 0));
        ctx.drawImage(deleteImg, -deleteControlSize / 2, -deleteControlSize / 2, deleteControlSize, deleteControlSize);
        ctx.restore();
      },
      cornerSize: deleteControlSize
    });

    // 削除アイコン画像を読み込む
    const deleteImg = document.createElement('img');
    deleteImg.src = deleteIcon;

    // すべてのオブジェクトに削除コントロールを追加
    fabricLib.Object.prototype.controls.deleteControl = deleteControl;

    const mockupImageUrl = getCurrentMockupImage();

    // 商品画像を読み込んでキャンバス100%で表示（余白なし）
    fabricLib.Image.fromURL(
      mockupImageUrl,
      (img: any) => {
        if (!img || !img.width) {
          console.error('Failed to load image:', mockupImageUrl);
          return;
        }

        // キャンバス全体にフィットするようスケールを計算
        const scaleX = canvas.width! / (img.width || 1);
        const scaleY = canvas.height! / (img.height || 1);
        const scale = Math.min(scaleX, scaleY) * 0.95; // 余白を少し残して95%表示
        
        img.scale(scale);
        
        // 中央配置
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
        
        // 背景画像には削除ボタンを表示しない
        img.setControlsVisibility({
          deleteControl: false,
        });

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        
        // プリント範囲の矩形を描画（点線）
        const printArea = getPrintAreaInPixels(canvasSize);
        
        // 商品の色に応じて点線の色を決定
        const getPrintAreaStrokeColor = () => {
          const colorName = selectedColor.name.toLowerCase();
          if (colorName.includes('ブラック') || colorName.includes('black')) {
            return 'white'; // ブラックの時は白
          } else {
            return '#000000'; // ホワイトの時は黒
          }
        };
        
        const printRect = new fabricLib.Rect({
          left: printArea.left,
          top: printArea.top,
          width: printArea.width,
          height: printArea.height,
          fill: 'transparent',
          stroke: getPrintAreaStrokeColor(),
          strokeWidth: 0.25,
          strokeDashArray: [2, 2], // 2pt線分の破線
          selectable: false,
          evented: false,
          name: 'printArea', // 識別用
        });
        // プリント範囲の枠には削除ボタンを表示しない
        printRect.setControlsVisibility({
          deleteControl: false,
        });
        canvas.add(printRect);
        
        // 初期状態を履歴として保存（この時点では「元に戻す」は無効）
        setTimeout(() => {
          if (!isHistoryInitializedRef.current) {
            const json = JSON.stringify(canvas.toJSON(['selectable', 'evented', 'name']));
            historyRef.current = [json];
            historyStepRef.current = 0;
            isHistoryInitializedRef.current = true; // 履歴初期化完了
            updateHistoryButtons();
            console.log('初期化完了 - 履歴保存が有効になりました');
          }
        }, 100);
      },
      { crossOrigin: "anonymous" }
    );

    // プリント範囲の境界を取得
    const printArea = getPrintAreaInPixels(canvasSize);
    
    // ========== スマホ用：2本指ピンチ＆回転の実装 ==========
    let touchListenersAdded = false;
    const canvasElement = canvasRef.current;
    
    // Fabric.jsのcanvasWrapperを取得（upper-canvasとlower-canvasを含む親要素）
    const canvasWrapper = canvas.wrapperEl;
    
    if (isMobileDevice && canvasWrapper) {
      let lastDistance = 0;
      let initialDistance = 0;  // 初回の距離を保存
      let initialScale = { x: 1, y: 1 };  // 初回のスケールを保存
      let lastAngle = 0;
      let isGesture = false;
      let lastCenter = { x: 0, y: 0 };
      
      const getTouchDistance = (touch1: Touch, touch2: Touch) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      };
      
      const getTouchAngle = (touch1: Touch, touch2: Touch) => {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.atan2(dy, dx) * 180 / Math.PI;
      };
      
      const getTouchCenter = (touch1: Touch, touch2: Touch) => {
        return {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
      };
      
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          // 2本指タッチ時はページズームを無効化
          canvasWrapper.style.touchAction = 'none';
          
          isGesture = true;
          let activeObject = canvas.getActiveObject();
          
          // オブジェクトが選択されていない場合、タッチ位置のオブジェクトを自動選択
          if (!activeObject || activeObject.name === 'printArea') {
            const rect = canvasWrapper.getBoundingClientRect();
            const canvasScale = canvasSize / rect.width;
            const touch1 = e.touches[0];
            const pointer = {
              x: (touch1.clientX - rect.left) * canvasScale,
              y: (touch1.clientY - rect.top) * canvasScale,
            };
            
            // タッチ位置にあるオブジェクトを検索
            const target = canvas.findTarget(e as any, false);
            
            if (target && target.name !== 'printArea') {
              canvas.setActiveObject(target);
              activeObject = target;
            }
          }
          
          if (activeObject && activeObject.name !== 'printArea') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // 初回の距離とスケールを保存
            initialDistance = getTouchDistance(e.touches[0], e.touches[1]);
            lastDistance = initialDistance;
            initialScale = {
              x: activeObject.scaleX || 1,
              y: activeObject.scaleY || 1,
            };
            lastAngle = getTouchAngle(e.touches[0], e.touches[1]);
            lastCenter = getTouchCenter(e.touches[0], e.touches[1]);
            
            console.log('✅ Starting pinch - initialDistance:', initialDistance, 'initialScale:', initialScale);
            
            // PCの場合のみコントロールを一時非表示（スマホは最初から非表示）
            if (activeObject.hasControls) {
              activeObject.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                tl: false,
                tr: false,
                bl: false,
                br: false,
                mtr: false,
              });
            }
            canvas.renderAll();
          }
        }
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2 && isGesture) {
          const activeObject = canvas.getActiveObject();
          if (activeObject && activeObject.name !== 'printArea') {
            e.preventDefault();
            e.stopPropagation();
            
            // 中心点の移動を計算
            const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);
            const rect = canvasWrapper.getBoundingClientRect();
            const canvasScale = canvasSize / rect.width; // キャンバスの実際のスケール
            
            if (lastCenter.x !== 0) {
              const dx = (currentCenter.x - lastCenter.x) * canvasScale;
              const dy = (currentCenter.y - lastCenter.y) * canvasScale;
              activeObject.left = (activeObject.left || 0) + dx;
              activeObject.top = (activeObject.top || 0) + dy;
            }
            lastCenter = currentCenter;
            
            // ピンチイン・ピンチアウト（拡大縮小）- 初期距離からの相対的な変化を計算
            const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
            if (initialDistance > 0) {
              // 初期距離からの倍率を計算（感度を1.5倍に上げる）
              const scaleRatio = currentDistance / initialDistance;
              // 1.0からの差分を1.5倍にして、より敏感に反応させる
              const enhancedRatio = 1.0 + (scaleRatio - 1.0) * 1.5;
              const newScaleX = initialScale.x * enhancedRatio;
              const newScaleY = initialScale.y * enhancedRatio;
              
              console.log('🟢 Pinching - ratio:', scaleRatio.toFixed(2), 'enhanced:', enhancedRatio.toFixed(2), 'newScale:', newScaleX.toFixed(2));
              
              // 最小・最大サイズ制限（縮小しやすくするため最小値を下げる）
              if (newScaleX > 0.05 && newScaleX < 15 && newScaleY > 0.05 && newScaleY < 15) {
                activeObject.scaleX = newScaleX;
                activeObject.scaleY = newScaleY;
              }
            }
            
            // 回転
            const currentAngle = getTouchAngle(e.touches[0], e.touches[1]);
            if (lastAngle !== 0) {
              const angleDiff = currentAngle - lastAngle;
              activeObject.angle = (activeObject.angle || 0) + angleDiff;
            }
            lastAngle = currentAngle;
            
            // 位置を更新して範囲チェック
            activeObject.setCoords();
            const objBounds = activeObject.getBoundingRect(true);
            
            // 範囲内に収める
            if (objBounds.left < printArea.left) {
              activeObject.left += (printArea.left - objBounds.left);
            }
            if (objBounds.top < printArea.top) {
              activeObject.top += (printArea.top - objBounds.top);
            }
            if (objBounds.left + objBounds.width > printArea.left + printArea.width) {
              activeObject.left -= ((objBounds.left + objBounds.width) - (printArea.left + printArea.width));
            }
            if (objBounds.top + objBounds.height > printArea.top + printArea.height) {
              activeObject.top -= ((objBounds.top + objBounds.height) - (printArea.top + printArea.height));
            }
            
            activeObject.setCoords();
            canvas.renderAll();
          }
        }
      };
      
      const handleTouchEnd = (e: TouchEvent) => {
        if (e.touches.length < 2) {
          // touchActionを元に戻す
          canvasWrapper.style.touchAction = 'pan-y';
          
          isGesture = false;
          lastDistance = 0;
          initialDistance = 0;
          initialScale = { x: 1, y: 1 };
          lastAngle = 0;
          lastCenter = { x: 0, y: 0 };
          
          // 最終的な範囲チェック（指を離した時）
          const activeObject = canvas.getActiveObject();
          if (activeObject && activeObject.name !== 'printArea') {
            // 座標を更新
            activeObject.setCoords();
            const objBounds = activeObject.getBoundingRect(true);
            
            // プリント範囲を超えていたら範囲内に収める
            if (objBounds.left < printArea.left) {
              activeObject.left += (printArea.left - objBounds.left);
            }
            if (objBounds.top < printArea.top) {
              activeObject.top += (printArea.top - objBounds.top);
            }
            if (objBounds.left + objBounds.width > printArea.left + printArea.width) {
              activeObject.left -= ((objBounds.left + objBounds.width) - (printArea.left + printArea.width));
            }
            if (objBounds.top + objBounds.height > printArea.top + printArea.height) {
              activeObject.top -= ((objBounds.top + objBounds.height) - (printArea.top + printArea.height));
            }
            
            // 最終的な座標を更新
            activeObject.setCoords();
            
            // PCの場合のみコントロールを再表示（スマホは最初から非表示）
            if (activeObject.hasControls) {
              activeObject.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                tl: true,
                tr: true,
                bl: true,
                br: true,
                mtr: true,
                deleteControl: true,
              });
            }
            
            canvas.renderAll();
            saveHistory();
          }
        }
      };
      
      // キャプチャフェーズで処理（Fabric.jsより先に実行される）
      // canvasWrapperにイベントリスナーを追加（upper-canvasとlower-canvasを両方カバー）
      canvasWrapper.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
      canvasWrapper.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      canvasWrapper.addEventListener('touchend', handleTouchEnd, { capture: true });
      touchListenersAdded = true;
      
      // クリーンアップ用の参照を保存
      (canvas as any)._touchHandlers = {
        element: canvasWrapper,
        start: handleTouchStart,
        move: handleTouchMove,
        end: handleTouchEnd,
      };
    }

    // 画像の移動・スケール・回転制限（範囲内に収める）
    canvas.on("object:moving", (e: any) => {
      const obj = e.target;
      if (!obj || obj.name === 'printArea') return;

      // Shiftキーでまっすぐ移動（Adobe風）
      if (e.e && e.e.shiftKey) {
        // 移動開始位置を記録（初回のみ）
        if (!obj._movingStart) {
          obj._movingStart = { x: obj.left, y: obj.top };
        }
        
        // 移動量を計算
        const dx = Math.abs(obj.left - obj._movingStart.x);
        const dy = Math.abs(obj.top - obj._movingStart.y);
        
        // より大きな移動方向に固定
        if (dx > dy) {
          // 水平方向に固定
          obj.top = obj._movingStart.y;
        } else {
          // 垂直方向に固定
          obj.left = obj._movingStart.x;
        }
      } else {
        // Shiftキーが押されていない場合は記録をクリア
        obj._movingStart = null;
      }

      // 境界ボックスを取得（absolute座標）
      obj.setCoords();
      const objBounds = obj.getBoundingRect(true);
      
      // 左端制限
      if (objBounds.left < printArea.left) {
        obj.left += (printArea.left - objBounds.left);
      }
      // 右端制限
      if (objBounds.left + objBounds.width > printArea.left + printArea.width) {
        obj.left -= ((objBounds.left + objBounds.width) - (printArea.left + printArea.width));
      }
      // 上端制限
      if (objBounds.top < printArea.top) {
        obj.top += (printArea.top - objBounds.top);
      }
      // 下端制限
      if (objBounds.top + objBounds.height > printArea.top + printArea.height) {
        obj.top -= ((objBounds.top + objBounds.height) - (printArea.top + printArea.height));
      }
    });

    // スケール制限（位置調整で範囲内に収める - 滑らか）
    canvas.on("object:scaling", (e: any) => {
      const obj = e.target;
      if (!obj || obj.name === 'printArea') return;

      obj.setCoords();
      const objBounds = obj.getBoundingRect(true);
      
      // 範囲外になった場合、位置を調整して範囲内に収める
      if (objBounds.left < printArea.left) {
        obj.left += (printArea.left - objBounds.left);
      }
      if (objBounds.top < printArea.top) {
        obj.top += (printArea.top - objBounds.top);
      }
      if (objBounds.left + objBounds.width > printArea.left + printArea.width) {
        obj.left -= ((objBounds.left + objBounds.width) - (printArea.left + printArea.width));
      }
      if (objBounds.top + objBounds.height > printArea.top + printArea.height) {
        obj.top -= ((objBounds.top + objBounds.height) - (printArea.top + printArea.height));
      }
    });


    // 回転制限（位置調整で範囲内に収める - 滑らか）
    canvas.on("object:rotating", (e: any) => {
      const obj = e.target;
      if (!obj || obj.name === 'printArea') return;

      // Shiftキーで15度単位にスナップ（Adobe風）
      if (e.e && e.e.shiftKey) {
        const snapAngle = 15; // 15度単位
        obj.angle = Math.round(obj.angle / snapAngle) * snapAngle;
      }

      obj.setCoords();
      const objBounds = obj.getBoundingRect(true);
      
      // 範囲外になった場合、位置を調整して範囲内に収める
      if (objBounds.left < printArea.left) {
        obj.left += (printArea.left - objBounds.left);
      }
      if (objBounds.top < printArea.top) {
        obj.top += (printArea.top - objBounds.top);
      }
      if (objBounds.left + objBounds.width > printArea.left + printArea.width) {
        obj.left -= ((objBounds.left + objBounds.width) - (printArea.left + printArea.width));
      }
      if (objBounds.top + objBounds.height > printArea.top + printArea.height) {
        obj.top -= ((objBounds.top + objBounds.height) - (printArea.top + printArea.height));
      }
    });

    // イベントリスナー設定
    
    // プリント範囲外のタッチを完全にブロック
    let isOutsideInteraction = false;
    
    canvas.on("mouse:down:before", (e: any) => {
      if (!e.e) return;
      
      const pointer = canvas.getPointer(e.e);
      
      // プリント範囲外かチェック
      const isOutsidePrintArea = 
        pointer.x < printArea.left ||
        pointer.x > printArea.left + printArea.width ||
        pointer.y < printArea.top ||
        pointer.y > printArea.top + printArea.height;
      
      if (isOutsidePrintArea && window.innerWidth < 768) {
        isOutsideInteraction = true;
        // イベントを完全にキャンセル
        e.e.preventDefault();
        e.e.stopPropagation();
        
        if (canvasRef.current) {
          canvasRef.current.style.touchAction = "pan-y";
        }
        
        // 選択を無効化
        canvas.selection = false;
        canvas.discardActiveObject();
        canvas.renderAll();
      } else {
        isOutsideInteraction = false;
        canvas.selection = true;
      }
    });
    
    // マウス/タッチダウン時の処理
    canvas.on("mouse:down", (e: any) => {
      if (isOutsideInteraction) {
        // 範囲外インタラクション中は何もしない
        return false;
      }
      
      const pointer = canvas.getPointer(e.e);
      const clickedOnObject = canvas.findTarget(e.e, false);
      
      // オブジェクトをクリックしていない場合
      if (!clickedOnObject || clickedOnObject.name === 'printArea') {
        // プリント範囲外をクリック/タッチした場合
        const isOutsidePrintArea = 
          pointer.x < printArea.left ||
          pointer.x > printArea.left + printArea.width ||
          pointer.y < printArea.top ||
          pointer.y > printArea.top + printArea.height;
        
        if (isOutsidePrintArea && window.innerWidth < 768) {
          // モバイルでプリント範囲外の場合、スクロールを許可
          if (canvasRef.current) {
            canvasRef.current.style.touchAction = "pan-y";
          }
          // 選択をクリア
          canvas.discardActiveObject();
          canvas.renderAll();
          return false;
        }
      }
    });
    
    // マウスアップ時にフラグをリセット
    canvas.on("mouse:up", () => {
      if (isOutsideInteraction) {
        isOutsideInteraction = false;
        canvas.selection = true;
      }
    });
    
    canvas.on("selection:created", (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
      // オブジェクト選択時は通常のタッチ操作を許可
      if (canvasRef.current) {
        canvasRef.current.style.touchAction = "none";
      }
    });
    canvas.on("selection:updated", (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
      if (canvasRef.current) {
        canvasRef.current.style.touchAction = "none";
      }
    });
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      // オブジェクト未選択時はスクロールを許可（モバイルのみ）
      if (canvasRef.current && window.innerWidth < 768) {
        canvasRef.current.style.touchAction = "pan-y";
      }
    });
    canvas.on("object:modified", (e: any) => {
      const obj = e.target;
      
      // Shift移動の記録をクリア
      if (obj && obj._movingStart) {
        obj._movingStart = null;
      }
      
      // テキストオブジェクトの場合、フォントサイズを自動調整
      if (obj && obj.type === "i-text") {
        adjustTextSizeToFitPrintArea(obj);
      }
      
      // 操作完了後に範囲チェック - はみ出していたら範囲内に収める
      if (obj && obj.name !== 'printArea') {
        obj.setCoords();
        const objBounds = obj.getBoundingRect(true);
        
        let needsAdjustment = false;
        
        // 範囲外チェック
        if (objBounds.left < printArea.left ||
            objBounds.top < printArea.top ||
            objBounds.left + objBounds.width > printArea.left + printArea.width ||
            objBounds.top + objBounds.height > printArea.top + printArea.height) {
          
          // オブジェクトが大きすぎる場合はスケールを縮小
          const maxWidth = printArea.width;
          const maxHeight = printArea.height;
          
          if (objBounds.width > maxWidth || objBounds.height > maxHeight) {
            const scaleX = maxWidth / objBounds.width;
            const scaleY = maxHeight / objBounds.height;
            const scale = Math.min(scaleX, scaleY); // 100%（ぴったり）
            
            obj.scaleX! *= scale;
            obj.scaleY! *= scale;
            needsAdjustment = true;
          }
          
          // 位置を調整
          obj.setCoords();
          const newBounds = obj.getBoundingRect(true);
          
          if (newBounds.left < printArea.left) {
            obj.left += (printArea.left - newBounds.left);
            needsAdjustment = true;
          }
          if (newBounds.top < printArea.top) {
            obj.top += (printArea.top - newBounds.top);
            needsAdjustment = true;
          }
          if (newBounds.left + newBounds.width > printArea.left + printArea.width) {
            obj.left -= ((newBounds.left + newBounds.width) - (printArea.left + printArea.width));
            needsAdjustment = true;
          }
          if (newBounds.top + newBounds.height > printArea.top + printArea.height) {
            obj.top -= ((newBounds.top + newBounds.height) - (printArea.top + printArea.height));
            needsAdjustment = true;
          }
          
          if (needsAdjustment) {
            obj.setCoords();
            canvas.renderAll();
          }
        }
      }
      
      saveHistory();
    });
    canvas.on("object:added", () => saveHistory());
    canvas.on("object:removed", () => saveHistory());

    // テキストオブジェクトの選択イベント
    canvas.on("selection:created", (e: any) => {
      const obj = e.selected[0];
      setSelectedObject(obj);
      // テキストオブジェクトが選択されたら入力フィールドに表示
      if (obj && obj.type === "i-text") {
        setTextInput(obj.text || "");
        firstTextObjectRef.current = obj;
      }
    });

    canvas.on("selection:updated", (e: any) => {
      const obj = e.selected[0];
      setSelectedObject(obj);
      // テキストオブジェクトが選択されたら入力フィールドに表示
      if (obj && obj.type === "i-text") {
        setTextInput(obj.text || "");
        firstTextObjectRef.current = obj;
      } else {
        setTextInput("");
        firstTextObjectRef.current = null;
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      setTextInput("");
      firstTextObjectRef.current = null;
    });

    // キーボードイベント（Delete/Backspaceキーで削除）
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + Z: Redo（やり直し）
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (cmdOrCtrl && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleRedo();
        return;
      }
      
      // Cmd/Ctrl + Z: Undo（元に戻す）
      if (cmdOrCtrl && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }
      
      // Delete/Backspace: 削除
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        const activeObject = canvas.getActiveObject();
        // プリント範囲の枠は削除しない
        if (activeObject && activeObject.name !== 'printArea') {
          e.preventDefault(); // デフォルトの動作を防ぐ
          
          // テキストオブジェクトの参照をクリア
          if (firstTextObjectRef.current === activeObject) {
            firstTextObjectRef.current = null;
            setTextInput("");
          }
          
          // オブジェクトを削除して初期状態に完全リセット
          canvas.remove(activeObject);
          canvas.renderAll();
          setSelectedObject(null);
          setIsLoading(false);
          
          // 履歴を初期状態にリセット（やり直しを無効化）
          const initialState = historyRef.current[0];
          historyRef.current = [initialState];
          historyStepRef.current = 0;
          updateHistoryButtons();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      // タッチイベントリスナーを削除（captureフェーズで追加したので、削除もcaptureで）
      if (fabricCanvasRef.current && (fabricCanvasRef.current as any)._touchHandlers) {
        const handlers = (fabricCanvasRef.current as any)._touchHandlers;
        handlers.element.removeEventListener('touchstart', handlers.start, { capture: true });
        handlers.element.removeEventListener('touchmove', handlers.move, { capture: true });
        handlers.element.removeEventListener('touchend', handlers.end, { capture: true });
      }
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [fabricLoaded]);

  // 本体カラー変更時に背景画像と点線の色だけを更新（カスタマイズ内容を保持）
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricLoaded || typeof (window as any).fabric === 'undefined') {
      return;
    }

    const fabricLib = (window as any).fabric;
    const canvas = fabricCanvasRef.current;
    const mockupImageUrl = getCurrentMockupImage();

    // 背景画像を更新
    fabricLib.Image.fromURL(mockupImageUrl, (img: any) => {
      if (!img || !img.width) return;

      const scaleX = canvas.width! / (img.width || 1);
      const scaleY = canvas.height! / (img.height || 1);
      const scale = Math.min(scaleX, scaleY) * 0.95;
      
      img.scale(scale);
      img.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });

      img.setControlsVisibility({
        deleteControl: false,
      });

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    }, { crossOrigin: "anonymous" });

    // 点線の色を更新
    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (obj.name === 'printArea') {
        const colorName = selectedColor.name.toLowerCase();
        const newColor = (colorName.includes('ブラック') || colorName.includes('black')) 
          ? 'white' 
          : '#000000';
        obj.set('stroke', newColor);
        canvas.renderAll();
      }
    });
  }, [selectedColor, fabricLoaded, getCurrentMockupImage]);

  // ========== ステップ3: 履歴管理関数 ==========
  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;
    
    // 履歴が初期化されていない場合は保存しない
    if (!isHistoryInitializedRef.current) {
      console.log('履歴未初期化のため保存をスキップ');
      return;
    }

    // undo/redo実行中は保存しない
    if (isLoadingHistoryRef.current) {
      console.log('履歴読み込み中のため保存をスキップ');
      return;
    }

    const json = JSON.stringify(fabricCanvasRef.current.toJSON(['selectable', 'evented', 'name']));
    historyRef.current = historyRef.current.slice(0, historyStepRef.current + 1);
    historyRef.current.push(json);
    historyStepRef.current = historyRef.current.length - 1;
    
    console.log('履歴保存:', {
      step: historyStepRef.current,
      total: historyRef.current.length
    });
    
    // 履歴が50を超えた場合、初期状態（インデックス0）を保護して古いものを削除
    if (historyRef.current.length > 50) {
      // 初期状態を保持したまま、古い履歴を削除
      historyRef.current.splice(1, 1); // インデックス1の要素を削除
      historyStepRef.current--;
    }
    
    updateHistoryButtons();
  };

  const updateHistoryButtons = () => {
    const newCanUndo = historyStepRef.current > 0;
    const newCanRedo = historyStepRef.current < historyRef.current.length - 1;
    
    console.log('履歴更新:', {
      current: historyStepRef.current,
      total: historyRef.current.length,
      canUndo: newCanUndo,
      canRedo: newCanRedo
    });
    
    setCanUndo(newCanUndo);
    setCanRedo(newCanRedo);
  };

  const handleUndo = () => {
    if (historyStepRef.current > 0 && fabricCanvasRef.current) {
      isLoadingHistoryRef.current = true; // 履歴読み込み開始
      historyStepRef.current--;
      const json = historyRef.current[historyStepRef.current];
      
      // 初回テキストオブジェクトをクリア（履歴を戻すため）
      firstTextObjectRef.current = null;
      setTextInput("");
      
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current?.discardActiveObject(); // 選択を解除
        fabricCanvasRef.current?.renderAll();
        
        // 次のフレームで設定を再適用（確実に適用されるように）
        requestAnimationFrame(() => {
          // 復元後、背景画像とprintAreaの設定を再適用（触れないようにする）
          const backgroundImage = fabricCanvasRef.current?.backgroundImage;
          if (backgroundImage) {
            (backgroundImage as any).set({
              selectable: false,
              evented: false,
            });
            (backgroundImage as any).setControlsVisibility({
              deleteControl: false,
            });
          }
          
          const objects = fabricCanvasRef.current?.getObjects();
          objects?.forEach((obj: any) => {
            if (obj.name === 'printArea') {
              obj.set({
                selectable: false,
                evented: false,
              });
              obj.setControlsVisibility({
                deleteControl: false,
              });
            }
          });
          
          fabricCanvasRef.current?.renderAll();
        });
        
        setSelectedObject(null); // Reactの状態も更新
        
        // 初期状態（ステップ0）に戻った場合、履歴をリセット
        if (historyStepRef.current === 0) {
          const initialState = historyRef.current[0];
          historyRef.current = [initialState];
          historyStepRef.current = 0;
        }
        
        updateHistoryButtons(); // ボタンの状態を更新
        isLoadingHistoryRef.current = false; // 履歴読み込み完了
      });
    }
  };

  const handleRedo = () => {
    if (historyStepRef.current < historyRef.current.length - 1 && fabricCanvasRef.current) {
      isLoadingHistoryRef.current = true; // 履歴読み込み開始
      historyStepRef.current++;
      const json = historyRef.current[historyStepRef.current];
      
      // 初回テキストオブジェクトをクリア（履歴を進めるため）
      firstTextObjectRef.current = null;
      setTextInput("");
      
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current?.discardActiveObject(); // 選択を解除
        fabricCanvasRef.current?.renderAll();
        
        // 次のフレームで設定を再適用（確実に適用されるように）
        requestAnimationFrame(() => {
          // 復元後、背景画像とprintAreaの設定を再適用（触れないようにする）
          const backgroundImage = fabricCanvasRef.current?.backgroundImage;
          if (backgroundImage) {
            (backgroundImage as any).set({
              selectable: false,
              evented: false,
            });
            (backgroundImage as any).setControlsVisibility({
              deleteControl: false,
            });
          }
          
          const objects = fabricCanvasRef.current?.getObjects();
          objects?.forEach((obj: any) => {
            if (obj.name === 'printArea') {
              obj.set({
                selectable: false,
                evented: false,
              });
              obj.setControlsVisibility({
                deleteControl: false,
              });
            }
          });
          
          fabricCanvasRef.current?.renderAll();
        });
        
        setSelectedObject(null); // Reactの状態も更新
        updateHistoryButtons(); // ボタンの状態を更新
        isLoadingHistoryRef.current = false; // 履歴読み込み完了
      });
    }
  };

  // 画像品質チェック関数
  const checkImageQuality = (file: File, width: number, height: number): { isGood: boolean; message: string } => {
    // 推奨ピクセルサイズ（300 DPI）
    const recommendedWidth = 2953;
    const recommendedHeight = 3685;
    
    // 最低ピクセルサイズ（150 DPI）
    const minWidth = 1182;
    const minHeight = 1475;
    
    // ファイルサイズチェック（100MB以上）
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 100) {
      return {
        isGood: false,
        message: `[WARNING] ファイルサイズが大きすぎます（${fileSizeMB.toFixed(1)}MB）\n100MB以下を推奨します。`
      };
    }
    
    // 画質チェック
    if (width < minWidth || height < minHeight) {
      return {
        isGood: false,
        message: `[WARNING] 画像サイズが小さすぎます\n\n現在: ${width} × ${height}px\n最低: ${minWidth} × ${minHeight}px (150 DPI)\n推奨: ${recommendedWidth} × ${recommendedHeight}px (300 DPI)\n\n印刷時に画質が粗くなる可能性があります。`
      };
    } else if (width < recommendedWidth || height < recommendedHeight) {
      return {
        isGood: true,
        message: `[INFO] 画像サイズは使用可能ですが、より高画質をお求めの場合は大きな画像を推奨します\n\n現在: ${width} × ${height}px\n推奨: ${recommendedWidth} × ${recommendedHeight}px (300 DPI)`
      };
    } else {
      return {
        isGood: true,
        message: `[SUCCESS] 高品質な画像です！\n\n${width} × ${height}px\n印刷に最適なサイズです。`
      };
    }
  };

  // 著作権モーダルの同意後に画像をアップロード
  const processImageUpload = (file: File, event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // 画像サイズを取得して品質チェック
      const img = new Image();
      img.onload = () => {
        const qualityCheck = checkImageQuality(file, img.width, img.height);
        setImageQualityWarning(qualityCheck.message);
        
        // 最低品質を満たしていない場合は確認
        if (!qualityCheck.isGood) {
          const proceed = confirm(`${qualityCheck.message}\n\nそれでもこの画像を使用しますか？`);
          if (!proceed) {
            setIsLoading(false);
            setImageQualityWarning(null);
            event.target.value = '';
            return;
          }
        }
        
        // キャンバスに画像を追加
        setUploadedImages(prev => [...prev, imageUrl]);
        
        if (fabricCanvasRef.current && typeof (window as any).fabric !== 'undefined') {
          const fabricLib = (window as any).fabric;
          fabricLib.Image.fromURL(imageUrl, (fabricImg: any) => {
            const canvas = fabricCanvasRef.current;
            
            // プリント範囲を取得
            const printArea = getPrintAreaInPixels(canvas.width!);
            
            // プリント範囲の80%に収まるようにスケール（余裕を持たせる）
            const maxWidth = printArea.width * 0.8;
            const maxHeight = printArea.height * 0.8;
            const scale = Math.min(
              maxWidth / (fabricImg.width || 1),
              maxHeight / (fabricImg.height || 1),
              1
            );
            
            fabricImg.scale(scale);
            
            // スマホではコントロール非表示（Instagram風）
            const isMobileView = window.innerWidth < 768;
            fabricImg.set({
              left: printArea.left + printArea.width / 2,
              top: printArea.top + printArea.height / 2,
              originX: "center",
              originY: "center",
              selectable: true,
              hasControls: !isMobileView, // スマホではコントロール非表示
              hasBorders: !isMobileView,   // スマホでは枠線も非表示
            });
            
            // 元の高解像度画像データを保存（重要！）
            (fabricImg as any).originalImageData = imageUrl; // 元のDataURL
            (fabricImg as any).originalWidth = img.width; // 元の幅
            (fabricImg as any).originalHeight = img.height; // 元の高さ
            
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            
            setIsLoading(false);
            event.target.value = '';
          });
        } else {
          setIsLoading(false);
          event.target.value = '';
        }
      };
      img.src = imageUrl;
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      event.target.value = '';
    };
    
    reader.readAsDataURL(file);
  };

  // ========== ステップ4: 画像アップロード機能 ==========
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setIsLoading(false);
      return;
    }
    
    const file = files[0]; // 最初のファイルのみ処理
    
    // 画像ファイルかチェック
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} は画像ファイルではありません（PNG, JPG, GIFなどを使用してください）`);
      event.target.value = '';
      return;
    }
    
    // 初回アップロード時は著作権モーダルを表示
    if (!copyrightAgreed) {
      pendingImageRef.current = file;
      setShowCopyrightModal(true);
      return;
    }
    
    // 著作権に同意済みの場合は直接アップロード
    processImageUpload(file, event);
  };
  
  // 著作権同意後の処理
  const handleCopyrightAgree = () => {
    setCopyrightAgreed(true);
    setShowCopyrightModal(false);
    
    if (pendingImageRef.current && fileInputRef.current) {
      // ダミーイベントを作成
      const dummyEvent = {
        target: fileInputRef.current,
        currentTarget: fileInputRef.current
      } as React.ChangeEvent<HTMLInputElement>;
      
      processImageUpload(pendingImageRef.current, dummyEvent);
      pendingImageRef.current = null;
    }
  };


  // ========== ステップ5: AI画像生成機能 ==========
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      alert("生成したい画像の説明を入力してください");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          width: 1024,
          height: 1024,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setLastAIPrompt(aiPrompt);

        // 生成された画像をキャンバスに追加
        if (fabricCanvasRef.current && typeof (window as any).fabric !== 'undefined') {
          const fabricLib = (window as any).fabric;
          fabricLib.Image.fromURL(data.imageUrl, (img) => {
            const canvas = fabricCanvasRef.current;
            
            // プリント範囲を取得
            const printArea = getPrintAreaInPixels(canvas.width!);
            
            // プリント範囲の80%に収まるようにスケール
            const maxWidth = printArea.width * 0.8;
            const maxHeight = printArea.height * 0.8;
            const scale = Math.min(
              maxWidth / (img.width || 1),
              maxHeight / (img.height || 1),
              1
            );

            img.scale(scale);
            
            // スマホではコントロール非表示（Instagram風）
            const isMobileView = window.innerWidth < 768;
            img.set({
              left: printArea.left + printArea.width / 2,
              top: printArea.top + printArea.height / 2,
              originX: "center",
              originY: "center",
              selectable: true,
              hasControls: !isMobileView, // スマホではコントロール非表示
              hasBorders: !isMobileView,   // スマホでは枠線も非表示
            });

            // 元の高解像度画像データを保存（AI生成画像）
            (img as any).originalImageData = data.imageUrl; // 元のURL
            (img as any).originalWidth = img.width; // 元の幅
            (img as any).originalHeight = img.height; // 元の高さ

            fabricCanvasRef.current?.add(img);
            fabricCanvasRef.current?.setActiveObject(img);
            fabricCanvasRef.current?.renderAll();
          }, { crossOrigin: "anonymous" });
        }

        setAiPrompt("");
      } else {
        alert(data.error || "AI画像生成に失敗しました");
      }
    } catch (error) {
      console.error("AI生成エラー:", error);
      alert("AI画像生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  // ========== ステップ6: テキスト追加機能 ==========
  // テキストがプリント範囲を超えていないかチェックして自動調整
  const adjustTextSizeToFitPrintArea = (textObj: any) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const printArea = getPrintAreaInPixels(canvas.width!);
    
    // テキストの境界ボックスを取得
    textObj.setCoords();
    const textBounds = textObj.getBoundingRect(true);
    
    // プリント範囲を超えているかチェック
    const exceedsWidth = textBounds.width > printArea.width;
    const exceedsHeight = textBounds.height > printArea.height;
    
    if (exceedsWidth || exceedsHeight) {
      // 縮小率を計算（余裕を持たせるために95%）
      const scaleX = printArea.width / textBounds.width;
      const scaleY = printArea.height / textBounds.height;
      const scale = Math.min(scaleX, scaleY) * 0.95;
      
      // フォントサイズを調整
      const currentFontSize = textObj.fontSize;
      const newFontSize = Math.floor(currentFontSize * scale);
      
      textObj.set({ fontSize: newFontSize });
      setFontSize(newFontSize);
      
      // 位置を再調整（中央に配置）
      textObj.set({
        left: printArea.left + printArea.width / 2,
        top: printArea.top + printArea.height / 2,
      });
      
      textObj.setCoords();
      canvas.renderAll();
    }
  };

  // リアルタイムテキスト更新
  const handleTextInputChange = (value: string) => {
    setTextInput(value);
    
    if (!fabricCanvasRef.current || typeof (window as any).fabric === 'undefined') return;
    
    const fabricLib = (window as any).fabric;
    const canvas = fabricCanvasRef.current;
    
    // 選択中のテキストオブジェクトが存在する場合は更新
    if (firstTextObjectRef.current && canvas.contains(firstTextObjectRef.current)) {
      firstTextObjectRef.current.set({ text: value });
      
      // プリント範囲を超えていないかチェック
      if (value.trim()) {
        adjustTextSizeToFitPrintArea(firstTextObjectRef.current);
      }
      
      canvas.renderAll();
      if (value.trim()) {
        saveHistory();
      }
    } 
    // 新規テキストオブジェクトを作成（初回のみ）
    else if (value.trim() && !firstTextObjectRef.current) {
      const printArea = getPrintAreaInPixels(canvas.width!);
      
      const text = new fabricLib.IText(value, {
        left: printArea.left + printArea.width / 2,
        top: printArea.top + printArea.height / 2,
        originX: "center",
        originY: "center",
        fill: textColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
      
      canvas.add(text);
      canvas.setActiveObject(text);
      
      // プリント範囲を超えていないかチェック
      adjustTextSizeToFitPrintArea(text);
      
      canvas.renderAll();
      firstTextObjectRef.current = text;
      saveHistory();
    }
  };

  const handleAddText = () => {
    if (!textInput.trim() || !fabricCanvasRef.current || typeof (window as any).fabric === 'undefined') {
      alert("テキストを入力してください");
      return;
    }

    const fabricLib = (window as any).fabric;
    const canvas = fabricCanvasRef.current;
    
    // プリント範囲の中央に配置
    const printArea = getPrintAreaInPixels(canvas.width!);
    
    const text = new fabricLib.IText(textInput, {
      left: printArea.left + printArea.width / 2,
      top: printArea.top + printArea.height / 2,
      originX: "center",
      originY: "center",
      fill: textColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    
    // 新しいテキストを追加する場合、初回オブジェクトをリセット
    firstTextObjectRef.current = null;
    setTextInput("");
    saveHistory();
  };

  const handleChangeTextColor = (color: string) => {
    setTextColor(color);
    if (selectedObject && selectedObject.type === "i-text") {
      (selectedObject as any).set({ fill: color });
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    }
  };

  const handleChangeFontSize = (size: number) => {
    setFontSize(size);
    if (selectedObject && selectedObject.type === "i-text") {
      (selectedObject as any).set({ fontSize: size });
      
      // プリント範囲を超えないように自動調整
      adjustTextSizeToFitPrintArea(selectedObject);
      
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    }
  };

  const handleChangeFontFamily = (font: string) => {
    setFontFamily(font);
    if (selectedObject && selectedObject.type === "i-text") {
      (selectedObject as any).set({ fontFamily: font });
      
      // フォント変更でサイズが変わる可能性があるため、プリント範囲チェック
      adjustTextSizeToFitPrintArea(selectedObject);
      
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    }
  };

  // フォントリストをフィルタリング
  const getFilteredFonts = () => {
    return FONT_LIST.filter(font => font.type === activeFontTab);
  };

  // ========== Cloudinaryに直接アップロード（お客さんの生データをそのまま保存）==========
  const uploadToSupabaseDirect = async (imageDataUrl: string): Promise<string> => {
    try {
      console.log('Supabase直接アップロード開始...');
      
      // ステップ1: Data URLをBlobに変換
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      const fileSizeMB = Math.round(blob.size / 1024 / 1024 * 100) / 100;
      console.log('アップロードするファイルサイズ:', fileSizeMB, 'MB');

      // ステップ2: ファイル名を生成（ユニークID + タイムスタンプ）
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `design-${timestamp}-${randomId}.png`;

      // ステップ3: Supabaseにアップロード
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = (window as any).ENV?.SUPABASE_URL || '';
      const supabaseKey = (window as any).ENV?.SUPABASE_ANON_KEY || '';
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase設定が見つかりません');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      console.log('Supabaseにアップロード中:', fileName);

      const { data, error } = await supabase.storage
        .from('printaize')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabaseアップロードエラー:', error);
        throw new Error(`Supabaseへのアップロードに失敗しました: ${error.message}`);
      }

      // ステップ4: 公開URLを取得
      const { data: urlData } = supabase.storage
        .from('printaize')
        .getPublicUrl(data.path);

      console.log('Supabase直接アップロード成功:', urlData.publicUrl);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Supabase直接アップロードエラー:", error);
      throw error;
    }
  };

  // ========== 高解像度出力生成（元の画像データを使用）==========
  const generateHighResolutionOutput = async (canvas: any, printArea: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const fabricLib = (window as any).fabric;
        if (!fabricLib) {
          console.error('Fabric.js not loaded');
          reject(new Error('Fabric.js not loaded'));
          return;
        }

        // 目標サイズ: 2953px × 3685px（プリント範囲 250mm × 312mm @ 300DPI）
        // お客さんの生データを最大限活用するため、高解像度で出力
        // Cloudinary直接アップロードでファイルサイズ制限なし
        const targetWidth = 2953;
        const targetHeight = 3685;

        // スケール比率を計算
        const scaleRatio = targetWidth / printArea.width;

        console.log('高解像度出力開始:', { targetWidth, targetHeight, scaleRatio });

        // オフスクリーンキャンバスを作成
        const offscreenCanvas = new fabricLib.Canvas(null, {
          width: targetWidth,
          height: targetHeight,
          backgroundColor: 'transparent',
        });

        // 元のキャンバスのオブジェクトを高解像度で再構成
        const objects = canvas.getObjects();
        const filteredObjects = objects.filter((obj: any) => obj.name !== 'printArea');
        const totalObjects = filteredObjects.length;

        console.log('処理するオブジェクト数:', totalObjects);

        if (totalObjects === 0) {
          // オブジェクトがない場合は空の透過画像を返す
          const dataURL = offscreenCanvas.toDataURL({ format: 'png', quality: 1 });
          resolve(dataURL);
          return;
        }

        // オブジェクトを格納する配列（z-indexを保持）
        const loadedObjects: Array<{ index: number; fabricObj: any }> = [];
        let loadedCount = 0;

        // タイムアウト処理（30秒）
        const timeout = setTimeout(() => {
          console.error('高解像度出力タイムアウト');
          reject(new Error('高解像度出力がタイムアウトしました'));
        }, 30000);

        const checkComplete = () => {
          loadedCount++;
          console.log(`オブジェクト読み込み: ${loadedCount}/${totalObjects}`);
          
          if (loadedCount === totalObjects) {
            clearTimeout(timeout);
            try {
              // z-index（元の順序）でソートしてキャンバスに追加
              console.log('全オブジェクト読み込み完了。loadedObjects数:', loadedObjects.length);
              loadedObjects.sort((a, b) => a.index - b.index);
              loadedObjects.forEach((item, i) => {
                console.log(`キャンバスに追加 [${i}]:`, item.fabricObj.type, 'index:', item.index);
                offscreenCanvas.add(item.fabricObj);
              });
              
              offscreenCanvas.renderAll();
              
              // PNG形式で出力（背景透過を維持）
              const dataURL = offscreenCanvas.toDataURL({ 
                format: 'png',
                multiplier: 1
              });
              
              const sizeKB = Math.round(dataURL.length / 1024);
              const sizeMB = (sizeKB / 1024).toFixed(2);
              console.log('高解像度出力完了（PNG透過、300DPI） - サイズ:', sizeKB, 'KB (', sizeMB, 'MB)');
              console.log('💡 Supabase直接アップロードを使用するため、ファイルサイズ制限なし');
              
              resolve(dataURL);
            } catch (error) {
              console.error('Canvas renderエラー:', error);
              reject(error);
            }
          }
        };

        filteredObjects.forEach((obj: any, index: number) => {

          try {
            // プリント範囲の座標系に変換
            const relativeLeft = (obj.left - printArea.left) * scaleRatio;
            const relativeTop = (obj.top - printArea.top) * scaleRatio;

            if (obj.type === 'image' && (obj as any).originalImageData) {
              // 元の高解像度画像を使用
              console.log('画像読み込み開始:', (obj as any).originalImageData.substring(0, 50));
              
              fabricLib.Image.fromURL(
                (obj as any).originalImageData,
                (hdImg: any) => {
                  if (!hdImg) {
                    console.error('画像読み込み失敗');
                    // 失敗してもカウントを進める
                    checkComplete();
                    return;
                  }

                  try {
                    // 元の画像サイズを基準にスケールを計算
                    const originalWidth = (obj as any).originalWidth;
                    const originalHeight = (obj as any).originalHeight;
                    
                    if (!originalWidth || !originalHeight) {
                      console.warn('originalWidth/Height が未設定。現在のサイズを使用します。');
                      // フォールバック: 現在のサイズを使用
                      const newScaleX = obj.scaleX * scaleRatio;
                      const newScaleY = obj.scaleY * scaleRatio;
                      
                      hdImg.set({
                        left: relativeLeft,
                        top: relativeTop,
                        scaleX: newScaleX,
                        scaleY: newScaleY,
                        angle: obj.angle,
                      });
                      
                      loadedObjects.push({ index, fabricObj: hdImg });
                      checkComplete();
                      return;
                    }
                    
                    const originalScale = (obj.width * obj.scaleX) / originalWidth;
                    const newScale = originalScale * scaleRatio;

                    hdImg.set({
                      left: relativeLeft,
                      top: relativeTop,
                      scaleX: newScale,
                      scaleY: newScale,
                      angle: obj.angle,
                      originX: obj.originX,
                      originY: obj.originY,
                      flipX: obj.flipX,
                      flipY: obj.flipY,
                    });

                    // フィルターも適用
                    if (obj.filters && obj.filters.length > 0) {
                      hdImg.filters = obj.filters.map((filter: any) => Object.assign(Object.create(Object.getPrototypeOf(filter)), filter));
                      hdImg.applyFilters();
                    }

                    // z-indexを保持して配列に追加
                    console.log('画像をloadedObjectsに追加:', index);
                    loadedObjects.push({ index, fabricObj: hdImg });
                    checkComplete();
                  } catch (error) {
                    console.error('画像設定エラー:', error);
                    // エラーでもカウントを進める
                    checkComplete();
                  }
                },
                { crossOrigin: 'anonymous' }
              );
            } else if (obj.type === 'text' || obj.type === 'textbox' || obj.type === 'i-text') {
              // テキストを高解像度で再構成
              const hdText = new fabricLib.Text(obj.text, {
                left: relativeLeft,
                top: relativeTop,
                fontSize: obj.fontSize * scaleRatio,
                fontFamily: obj.fontFamily,
                fill: obj.fill,
                angle: obj.angle,
                originX: obj.originX,
                originY: obj.originY,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
              });

              // z-indexを保持して配列に追加
              console.log('テキストをloadedObjectsに追加:', index);
              loadedObjects.push({ index, fabricObj: hdText });
              checkComplete();
            } else {
              // その他のオブジェクト
              checkComplete();
            }
          } catch (error) {
            console.error('オブジェクト処理エラー:', error);
            checkComplete();
          }
        });
      } catch (error) {
        console.error('generateHighResolutionOutput エラー:', error);
        reject(error);
      }
    });
  };

  // ========== モーダル関連の関数 ==========
  
  // モーダルを開く
  const openCartModal = () => {
    // 現在選択されているカラーをモーダルのデフォルトに設定
    setModalColor(selectedColor.name);
    
    // 現在のカラー・サイズの個数が0の場合のみ1にする
    setModalQuantities(prev => {
      const currentColorQuantities = prev[selectedColor.name];
      const currentSizeQuantity = currentColorQuantities[selectedSize];
      
      if (currentSizeQuantity === 0) {
        return {
          ...prev,
          [selectedColor.name]: {
            ...currentColorQuantities,
            [selectedSize]: 1,
          }
        };
      }
      return prev;
    });
    
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeCartModal = () => {
    setIsModalOpen(false);
  };

  // モーダルから複数アイテムをカートに追加
  const handleAddToCartMultiple = async () => {
    // 全カラー・全サイズから選択された個数を取得
    const allSelections: { color: string; size: string; quantity: number }[] = [];
    
    Object.entries(modalQuantities).forEach(([color, sizes]) => {
      Object.entries(sizes).forEach(([size, quantity]) => {
        if (quantity > 0) {
          allSelections.push({ color, size, quantity });
        }
      });
    });

    if (allSelections.length === 0) {
      alert('サイズと個数を選択してください');
      return;
    }

    // モーダルを閉じて、カートに追加
    closeCartModal();
    
    // 全選択に対してカートに追加
    await handleAddToCartWithOptions(allSelections);
  };

  // 複数のサイズ・個数でカートに追加する処理
  const handleAddToCartWithOptions = async (allSelections: { color: string; size: string; quantity: number }[]) => {
    if (!fabricCanvasRef.current) return;

    setIsAddingToCart(true);
    setLoadingMessage("カートに追加中...（少しお待ちください）");
    
    try {
      // ステップ1: プリント範囲の矩形（点線）を一時的に非表示
      const canvas = fabricCanvasRef.current;
      let printAreaObj = canvas.getObjects().find((obj: any) => obj.id === 'printArea' || obj.name === 'printArea');
      
      // プリント範囲オブジェクトを非表示
      if (printAreaObj) {
        printAreaObj.visible = false;
        canvas.renderAll();
      } else {
        console.warn('プリント範囲オブジェクトが見つかりません');
      }

      // ステップ2: 通常解像度版を生成（プレビュー用）
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });

      // ステップ3: 点線を再表示
      if (printAreaObj) {
        printAreaObj.visible = true;
        canvas.renderAll();
      }
      
      // ステップ4: 高解像度出力用のプリント範囲を計算で求める
      let printArea = printAreaObj;
      if (!printArea) {
        const calculatedPrintArea = getPrintAreaInPixels(canvas.width);
        printArea = {
          left: calculatedPrintArea.left,
          top: calculatedPrintArea.top,
          width: calculatedPrintArea.width,
          height: calculatedPrintArea.height,
        };
      }

      // ステップ5: 高解像度版を生成（印刷用、プリント範囲のみ、背景透過）
      let dataURLHD: string;
      try {
        console.log('高解像度出力を生成中...');
        if (!printArea) {
          throw new Error('プリント範囲が見つかりません');
        }
        dataURLHD = await generateHighResolutionOutput(canvas, printArea);
        const sizeInKB = Math.round(dataURLHD.length * 0.75 / 1024);
        const sizeInMB = (sizeInKB / 1024).toFixed(2);
        console.log(`高解像度出力完了（PNG透過、300DPI） - サイズ: ${sizeInKB} KB ( ${sizeInMB} MB)`);
      } catch (error) {
        console.error('高解像度出力エラー:', error);
        alert(`高解像度出力に失敗しました\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
        setIsAddingToCart(false);
        setLoadingMessage("");
        return;
      }

      // ステップ5: 通常版をSupabaseに直接アップロード
      let designImageUrl: string;
      try {
        console.log('プレビュー画像を直接アップロード中...');
        designImageUrl = await uploadToSupabaseDirect(dataURL);
        console.log('プレビューアップロード成功:', designImageUrl);
      } catch (uploadError) {
        console.error('プレビューアップロードエラー:', uploadError);
        alert(`プレビュー画像のアップロードに失敗しました\n\nエラー: ${uploadError instanceof Error ? uploadError.message : '不明なエラー'}`);
        setIsAddingToCart(false);
        setLoadingMessage("");
        return;
      }

      // ステップ6: 高解像度版をSupabaseに直接アップロード
      let designImageUrlHD: string;
      try {
        console.log('高解像度画像を直接アップロード中...');
        designImageUrlHD = await uploadToSupabaseDirect(dataURLHD);
        console.log('高解像度アップロード成功:', designImageUrlHD);
      } catch (uploadError) {
        console.error('高解像度アップロードエラー:', uploadError);
        alert(`高解像度画像のアップロードに失敗しました\n\nエラー: ${uploadError instanceof Error ? uploadError.message : '不明なエラー'}`);
        setIsAddingToCart(false);
        setLoadingMessage("");
        return;
      }

      // ステップ7: design_imagesテーブルに記録（ordered: false）
      let designImageId: string | null = null;
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = (window as any).ENV?.SUPABASE_URL || '';
        const supabaseKey = (window as any).ENV?.SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          const { data: insertData, error: insertError } = await supabase
            .from('design_images')
            .insert({
              preview_url: designImageUrl,
              hd_url: designImageUrlHD,
              metadata: {
                product_id: product.id,
                selections: allSelections, // 全カラー・サイズの選択を保存
              }
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('デザイン画像の記録エラー:', insertError);
          } else if (insertData) {
            designImageId = insertData.id;
            console.log('デザイン画像を記録しました:', designImageId);
          }
        }
      } catch (dbError) {
        console.warn('データベース記録失敗（続行）:', dbError);
      }

      // ステップ8: 全てのアイテムを配列にまとめる
      const cartItems = allSelections.map(selection => ({
        variantId: getVariantId(selection.color, selection.size),
        quantity: selection.quantity,
        customAttributes: [
          { key: "design_image", value: designImageUrl },
          { key: "design_image_hd", value: designImageUrlHD },
        ],
      }));

      console.log('カートに追加するアイテム数:', cartItems.length);
      console.log('カートアイテム:', cartItems);

      // ステップ9: 全てのアイテムを1回でカートに追加
      let checkoutUrl = '';
      try {
        const response = await fetch("/api/add-to-cart-multiple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
          }),
        });

        if (!response.ok) {
          throw new Error(`カート追加APIエラー: ${response.status}`);
        }
        
        const data = await response.json();
        checkoutUrl = data.checkoutUrl;
      } catch (error) {
        console.error(`カート追加エラー:`, error);
        alert(`カートへの追加に失敗しました\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
        setIsAddingToCart(false);
        setLoadingMessage("");
        return;
      }

      // ステップ10: Shopifyチェックアウトページに移動
      if (checkoutUrl) {
        // 注文状態の更新はスキップ
        // カート追加時は ordered: false のまま
        // 30日後に自動削除される（未購入の場合）
        if (designImageId) {
          console.log('カート追加成功。design_image_id:', designImageId);
          console.log('ordered は false のまま（30日後に自動削除される）');
        }
        
        // Shopifyのチェックアウトページにリダイレクト
        window.location.href = checkoutUrl;
      } else {
        alert("チェックアウトURLの取得に失敗しました");
      }
    } catch (error) {
      console.error("カート追加エラー:", error);
      alert(`カートに追加できませんでした。\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsAddingToCart(false);
      setLoadingMessage("");
    }
  };

  // バリアントIDを取得するヘルパー関数
  const getVariantId = (color: string, size: string): string => {
    const variantMap: { [key: string]: { [size: string]: string } } = {
      'ホワイト': {
        'S': '48602131628256',
        'M': '48602131661024',
        'L': '48602131693792',
        'XL': '48602131726560',
        'XXL': '48602131759328',
      },
      'ブラック': {
        'S': '48602131792096',
        'M': '48602131824864',
        'L': '48602131857632',
        'XL': '48602131890400',
        'XXL': '48602131923168',
      },
    };

    const numericId = variantMap[color]?.[size] || '48602131661024'; // デフォルト: ホワイト/M
    return `gid://shopify/ProductVariant/${numericId}`;
  };

  // ========== ステップ8: カート追加機能（旧版・単一アイテム用） ==========
  const handleAddToCart = async () => {
    if (!fabricCanvasRef.current) return;

    setIsAddingToCart(true);
    setLoadingMessage("カートに追加中...（少しお待ちください）");
    
    try {
      // ステップ1: プリント範囲の矩形（点線）を一時的に非表示
      const canvas = fabricCanvasRef.current;
      const printAreaRect = canvas.getObjects().find((obj: any) => obj.name === 'printArea');
      if (printAreaRect) {
        printAreaRect.visible = false;
        canvas.renderAll();
      }

      // ステップ2: 通常解像度版を生成（プレビュー用 - キャンバス全体、点線なし）
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      console.log('プレビュー画像サイズ:', Math.round(dataURL.length / 1024), 'KB');

      // 点線を再表示
      if (printAreaRect) {
        printAreaRect.visible = true;
        canvas.renderAll();
      }

      // ステップ3: プリント範囲を取得
      const printArea = getPrintAreaInPixels(canvas.width!);

      // ステップ4: 高解像度版を生成（印刷用 - 元の画像データを使用）
      console.log('高解像度版を生成中...');
      const dataURLHD = await generateHighResolutionOutput(canvas, printArea);
      console.log('高解像度版生成完了。サイズ:', Math.round(dataURLHD.length / 1024), 'KB');

      // ステップ5: 通常解像度版をCloudinaryにアップロード
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: dataURL,
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        alert(uploadData.error || "画像のアップロードに失敗しました");
        return;
      }

      // ステップ6: 高解像度版をSupabaseに直接アップロード（サーバーを経由しない）
      let designImageUrlHD: string;
      try {
        console.log('高解像度画像を直接アップロード中...');
        designImageUrlHD = await uploadToSupabaseDirect(dataURLHD);
        console.log('高解像度アップロード成功:', designImageUrlHD);
      } catch (uploadError) {
        console.error('高解像度アップロードエラー:', uploadError);
        alert(`高解像度画像のアップロードに失敗しました\n\nエラー: ${uploadError instanceof Error ? uploadError.message : '不明なエラー'}`);
        return;
      }

      // アップロードされた画像のURL
      const designImageUrl = uploadData.imageUrl; // プレビュー用（キャンバス全体）
      // designImageUrlHDは上のステップ6で既に定義済み

      // ステップ7: デザイン画像をデータベースに記録
      let designImageId: string | null = null;
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = (window as any).ENV?.SUPABASE_URL || '';
        const supabaseKey = (window as any).ENV?.SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          const { data: insertData, error: insertError } = await supabase
            .from('design_images')
            .insert({
              preview_url: designImageUrl,
              hd_url: designImageUrlHD,
              metadata: {
                product_id: product.id,
                product_name: product.name,
                color: selectedColor.name,
                size: selectedSize,
              }
            })
            .select('id')
            .single();
          
          if (!insertError && insertData) {
            designImageId = insertData.id;
            console.log('デザイン画像をデータベースに記録:', designImageId);
          } else {
            console.warn('データベース記録エラー（続行）:', insertError);
          }
        }
      } catch (dbError) {
        console.warn('データベース記録失敗（続行）:', dbError);
      }

      // ステップ8: カラー×サイズに応じた商品バリアントIDを取得
      const variantMapping: { [key: string]: { [key: string]: string } } = {
        "ホワイト": {
          "S": "48602131628256",
          "M": "48602131661024",
          "L": "48602131693792",
          "XL": "48602131726560",
          "XXL": "48602131759328",
        },
        "ブラック": {
          "S": "48602131792096",
          "M": "48602131824864",
          "L": "48602131857632",
          "XL": "48602131890400",
          "XXL": "48602131923168",
        },
      };

      // 選択されたカラーとサイズから正しいバリアントIDを取得
      const colorKey = selectedColor.name.includes("ホワイト") || selectedColor.name.includes("White") ? "ホワイト" : "ブラック";
      const variantId = variantMapping[colorKey]?.[selectedSize] || "48602131661024"; // デフォルト: ホワイトM
      const productVariantId = `gid://shopify/ProductVariant/${variantId}`;

      // ステップ8: カートに追加APIを呼び出す（通常版と高解像度版の両方のURLを送信）
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designImageUrl: designImageUrl, // CloudinaryのURL（プレビュー用）
          designImageUrlHD: designImageUrlHD, // CloudinaryのURL（印刷用・高解像度）
          isAIGenerated: !!lastAIPrompt,
          aiPrompt: lastAIPrompt,
          productId: product.id,
          productName: product.name,
          color: selectedColor.name,
          size: selectedSize,
          price: product.price,
          productVariantId: productVariantId,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // ステップ9: 注文状態の更新はスキップ
        // カート追加時は ordered: false のまま
        // 30日後に自動削除される（未購入の場合）
        // 
        // 将来的にShopify Webhookを実装する場合は、
        // 注文完了時に ordered: true に更新する
        if (designImageId) {
          console.log('カート追加成功。design_image_id:', designImageId);
          console.log('ordered は false のまま（30日後に自動削除される）');
        }
        
        // Shopifyのチェックアウトページにリダイレクト
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "カートへの追加に失敗しました");
      }
    } catch (error) {
      console.error("カート追加エラー:", error);
      const errorMessage = error instanceof Error ? error.message : "不明なエラー";
      alert(`カートへの追加に失敗しました\n\nエラー: ${errorMessage}`);
    } finally {
      setIsAddingToCart(false);
      setLoadingMessage("");
    }
  };

  // ========== ステップ9: その他の機能 ==========
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleRemoveSelected = () => {
    if (fabricCanvasRef.current && selectedObject) {
      // 初回テキストオブジェクトが削除される場合、参照をクリア
      if (firstTextObjectRef.current === selectedObject) {
        firstTextObjectRef.current = null;
        setTextInput(""); // テキスト入力フィールドもクリア
      }
      
      fabricCanvasRef.current.remove(selectedObject);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
      setIsLoading(false); // ローディング状態をリセット
      
      // 履歴を初期状態にリセット（やり直しを無効化）
      const initialState = historyRef.current[0];
      historyRef.current = [initialState];
      historyStepRef.current = 0;
      updateHistoryButtons();
    }
  };

  // オブジェクト配置・整列機能
  const handleCenterVertical = () => {
    if (fabricCanvasRef.current && selectedObject) {
      const canvas = fabricCanvasRef.current;
      const printArea = getPrintAreaInPixels(canvas.width!);
      
      // プリント範囲の上下中央に配置
      selectedObject.set({
        top: printArea.top + printArea.height / 2,
        originY: 'center'
      });
      selectedObject.setCoords();
      canvas.renderAll();
      saveHistory();
    }
  };

  const handleCenterHorizontal = () => {
    if (fabricCanvasRef.current && selectedObject) {
      const canvas = fabricCanvasRef.current;
      const printArea = getPrintAreaInPixels(canvas.width!);
      
      // プリント範囲の左右中央に配置
      selectedObject.set({
        left: printArea.left + printArea.width / 2,
        originX: 'center'
      });
      selectedObject.setCoords();
      canvas.renderAll();
      saveHistory();
    }
  };

  const handleBringForward = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.bringForward(selectedObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleSendBackwards = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.sendBackwards(selectedObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleFitToPrintArea = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    const canvas = fabricCanvasRef.current;
    const printArea = getPrintAreaInPixels(canvas.width!);
    
    // プリント範囲いっぱいにスケール（元のサイズから計算）
    const scaleX = printArea.width / selectedObject.width!;
    const scaleY = printArea.height / selectedObject.height!;
    const scale = Math.min(scaleX, scaleY);
    
    // 絶対値でスケールを設定
    selectedObject.set({
      scaleX: scale,
      scaleY: scale,
      left: printArea.left + printArea.width / 2,
      top: printArea.top + printArea.height / 2,
    });
    
    selectedObject.setCoords();
    canvas.renderAll();
    saveHistory();
  };

  const handleClearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.getObjects().forEach((obj) => {
        fabricCanvasRef.current?.remove(obj);
      });
      fabricCanvasRef.current.renderAll();
      setUploadedImages([]);
      setSelectedObject(null);
      setIsLoading(false); // ローディング状態をリセット
      
      // 初回テキストオブジェクトもクリア
      firstTextObjectRef.current = null;
      setTextInput("");
      
      // 履歴を初期状態にリセット（やり直しを無効化）
      const initialState = historyRef.current[0];
      historyRef.current = [initialState];
      historyStepRef.current = 0;
      updateHistoryButtons();
    }
  };

  const handleSaveDesign = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = "tshirt-design.png";
      link.href = dataURL;
      link.click();
    }
  };

  // ========== ステップ10: UIレンダリング ==========
  
  // Fabric.jsが読み込まれるまでローディング表示
  if (!fabricLoaded) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2>⏳ 読み込み中...</h2>
        <p style={{ color: "#666", marginTop: "20px" }}>
          Fabric.jsライブラリを読み込んでいます...
        </p>
        <div style={{ 
          marginTop: "30px", 
          width: "200px", 
          height: "4px", 
          backgroundColor: "#e0e0e0", 
          margin: "30px auto",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            width: "50%",
            height: "100%",
            backgroundColor: "#5c6ac4",
            animation: "loading 1.5s ease-in-out infinite"
          }}></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "1600px",
      margin: "0 auto", 
      padding: 0 
    }}>
      {/* 商品情報バナー */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "0",
        padding: isMobile ? "20px" : "40px 30px",
        marginBottom: "0",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        flexWrap: "wrap",
        gap: "20px",
      }}>
        <div style={{ flex: "1 1 300px" }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "400",
            letterSpacing: "0.05em",
            color: "#1a1a1a",
            textTransform: "uppercase"
          }}>
            {product.name}
          </h2>
          <div style={{ 
            marginTop: "15px", 
            display: "flex", 
            gap: "20px", 
            alignItems: "center",
            fontSize: "12px",
            letterSpacing: "0.03em",
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
            }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: selectedColor.hex,
                  border: selectedColor.hex === '#FFFFFF' || selectedColor.hex === '#F5F5DC'
                    ? '1px solid #d0d0d0' 
                    : '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span style={{ color: "#4a4a4a", fontWeight: "400" }}>
                {selectedColor.name}
              </span>
            </div>
            <div style={{ 
              color: "#4a4a4a",
              fontWeight: "400",
            }}>
              サイズ: {selectedSize}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ 
            fontSize: isMobile ? "20px" : "24px", 
            fontWeight: "300", 
            letterSpacing: "0.02em",
            color: "#1a1a1a" 
          }}>
            ¥{product.price.toLocaleString()}
          </div>
          <div style={{ 
            fontSize: "11px", 
            color: "#888", 
            marginTop: "6px",
            letterSpacing: "0.05em" 
          }}>
            税込
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        gap: "0", 
        width: "100%", 
        margin: 0, 
        alignItems: "flex-start",
        backgroundColor: "white",
        overflowX: "hidden",
        overflowY: "auto",
      }}>
        {/* 左側: キャンバスエリア */}
        <div style={{ 
          flex: isMobile ? "none" : "1 1 65%", 
          minWidth: "0", 
          width: isMobile ? "100%" : "65%",
          backgroundColor: "white" 
        }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            padding: isMobile ? "10px" : "40px",
            width: "100%",
            boxSizing: "border-box",
          }}>
            <div
              style={{
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
                touchAction: isMobile ? "pan-y" : "auto",
              }}
            >
              {/* ズームボタン */}
              <button
                onClick={() => {
                  if (!fabricCanvasRef.current) return;
                  const canvas = fabricCanvasRef.current;
                  
                  if (isZoomed) {
                    // ズームアウト：元に戻す
                    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                    setIsZoomed(false);
                  } else {
                    // ズームイン：プリントエリアの中心にズーム
                    const canvasSize = 800;
                    const printArea = getPrintAreaInPixels(canvasSize);
                    
                    // プリントエリアの中心座標
                    const centerX = printArea.left + printArea.width / 2;
                    const centerY = printArea.top + printArea.height / 2;
                    
                    // ズーム倍率（スマホ: 2倍、PC: 1.7倍）
                    const zoom = isMobile ? 2.0 : 1.7;
                    
                    // ズーム後の表示位置を計算（プリントエリアが中央に来るように）
                    const point = new (window as any).fabric.Point(centerX, centerY);
                    canvas.zoomToPoint(point, zoom);
                    
                    setIsZoomed(true);
                  }
                  canvas.renderAll();
                }}
                style={{
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
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                }}
                title={isZoomed ? "元のサイズに戻す" : "プリントエリアを拡大"}
              >
                <Icon type={isZoomed ? "zoomIn" : "zoomOut"} size={20} color="#667eea" />
              </button>
              
              <canvas 
                ref={canvasRef} 
                style={{ 
                  display: "block",
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  touchAction: isMobile ? "pan-y" : "none",
                }} 
              />
            </div>

            {/* オブジェクト操作コントロール */}
            <div style={{ 
              marginTop: "15px", 
              display: "flex", 
              flexWrap: "wrap",
              gap: isMobile ? "8px" : "10px", 
              justifyContent: "center",
              width: "100%",
              maxWidth: isMobile ? "100%" : "800px"
            }}>
              {/* 履歴 */}
              <button 
                onClick={handleUndo} 
                disabled={!canUndo} 
                style={{
                  ...historyButtonStyle(canUndo),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="元に戻す (Cmd/Ctrl+Z)"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>元に戻す</span>
              </button>
              <button 
                onClick={handleRedo} 
                disabled={!canRedo} 
                style={{
                  ...historyButtonStyle(canRedo),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="やり直し (Cmd/Ctrl+Shift+Z)"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>やり直し</span>
              </button>
              
              {/* 配置 */}
              <button 
                onClick={handleCenterVertical} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="上下中央"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7-7 7 7M5 12l7 7 7-7" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>上下中央</span>
              </button>
              <button 
                onClick={handleCenterHorizontal} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="左右中央"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l-7 7 7 7M12 5l7 7-7 7" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>左右中央</span>
              </button>
              
              {/* 重なり順 */}
              <button 
                onClick={handleBringForward} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="手前に移動"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="13" width="10" height="10" rx="2" ry="2" opacity="0.5" />
                  <rect x="5" y="1" width="10" height="10" rx="2" ry="2" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>手前へ</span>
              </button>
              <button 
                onClick={handleSendBackwards} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="奥に移動"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="1" width="10" height="10" rx="2" ry="2" opacity="0.5" />
                  <rect x="9" y="13" width="10" height="10" rx="2" ry="2" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>奥へ</span>
              </button>
              
              {/* その他 */}
              <button 
                onClick={handleFitToPrintArea} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px"
                }}
                title="印刷面を覆う"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>プリント範囲最大</span>
              </button>
              <button 
                onClick={handleRemoveSelected} 
                disabled={!selectedObject}
                style={{
                  ...historyButtonStyle(!!selectedObject),
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: isMobile ? "60px" : "70px",
                  backgroundColor: selectedObject ? "#e74c3c" : "#cccccc",
                }}
                title="削除 (Delete/Backspace)"
              >
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span style={{ fontSize: isMobile ? "9px" : "10px" }}>削除</span>
              </button>
            </div>

            {/* 操作説明 */}
            <div style={{ 
              ...infoBoxStyle, 
              width: "100%", 
              maxWidth: isMobile ? "100%" : "800px", 
              backgroundColor: "#ffffff",
              marginTop: isMobile ? "15px" : "20px",
              padding: isMobile ? "15px" : "20px"
            }}>
              <h3 style={{ 
                marginTop: 0, 
                fontSize: isMobile ? "14px" : "16px" 
              }}>
                📝 使い方
              </h3>
              <ul style={{ 
                marginBottom: 0, 
                lineHeight: 1.6, 
                paddingLeft: isMobile ? "18px" : "20px", 
                fontSize: isMobile ? "12px" : "13px" 
              }}>
                <li>🤖 AIに画像を生成させることができます</li>
                <li>📷 画像を複数アップロードして重ね合わせできます</li>
                <li>✏️ テキストを追加してカスタマイズできます</li>
                <li>🎨 画像にフィルターを適用できます</li>
                <li>🛒 完成したらShopifyカートに追加できます</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 右側: コントロールパネル */}
        <div style={{ 
          width: isMobile ? "100%" : "35%", 
          minWidth: "0",
          maxWidth: isMobile ? "100%" : "35%",
          flex: isMobile ? "none" : "1 1 35%",
          backgroundColor: "#ffffff",
          overflowY: "auto",
          overflowX: "hidden",
          height: isMobile ? "auto" : "100vh",
          position: isMobile ? "relative" : "sticky",
          top: 0,
        }}>
          <div style={{
            ...panelStyle,
            padding: isMobile ? "25px 20px" : "40px 30px",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}>
            <h2 style={{ 
              marginTop: 0, 
              color: "#1a1a1a", 
              marginBottom: isMobile ? "20px" : "30px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "400",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              商品詳細
            </h2>

            {/* 商品説明セクション */}
            <div style={sectionStyle}>
              <div style={{
                padding: "0",
                backgroundColor: "transparent",
                borderRadius: "0",
                marginBottom: "20px",
              }}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>商品説明</h3>
                <p style={{ 
                  fontSize: "13px", 
                  color: "#666", 
                  lineHeight: "1.8",
                  margin: 0,
                  letterSpacing: "0.02em",
                }}>
                  {product.description}
                </p>
              </div>
            </div>

            {/* 本体カラー選択セクション */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>本体カラー</h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      flex: 1,
                      padding: "14px 10px",
                      border: selectedColor.name === color.name 
                        ? "1px solid #1a1a1a" 
                        : "1px solid #d0d0d0",
                      borderRadius: "0",
                      backgroundColor: selectedColor.name === color.name ? "#f5f5f5" : "white",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedColor.name !== color.name) {
                        e.currentTarget.style.borderColor = "#888";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedColor.name !== color.name) {
                        e.currentTarget.style.borderColor = "#d0d0d0";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: color.hex,
                        border: color.hex === '#FFFFFF' || color.hex === '#F5F5DC'
                          ? '2px solid #e0e0e0' 
                          : 'none',
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: selectedColor.name === color.name ? "bold" : "normal",
                      color: selectedColor.name === color.name ? "#667eea" : "#666",
                    }}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* サイズ選択セクション */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>サイズ</h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(5, 1fr)", 
                gap: "8px",
                marginBottom: "20px",
              }}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "14px 8px",
                      border: selectedSize === size 
                        ? "1px solid #1a1a1a" 
                        : "1px solid #d0d0d0",
                      borderRadius: "0",
                      backgroundColor: selectedSize === size ? "#1a1a1a" : "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "400",
                      letterSpacing: "0.05em",
                      color: selectedSize === size ? "white" : "#666",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                        e.currentTarget.style.borderColor = "#888";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#d0d0d0";
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr style={dividerStyle} />

            {/* カートに追加ボタン */}
            <button
              onClick={openCartModal}
              disabled={isAddingToCart}
              style={{
                ...buttonStyle("#5c6ac4", !isAddingToCart),
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "bold",
                padding: isMobile ? "14px" : "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "24px"
              }}
            >
              {isAddingToCart ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon type="loading" size={20} color="white" /> 
                    カートに追加中...
                  </div>
                  <span style={{ fontSize: "13px" }}>（少しお待ちください）</span>
                </div>
              ) : (
                <><Icon type="cart" size={20} color="white" /> カートに追加</>
              )}
            </button>

            <hr style={dividerStyle} />

            <h2 style={{ marginTop: 0, color: "#333" }}>デザイン編集</h2>

            {/* 画像アップロードセクション */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>📷 画像アップロード</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={handleUploadClick}
                disabled={isLoading}
                style={{
                  ...buttonStyle("#3498db", !isLoading),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isLoading ? (
                  <><Icon type="loading" size={18} color="white" /> 読み込み中...</>
                ) : (
                  <><Icon type="upload" size={18} color="white" /> 画像をアップロード</>
                )}
              </button>
              
              {/* 選択されたオブジェクトの削除ボタン */}
            </div>

            <hr style={dividerStyle} />

            {/* AI画像生成セクション */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>🤖 AI画像生成</h3>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例: 宇宙を飛ぶ猫、サイバーパンクな都市、カラフルな抽象画..."
                rows={3}
                style={textareaStyle}
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                style={primaryButtonStyle(isGenerating)}
              >
                {isGenerating ? "⏳ 生成中..." : "✨ AIで画像生成"}
              </button>
              {lastAIPrompt && (
                <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                  最後の生成: "{lastAIPrompt}"
                </p>
              )}
            </div>

            <hr style={dividerStyle} />

            {/* テキスト追加セクション */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>✏️ テキスト追加</h3>
              <input
                type="text"
                value={textInput}
                onChange={(e) => handleTextInputChange(e.target.value)}
                placeholder="テキストを入力"
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>色</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleChangeTextColor(e.target.value)}
                    style={colorInputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>サイズ: {fontSize}px</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={fontSize}
                    onChange={(e) => handleChangeFontSize(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <label style={{ 
                fontSize: isMobile ? "12px" : "13px", 
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
                display: "block"
              }}>
                フォントの選択
              </label>
              
              {/* カスタムフォントドロップダウン */}
              <div ref={fontDropdownRef} style={{ position: "relative", width: "100%" }}>
                {/* 選択中のフォント表示 */}
                <div
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  style={{
                    ...selectStyle,
                    cursor: "pointer",
                    fontFamily: FONT_LIST.find(f => f.value === fontFamily)?.family || fontFamily,
                    fontSize: isMobile ? "14px" : "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{FONT_LIST.find(f => f.value === fontFamily)?.label || fontFamily}</span>
                  <span style={{ fontSize: "12px" }}>{isFontDropdownOpen ? "▲" : "▼"}</span>
                </div>
                
                {/* ドロップダウンリスト */}
                {isFontDropdownOpen && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "2px solid #4c51bf",
                    borderRadius: "8px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    marginTop: "4px"
                  }}>
                    {/* タブボタン */}
                    <div style={{
                      display: "flex",
                      borderBottom: "2px solid #e2e8f0",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "white",
                      zIndex: 1001
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFontTab("japanese");
                        }}
                        style={{
                          flex: 1,
                          padding: "12px",
                          border: "none",
                          backgroundColor: activeFontTab === "japanese" ? "#4c51bf" : "transparent",
                          color: activeFontTab === "japanese" ? "white" : "#4a5568",
                          fontWeight: activeFontTab === "japanese" ? "bold" : "normal",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontSize: isMobile ? "14px" : "16px"
                        }}
                      >
                        日本語
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFontTab("english");
                        }}
                        style={{
                          flex: 1,
                          padding: "12px",
                          border: "none",
                          backgroundColor: activeFontTab === "english" ? "#4c51bf" : "transparent",
                          color: activeFontTab === "english" ? "white" : "#4a5568",
                          fontWeight: activeFontTab === "english" ? "bold" : "normal",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontSize: isMobile ? "14px" : "16px"
                        }}
                      >
                        English
                      </button>
                    </div>
                    
                    {/* フォントリスト */}
                    {getFilteredFonts().map((font) => (
                      <div
                        key={font.value}
                        onClick={() => {
                          handleChangeFontFamily(font.value);
                          setIsFontDropdownOpen(false);
                        }}
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          cursor: "pointer",
                          fontFamily: font.family,
                          fontSize: isMobile ? "14px" : "16px",
                          borderBottom: "1px solid #eee",
                          backgroundColor: fontFamily === font.value ? "#f0f0ff" : "transparent",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          if (fontFamily !== font.value) {
                            e.currentTarget.style.backgroundColor = "#f9f9f9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (fontFamily !== font.value) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {font.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <hr style={dividerStyle} />

            {/* 操作ボタン */}
            <button 
              onClick={handleClearCanvas} 
              style={{
                ...buttonStyle("#ff8c42", true),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <Icon type="refresh" size={18} color="white" /> すべてクリア
            </button>
            <button 
              onClick={handleSaveDesign} 
              style={{
                ...buttonStyle("#00b894", true),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <Icon type="save" size={18} color="white" /> 画像として保存
            </button>
          </div>
        </div>
      </div>
      
      {/* 著作権モーダル */}
      {showCopyrightModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: isMobile ? "24px" : "40px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
          }}>
            <h2 style={{ 
              fontSize: isMobile ? "20px" : "24px", 
              marginBottom: "20px",
              color: "#333",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Icon type="clipboard" size={24} color="#333" /> 画像アップロード前のご確認
            </h2>
            
            <div style={{ 
              marginBottom: "24px",
              fontSize: isMobile ? "14px" : "15px",
              lineHeight: "1.8",
              color: "#555"
            }}>
              <h3 style={{ fontSize: isMobile ? "16px" : "18px", marginBottom: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon type="check" size={18} color="#28a745" /> 推奨画像サイズ
              </h3>
              <p style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <strong>300 DPI以上</strong>の高解像度画像を推奨します。<br/>
                プリント範囲: 250mm × 312mm
              </p>
              
              <h3 style={{ fontSize: isMobile ? "16px" : "18px", marginBottom: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon type="warning" size={18} color="#ffc107" /> 著作権・利用規約
              </h3>
              <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "8px" }}>
                  <strong>第三者の著作権を侵害する画像</strong>をアップロードしないでください
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong>肖像権</strong>や<strong>プライバシー権</strong>を侵害する画像は使用できません
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong>商標権</strong>を侵害する画像（企業ロゴなど）は使用できません
                </li>
                <li style={{ marginBottom: "8px" }}>
                  アップロードされた画像は<strong>お客様の責任</strong>で管理されます
                </li>
                <li style={{ marginBottom: "8px" }}>
                  不適切な画像が発見された場合、<strong>予告なく削除</strong>することがあります
                </li>
              </ul>
            </div>
            
            <div style={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
              <button 
                onClick={() => {
                  setShowCopyrightModal(false);
                  pendingImageRef.current = null;
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                キャンセル
              </button>
              <button 
                onClick={handleCopyrightAgree}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                同意してアップロード
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 画質警告 */}
      {imageQualityWarning && (() => {
        const isWarning = imageQualityWarning.includes("[WARNING]");
        const isInfo = imageQualityWarning.includes("[INFO]");
        const isSuccess = imageQualityWarning.includes("[SUCCESS]");
        const message = imageQualityWarning.replace("[WARNING]", "").replace("[INFO]", "").replace("[SUCCESS]", "").trim();
        const iconType = isWarning ? "warning" : isInfo ? "info" : "check";
        const iconColor = isWarning ? "#ffc107" : isInfo ? "#17a2b8" : "#28a745";
        const bgColor = isWarning ? "#fff3cd" : isInfo ? "#d1ecf1" : "#d4edda";
        const borderColor = isWarning ? "#ffc107" : isInfo ? "#17a2b8" : "#28a745";
        
        return (
          <div style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
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
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <Icon type={iconType} size={20} color={iconColor} />
              <div style={{ flex: 1 }}>{message}</div>
            </div>
            <button 
              onClick={() => setImageQualityWarning(null)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              閉じる
            </button>
          </div>
        );
      })()}

      {/* カート追加モーダル */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
          }}
          onClick={closeCartModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: isMobile ? "24px" : "32px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "24px", color: "#333" }}>
                🛒 カートに追加
              </h2>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
                サイズと個数を選択してください
              </p>
            </div>

            {/* カラー選択 */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px", color: "#333" }}>
                カラー
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setModalColor(color.name)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: modalColor === color.name ? "2px solid #5c6ac4" : "2px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: modalColor === color.name ? "#f0f2ff" : "white",
                      color: modalColor === color.name ? "#5c6ac4" : "#333",
                      fontWeight: modalColor === color.name ? "bold" : "normal",
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "all 0.2s",
                    }}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* サイズと個数選択 */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px", color: "#333" }}>
                サイズと個数
              </label>
              {["S", "M", "L", "XL", "XXL"].map((size) => {
                const currentQuantity = modalQuantities[modalColor]?.[size] || 0;
                return (
                  <div
                    key={size}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      marginBottom: "8px",
                      backgroundColor: currentQuantity > 0 ? "#f0f2ff" : "#f8f9fa",
                      borderRadius: "8px",
                      border: currentQuantity > 0 ? "2px solid #5c6ac4" : "2px solid transparent",
                    }}
                  >
                    <span style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}>
                      {size}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => {
                          setModalQuantities((prev) => ({
                            ...prev,
                            [modalColor]: {
                              ...prev[modalColor],
                              [size]: Math.max(0, (prev[modalColor]?.[size] || 0) - 1),
                            }
                          }));
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        -
                      </button>
                      <span style={{ 
                        minWidth: "24px", 
                        textAlign: "center", 
                        fontSize: "16px", 
                        fontWeight: "bold",
                        color: currentQuantity > 0 ? "#5c6ac4" : "#999"
                      }}>
                        {currentQuantity}
                      </span>
                      <button
                        onClick={() => {
                          setModalQuantities((prev) => ({
                            ...prev,
                            [modalColor]: {
                              ...prev[modalColor],
                              [size]: Math.min(99, (prev[modalColor]?.[size] || 0) + 1),
                            }
                          }));
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 合計表示 */}
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f0f2ff",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
                  合計
                </span>
                <span style={{ fontWeight: "bold", fontSize: "20px", color: "#5c6ac4" }}>
                  {Object.values(modalQuantities).reduce((colorQty, sizes) => {
                    return colorQty + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
                  }, 0)} 点
                </span>
              </div>
            </div>

            {/* ボタン */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={closeCartModal}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#666",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleAddToCartMultiple}
                disabled={Object.values(modalQuantities).reduce((colorQty, sizes) => {
                  return colorQty + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
                }, 0) === 0}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: Object.values(modalQuantities).reduce((colorQty, sizes) => {
                    return colorQty + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
                  }, 0) === 0 ? "#ccc" : "#5c6ac4",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: Object.values(modalQuantities).reduce((colorQty, sizes) => {
                    return colorQty + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
                  }, 0) === 0 ? "not-allowed" : "pointer",
                }}
              >
                カートに追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== スタイル定義 ==========
const panelStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "0",
  boxShadow: "none",
  height: "100%",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "30px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "11px",
  marginBottom: "16px",
  color: "#666",
  fontWeight: "400",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
};

const dividerStyle: React.CSSProperties = {
  margin: "30px 0",
  border: "none",
  borderTop: "1px solid #e5e5e5",
};

const buttonStyle = (bgColor: string, enabled: boolean): React.CSSProperties => ({
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
  transition: "all 0.3s ease",
});

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
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
  transition: "all 0.3s ease",
});

const smallButtonStyle = (bgColor: string, enabled: boolean): React.CSSProperties => ({
  padding: "12px 16px",
  backgroundColor: enabled ? "#1a1a1a" : "#e0e0e0",
  color: enabled ? "white" : "#999",
  border: "none",
  borderRadius: "0",
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  cursor: enabled ? "pointer" : "not-allowed",
  width: "100%",
  fontWeight: "400",
  transition: "all 0.3s ease",
});

const historyButtonStyle = (enabled: boolean): React.CSSProperties => ({
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
  transition: "all 0.3s ease",
});

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "10px",
  border: "1px solid #d0d0d0",
  borderRadius: "0",
  fontSize: "13px",
  letterSpacing: "0.02em",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "2px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  resize: "vertical",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const colorInputStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  display: "block",
  marginBottom: "5px",
  color: "#666",
  fontWeight: "500",
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  fontSize: "13px",
  border: "1px solid #e0e0e0",
};
