/**
 * PrintAIze カスタマイザーコンポーネント
 * ピクセル完璧再現版
 */

import { useState, useEffect, useRef } from "react";
import type { Product } from "~/lib/products";

// Shopify商品型
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  price: string;
  currencyCode: string;
  image: string | null;
  imageAlt: string;
  colors: Array<{ name: string; hex: string; image: string | null }>;
}

interface PrintAIzeProps {
  product: Product;
}

type MenuTab = "item" | "ai" | "image" | "text";

export default function PrintAIze({ product }: PrintAIzeProps) {
  const [activeTab, setActiveTab] = useState<MenuTab | null>(null);
  const [hoveredTab, setHoveredTab] = useState<MenuTab | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Shopify商品データ
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 選択された商品画像
  const [selectedProductImage, setSelectedProductImage] = useState<string>("/images/products/box-tshirt-short-white.png");
  const [selectedProductName, setSelectedProductName] = useState<string>(product.name);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
  // アップロード済み画像
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // プリント範囲の画像オブジェクト
  type ImageObject = {
    id: string;
    src: string;
    x: number; // 中心位置 (%)
    y: number; // 中心位置 (%)
    scale: number;
    rotation: number; // 度数
    zIndex: number;
  };
  const [printedImages, setPrintedImages] = useState<ImageObject[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ scale: 1, rotation: 0, x: 0, y: 0, direction: "" });
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ rotation: 0, centerX: 0, centerY: 0 });
  const [isPrintAreaDragging, setIsPrintAreaDragging] = useState(false);
  const printAreaFileInputRef = useRef<HTMLInputElement>(null);
  
  // AI生成画像
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // 参照画像（AI生成用）
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isReferenceDragging, setIsReferenceDragging] = useState(false);
  const referenceFileInputRef = useRef<HTMLInputElement>(null);
  
  // コンパネ2（スタイル詳細）
  const [isPanel2Open, setIsPanel2Open] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [styleImages, setStyleImages] = useState<string[]>([]);
  
  // ポップアップ（画像詳細）
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedPopupImage, setSelectedPopupImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<string>("");
  
  // プロンプト
  const [promptText, setPromptText] = useState("");

  // プリント範囲の状態
  const [printAreaStyle, setPrintAreaStyle] = useState<React.CSSProperties>({});
  const [isMounted, setIsMounted] = useState(false); // クライアントサイドでのみレンダリング
  const mainImageRef = useRef<HTMLImageElement>(null);

  // 画像アップロード確認ポップアップ
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadSource, setUploadSource] = useState<"printArea" | "imageManagement" | null>(null);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  // 画像サイズチェックポップアップ
  const [showImageSizeCheck, setShowImageSizeCheck] = useState(false);
  const [imageSizeInfo, setImageSizeInfo] = useState<{
    width: number;
    height: number;
    isGoodQuality: boolean;
    isTooSmall: boolean;
  } | null>(null);

  // アップロード済み画像の原寸大ポップアップ
  const [showFullSizeImage, setShowFullSizeImage] = useState(false);
  const [fullSizeImageSrc, setFullSizeImageSrc] = useState<string>("");

  // コントロールメニュー（Undo/Redo機能）
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // コントロールメニューのアクション
  const handleUndo = () => {
    console.log("元に戻す");
    // TODO: Undo機能を実装
  };

  const handleRedo = () => {
    console.log("やり直し");
    // TODO: Redo機能を実装
  };

  const handleAlignVerticalCenter = () => {
    console.log("上下中央");
    // TODO: 上下中央揃え機能を実装
  };

  const handleAlignHorizontalCenter = () => {
    console.log("左右中央");
    // TODO: 左右中央揃え機能を実装
  };

  const handleBringForward = () => {
    console.log("手前へ");
    // TODO: 手前へ移動機能を実装
  };

  const handleSendBackward = () => {
    console.log("奥へ");
    // TODO: 奥へ移動機能を実装
  };

  const handleFitToArea = () => {
    console.log("範囲内最大");
    // TODO: 範囲内最大機能を実装
  };

  // 初回のみ利用規約の同意状態をlocalStorageから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      const agreed = localStorage.getItem("hasAgreedToImageUploadTerms") === "true";
      setHasAgreedToTerms(agreed);
    }
  }, []);

  // 画像オブジェクトのドラッグ処理
  useEffect(() => {
    if (!isDraggingImage || !selectedImageId) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mainImageRef.current || !printAreaStyle.width) return;

      const printAreaWidth = parseFloat(printAreaStyle.width as string);
      const printAreaHeight = parseFloat(printAreaStyle.height as string);

      let deltaX = e.clientX - dragStart.x;
      let deltaY = e.clientY - dragStart.y;

      // Shiftキーが押されている場合、水平または垂直のみに移動
      if (e.shiftKey) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          deltaY = 0; // 水平のみ
        } else {
          deltaX = 0; // 垂直のみ
        }
      }

      const deltaXPercent = (deltaX / printAreaWidth) * 100;
      const deltaYPercent = (deltaY / printAreaHeight) * 100;

      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // 回転した矩形の4つの角から正確な境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (img.rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          const halfW = baseSize / 2;
          const halfH = baseSize / 2;
          
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          const boundingWidth = (maxX - minX) * img.scale;
          const boundingHeight = (maxY - minY) * img.scale;
          
          const halfBoundingWidth = boundingWidth / 2;
          const halfBoundingHeight = boundingHeight / 2;
          
          // 範囲制限
          const minMargin = 0.5;
          const maxMargin = 99.5;
          
          const newX = Math.max(
            halfBoundingWidth + minMargin,
            Math.min(maxMargin - halfBoundingWidth, img.x + deltaXPercent)
          );
          const newY = Math.max(
            halfBoundingHeight + minMargin,
            Math.min(maxMargin - halfBoundingHeight, img.y + deltaYPercent)
          );
          
          return {
            ...img,
            x: newX,
            y: newY,
          };
        })
      );

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!mainImageRef.current || !printAreaStyle.width) return;

      const touch = e.touches[0];
      const printAreaWidth = parseFloat(printAreaStyle.width as string);
      const printAreaHeight = parseFloat(printAreaStyle.height as string);

      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const deltaXPercent = (deltaX / printAreaWidth) * 100;
      const deltaYPercent = (deltaY / printAreaHeight) * 100;

      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // 回転した矩形の4つの角から正確な境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (img.rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          const halfW = baseSize / 2;
          const halfH = baseSize / 2;
          
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          const boundingWidth = (maxX - minX) * img.scale;
          const boundingHeight = (maxY - minY) * img.scale;
          
          const halfBoundingWidth = boundingWidth / 2;
          const halfBoundingHeight = boundingHeight / 2;
          
          // 範囲制限
          const minMargin = 0.5;
          const maxMargin = 99.5;
          
          const newX = Math.max(
            halfBoundingWidth + minMargin,
            Math.min(maxMargin - halfBoundingWidth, img.x + deltaXPercent)
          );
          const newY = Math.max(
            halfBoundingHeight + minMargin,
            Math.min(maxMargin - halfBoundingHeight, img.y + deltaYPercent)
          );
          
          return {
            ...img,
            x: newX,
            y: newY,
          };
        })
      );

      setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
    };

    const handleTouchEnd = () => {
      setIsDraggingImage(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDraggingImage, selectedImageId, dragStart, printAreaStyle]);

  // 画像オブジェクトをプリント範囲内に制約する関数
  // 画像オブジェクトのリサイズ・回転処理
  useEffect(() => {
    if (!isResizing || !selectedImageId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      // 方向に応じたスケール変更
      let scaleChange = 0;
      const sensitivity = 0.01; // スケール変更の感度
      
      switch (resizeStart.direction) {
        case "top":
          scaleChange = -deltaY * sensitivity; // 上に引っ張ると拡大
          break;
        case "bottom":
          scaleChange = deltaY * sensitivity; // 下に引っ張ると拡大
          break;
        case "left":
          scaleChange = -deltaX * sensitivity; // 左に引っ張ると拡大
          break;
        case "right":
          scaleChange = deltaX * sensitivity; // 右に引っ張ると拡大
          break;
        default:
          // 角のハンドル（対角線方向）
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          scaleChange = (distance / 100) * (deltaX + deltaY > 0 ? 1 : -1);
      }
      
      const newScale = resizeStart.scale + scaleChange;
      
      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // スケールを適用
          const finalScale = Math.max(0.1, newScale);
          
          // 回転した矩形の境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (img.rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          const halfW = (baseSize / 2) * finalScale;
          const halfH = (baseSize / 2) * finalScale;
          
          // 4つの角の座標
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          // 回転後の座標
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          // 境界ボックス
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          // 中心位置
          let centerX = img.x;
          let centerY = img.y;
          
          // 境界（絶対座標%）
          const boundLeft = centerX + minX;
          const boundRight = centerX + maxX;
          const boundTop = centerY + minY;
          const boundBottom = centerY + maxY;
          
          // 範囲を超えている場合、位置を調整（過去の実装と同じ）
          if (boundLeft < 0) {
            centerX += (0 - boundLeft);
          }
          if (boundRight > 100) {
            centerX -= (boundRight - 100);
          }
          if (boundTop < 0) {
            centerY += (0 - boundTop);
          }
          if (boundBottom > 100) {
            centerY -= (boundBottom - 100);
          }
          
          return {
            ...img,
            scale: finalScale,
            x: centerX,
            y: centerY,
          };
        })
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - resizeStart.x;
      const deltaY = touch.clientY - resizeStart.y;
      
      // 方向に応じたスケール変更
      let scaleChange = 0;
      const sensitivity = 0.01;
      
      switch (resizeStart.direction) {
        case "top":
          scaleChange = -deltaY * sensitivity;
          break;
        case "bottom":
          scaleChange = deltaY * sensitivity;
          break;
        case "left":
          scaleChange = -deltaX * sensitivity;
          break;
        case "right":
          scaleChange = deltaX * sensitivity;
          break;
        default:
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          scaleChange = (distance / 100) * (deltaX + deltaY > 0 ? 1 : -1);
      }
      
      const newScale = resizeStart.scale + scaleChange;
      
      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // 回転した矩形の4つの角から正確な境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (img.rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          // 矩形の半分のサイズ
          const halfW = baseSize / 2;
          const halfH = baseSize / 2;
          
          // 4つの角の座標（回転前、中心が原点）
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          // 回転後の4つの角の座標
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          // 境界ボックス
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          const unscaledBoundingWidth = maxX - minX;
          const unscaledBoundingHeight = maxY - minY;
          
          // スケールを適用
          let constrainedScale = Math.max(0.1, newScale);
          let actualBoundingWidth = unscaledBoundingWidth * constrainedScale;
          let actualBoundingHeight = unscaledBoundingHeight * constrainedScale;
          
          // 境界ボックスが100%を超える場合はスケール縮小
          const maxAllowedSize = 99;
          if (actualBoundingWidth > maxAllowedSize) {
            constrainedScale *= maxAllowedSize / actualBoundingWidth;
            actualBoundingWidth = maxAllowedSize;
            actualBoundingHeight = unscaledBoundingHeight * constrainedScale;
          }
          if (actualBoundingHeight > maxAllowedSize) {
            constrainedScale *= maxAllowedSize / actualBoundingHeight;
            actualBoundingHeight = maxAllowedSize;
            actualBoundingWidth = unscaledBoundingWidth * constrainedScale;
          }
          
          const halfBoundingWidth = actualBoundingWidth / 2;
          const halfBoundingHeight = actualBoundingHeight / 2;
          
          // 位置を調整
          let adjustedX = img.x;
          let adjustedY = img.y;
          
          const minMargin = 0.5;
          const maxMargin = 99.5;
          
          if (adjustedX - halfBoundingWidth < minMargin) {
            adjustedX = halfBoundingWidth + minMargin;
          }
          if (adjustedX + halfBoundingWidth > maxMargin) {
            adjustedX = maxMargin - halfBoundingWidth;
          }
          if (adjustedY - halfBoundingHeight < minMargin) {
            adjustedY = halfBoundingHeight + minMargin;
          }
          if (adjustedY + halfBoundingHeight > maxMargin) {
            adjustedY = maxMargin - halfBoundingHeight;
          }
          
          return {
            ...img,
            scale: constrainedScale,
            x: adjustedX,
            y: adjustedY,
          };
        })
      );
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isResizing, selectedImageId, resizeStart]);

  // 画像オブジェクトの回転処理
  useEffect(() => {
    if (!isRotating || !selectedImageId) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 中心からマウス位置への角度を計算
      const deltaX = e.clientX - rotateStart.centerX;
      const deltaY = e.clientY - rotateStart.centerY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // 90度オフセット（上が0度）
      let rotation = angle + 90;
      
      // Shiftキーが押されている場合、15度刻みにスナップ
      if (e.shiftKey) {
        rotation = Math.round(rotation / 15) * 15;
      }
      
      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // 回転した矩形の境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          const halfW = (baseSize / 2) * img.scale;
          const halfH = (baseSize / 2) * img.scale;
          
          // 4つの角の座標
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          // 回転後の座標
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          // 境界ボックス
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          // 中心位置
          let centerX = img.x;
          let centerY = img.y;
          
          // 境界（絶対座標%）
          const boundLeft = centerX + minX;
          const boundRight = centerX + maxX;
          const boundTop = centerY + minY;
          const boundBottom = centerY + maxY;
          
          // 範囲を超えている場合、位置を調整（過去の実装と同じ）
          if (boundLeft < 0) {
            centerX += (0 - boundLeft);
          }
          if (boundRight > 100) {
            centerX -= (boundRight - 100);
          }
          if (boundTop < 0) {
            centerY += (0 - boundTop);
          }
          if (boundBottom > 100) {
            centerY -= (boundBottom - 100);
          }
          
          return {
            ...img,
            rotation,
            scale: img.scale,
            x: centerX,
            y: centerY,
          };
        })
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - rotateStart.centerX;
      const deltaY = touch.clientY - rotateStart.centerY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const rotation = angle + 90;
      
      setPrintedImages((prev) =>
        prev.map((img) => {
          if (img.id !== selectedImageId) return img;
          
          // 回転した矩形の境界ボックスを計算
          const baseSize = 60;
          const rotationRad = (rotation * Math.PI) / 180;
          const cosRad = Math.cos(rotationRad);
          const sinRad = Math.sin(rotationRad);
          
          const halfW = (baseSize / 2) * img.scale;
          const halfH = (baseSize / 2) * img.scale;
          
          // 4つの角の座標
          const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
          ];
          
          // 回転後の座標
          const rotatedCorners = corners.map(corner => ({
            x: corner.x * cosRad - corner.y * sinRad,
            y: corner.x * sinRad + corner.y * cosRad,
          }));
          
          // 境界ボックス
          const minX = Math.min(...rotatedCorners.map(c => c.x));
          const maxX = Math.max(...rotatedCorners.map(c => c.x));
          const minY = Math.min(...rotatedCorners.map(c => c.y));
          const maxY = Math.max(...rotatedCorners.map(c => c.y));
          
          // 中心位置
          let centerX = img.x;
          let centerY = img.y;
          
          // 境界（絶対座標%）
          const boundLeft = centerX + minX;
          const boundRight = centerX + maxX;
          const boundTop = centerY + minY;
          const boundBottom = centerY + maxY;
          
          // 範囲を超えている場合、位置を調整（過去の実装と同じ）
          if (boundLeft < 0) {
            centerX += (0 - boundLeft);
          }
          if (boundRight > 100) {
            centerX -= (boundRight - 100);
          }
          if (boundTop < 0) {
            centerY += (0 - boundTop);
          }
          if (boundBottom > 100) {
            centerY -= (boundBottom - 100);
          }
          
          return {
            ...img,
            rotation,
            scale: img.scale,
            x: centerX,
            y: centerY,
          };
        })
      );
    };

    const handleMouseUp = () => {
      setIsRotating(false);
    };

    const handleTouchEnd = () => {
      setIsRotating(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRotating, selectedImageId, rotateStart]);

  // クライアントサイドでのみレンダリング
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Deleteキーで選択中のオブジェクトを削除
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedImageId) {
        e.preventDefault();
        setPrintedImages((prev) => prev.filter((img) => img.id !== selectedImageId));
        setSelectedImageId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageId]);


  // メニュー項目
  const menuItems: { id: MenuTab; label: string }[] = [
    { id: "item", label: "アイテム" },
    { id: "ai", label: "AI画像生成" },
    { id: "image", label: "画像管理" },
    { id: "text", label: "テキスト" },
  ];

  // アイコンSVGコンポーネント
  const getIcon = (id: MenuTab, color: string = "#303030") => {
    const iconStyle = { width: "24px", height: "24px", flexShrink: 0 };
    
    switch (id) {
      case "item":
        return (
          <svg width="24" height="24" viewBox="0 0 48 48" style={iconStyle}>
            <path d="M32.6732039,24.2149483 C32.4965006,20.8575868 35.6326999,18.4498489 38.842109,19.542636 L39.6769253,19.8312016 L40.2435121,17.2857296 C40.2435121,17.2857296 33.3348798,9.9395838 32.6241638,10.0099418 C32.6241638,10.0099418 32.1673203,9.99999994 31.6845537,10.0003602 C30.2136854,12.968988 27.1528473,15.0099418 23.6153188,15.0099418 C20.0776473,15.0099418 17.0167046,12.9688229 15.5459055,10 C15.0615473,9.99999994 14.6064738,10.0099418 14.6064738,10.0099418 C13.9583364,10.0099418 7,17.3000118 7,17.3000118 L7.56714184,19.8115152 L8.39607849,19.534326 C11.5774498,18.4705032 14.7353576,20.834396 14.5574338,24.2149483 L14.2483253,30 L32.9771214,30 L32.6732039,24.2149483 Z M33.1872613,34 L14.0345962,34 L13.8203359,38.0099418 L33.3979235,38.0099418 L33.1872613,34 Z M10.579173,23.9947712 C10.6080886,23.4453742 10.2000242,23.1442916 9.68081156,23.3179118 L6.5299669,24.3715267 C5.48148882,24.7221286 4.43611947,24.1263828 4.19755919,23.0521044 L3.06549961,17.9542433 C2.82582448,16.8749445 3.26466057,15.3668688 4.04307572,14.5884537 L11.2199831,7.41154632 C11.9995586,6.63197081 13.5212033,6 14.6226844,6 L17.6405787,6 C18.1878657,6 18.7372603,6.42629719 18.9074574,6.96405029 C18.9074574,6.96405029 19.5971061,11 23.6315294,11 C27.6659527,11 28.3597409,6.95223077 28.3597409,6.95223077 C28.5098455,6.42632824 29.0758629,6 29.6224801,6 L32.6403744,6 C33.7400589,6 35.2646606,6.63313117 36.0430757,7.41154632 L43.2199831,14.5884537 C43.9995586,15.3680292 44.439761,16.8670779 44.1975592,17.9621895 L43.0654996,23.0807792 C42.8258245,24.1644666 41.7846016,24.7545942 40.7330919,24.3965607 L37.5690294,23.3192139 C37.0512624,23.1429169 36.6552623,23.4509254 36.6838858,23.9947712 L37.5264019,40.0025781 C37.5844622,41.1057238 36.7316319,42 35.6402851,42 L11.6227737,42 C10.5230398,42 9.67842021,41.1090746 9.73665687,40.0025781 L10.579173,23.9947712 Z" fill={color} />
          </svg>
        );
      case "ai":
        return (
          <svg width="24" height="24" viewBox="0 0 48 48" style={iconStyle}>
            <path d="M25.3841736,18.0729398 L29.6273588,22.316125 C30.408257,23.0970232 30.4049765,24.3663899 29.6332778,25.1380886 L12.6503326,42.1210338 C11.8727033,42.8986631 10.6148002,42.9015461 9.82836894,42.1151149 L5.58518375,37.8719297 C4.80428553,37.0910314 4.80756608,35.8216647 5.57926479,35.049966 L22.56221,18.0670208 C23.3398392,17.2893916 24.5977424,17.2865086 25.3841736,18.0729398 Z M34.4641357,16.9489765 L31.5395848,18.4865039 C30.557771,19.0026739 29.9141966,18.5328849 30.1013701,17.4415797 L30.6599096,14.1850445 L28.2938983,11.8787535 C27.4995942,11.1044983 27.7475147,10.3472499 28.8432474,10.1880306 L32.1129946,9.71290853 L33.5752701,6.75001494 C34.066177,5.75532888 34.8629747,5.75711264 35.3530013,6.75001494 L36.8152767,9.71290853 L40.0850239,10.1880306 C41.1827251,10.3475359 41.4272527,11.1058868 40.634373,11.8787535 L38.2683617,14.1850445 L38.8269012,17.4415797 C39.014411,18.5348454 38.3687396,19.0017483 37.3886865,18.4865039 L34.4641357,16.9489765 Z M36.7214468,32.2407726 L35.2489561,33.0149067 C34.2677083,33.5307792 33.6224656,33.0731514 33.8115705,31.970585 L34.0927912,30.3309425 L32.9015212,29.1697413 C32.1076751,28.3959325 32.3435141,27.6408555 33.4505537,27.4799932 L35.0968483,27.2407726 L35.8330936,25.7489766 C36.3237175,24.754864 37.1147168,24.7458285 37.6097999,25.7489766 L38.3460453,27.2407726 L39.9923399,27.4799932 C41.0894083,27.6394066 41.3424337,28.3888994 40.5413723,29.1697413 L39.3501023,30.3309425 L39.631323,31.970585 C39.8187247,33.0632205 19.1841038,33.535468 38.1939375,33.0149067 L36.7214468,32.2407726 Z M16.7214468,13.2407726 L15.2489561,14.0149067 C14.2677083,14.5307792 13.6224656,14.0731514 13.8115705,12.970585 L14.0927912,11.3309425 L12.9015212,10.1697413 C12.1076751,9.39593254 12.3435141,8.64085546 13.4505537,8.47999319 L15.0968483,8.24077258 L15.8330936,6.74897657 C16.3237175,5.75486399 17.1147168,5.74582852 17.6097999,6.74897657 L18.3460453,8.24077258 L19.9923399,8.47999319 C21.0894083,8.63940656 21.3424337,9.38889941 20.5413723,10.1697413 L19.3501023,11.3309425 L19.631323,12.970585 C19.8187247,14.0632205 19.1841038,14.535468 18.1939375,14.0149067 L16.7214468,13.2407726 Z M20.3404788,25.9572163 L9.83031737,36.468625 L11.2337183,37.8803629 L21.7470378,27.3638341 L20.3404788,25.9572163 Z" fill={color} fillRule="nonzero" />
          </svg>
        );
      case "image":
        return (
          <svg width="24" height="24" viewBox="0 0 48 48" style={iconStyle}>
            <path d="M2,9.99017859 C2,7.7864638 3.79975948,6 5.99029394,6 L18.0767644,6 C19.1835685,6 20.5701975,6.7477726 21.1746315,7.67133451 L24.0075684,12 L41.9918214,12 C44.2054773,12 46,13.7867947 46,15.9992748 L46,38.0007252 C46,40.2094637 44.2069088,42 41.99819,42 L6.00180999,42 C3.79167136,42 2,40.2147544 2,38.0098214 L2,9.99017859 Z M6,38.0098214 L41.99819,38 L42,15.9992748 L24.0075684,16 C22.658105,16 21.3996088,15.3195781 20.6606307,14.1904356 L18,10.0097802 L5.99029394,10 L6,38.0098214 Z M17.862928,23.9448407 C18.3178041,22.9335006 19.2364493,22.8239147 19.9084014,23.6918355 L22.7905122,27.4144876 C23.4653199,28.2860968 24.7285203,28.4701867 25.6270803,27.8146248 L26.205134,27.3928946 C27.0969196,26.7422751 28.2985638,26.9754922 28.8829814,27.9041067 L31.6562655,32.3107367 C32.2434141,33.2436908 31.8235673,33.9999996 30.718486,33.9999996 L15.3412689,33.9999999 C14.236199,33.9999999 13.7078282,33.1830028 14.1639889,32.1688067 L17.862928,23.9448407 Z M30.9342877,26 C29.2774335,26 27.9342877,24.6568542 27.9342877,23 C27.9342877,21.3431458 29.2774335,20 30.9342877,20 C32.591142,20 33.9342877,21.3431458 33.9342877,23 C33.9342877,24.6568542 32.591142,26 30.9342877,26 Z" fill={color} />
          </svg>
        );
      case "text":
        return (
          <svg width="24" height="24" viewBox="0 0 48 48" style={iconStyle}>
            <path d="M18.7420473,23 L29.2579527,23 L24,12.5 L18.7420473,23 Z M14.7888544,30.8944272 C14.2948759,31.8823842 13.0935298,32.2828329 12.1055728,31.7888544 C11.1176158,31.2948759 10.7171671,30.0935298 11.2111456,29.1055728 L22.2111456,7.10557281 C22.9481942,5.63147573 25.0518058,5.63147573 25.7888544,7.10557281 L36.7888544,29.1055728 C37.2828329,30.0935298 36.8823842,31.2948759 35.8944272,31.7888544 C34.9064702,32.2828329 33.7051241,31.8823842 33.2111456,30.8944272 L31.2609824,27 L16.7390176,27 L14.7888544,30.8944272 Z M6,39 C6,37.3431458 7.34553934,36 9.00741988,36 L38.9925801,36 C40.6535323,36 42,37.3465171 42,39 C42,40.6568542 40.6544607,42 38.9925801,42 L9.00741988,42 C7.34646775,42 6,40.6534829 6,39 Z" fill={color} />
          </svg>
        );
    }
  };

  // カートアイコン
  const getCartIcon = (color: string = "#303030") => {
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" style={{ width: "24px", height: "24px", flexShrink: 0 }}>
        <path d="M11.5007403,9.05603578 L43.3117204,11.0066834 C44.4128513,11.0680907 45.1400283,12.0036535 44.9388675,13.0805194 L42.3354502,27.0172835 C42.1329678,28.1012242 41.0744857,28.9799318 39.9706095,28.9799318 L16.1005524,28.9799318 L16.5622906,30.9799318 L38.9688234,30.9799318 C40.0733929,30.9799318 40.9688234,31.8753623 40.9688234,32.9799318 C40.9688234,34.0845013 40.0733929,34.9799318 38.9688234,34.9799318 L14.9688234,34.9799318 C14.0375114,34.9799318 13.2294553,34.337113 13.020041,33.4296508 L7.23501091,8.36118717 L4.10770841,6.79014097 C3.11928363,6.29709916 2.71769638,5.09613319 3.21073819,4.10770841 C3.70378001,3.11928363 4.90474597,2.71769638 5.89317075,3.21073819 L9.86155454,5.19023038 C10.3959835,5.45681194 10.7833136,5.94828007 10.9176058,6.53021276 L11.5007403,9.05603578 Z M38.6470013,24.9790697 L40.5410416,14.8397833 L12.4391717,13.1208128 L15.1770742,24.9799241 L38.6470013,24.9790697 Z M34.9688234,44.9799318 C32.7596844,44.9799318 30.9688234,43.1890708 30.9688234,40.9799318 C30.9688234,38.7707928 32.7596844,36.9799318 34.9688234,36.9799318 C37.1779624,36.9799318 38.9688234,38.7707928 38.9688234,40.9799318 C38.9688234,43.1890708 37.1779624,44.9799318 34.9688234,44.9799318 Z M16.9688234,44.9799318 C14.7596844,44.9799318 12.9688234,43.1890708 12.9688234,40.9799318 C12.9688234,38.7707928 14.7596844,36.9799318 16.9688234,36.9799318 C19.1779624,36.9799318 20.9688234,38.7707928 20.9688234,40.9799318 C20.9688234,43.1890708 19.1779624,44.9799318 16.9688234,44.9799318 Z" fill={color} />
      </svg>
    );
  };

  // 展開アイコン（矢印）
  const getExpandIcon = () => {
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" style={{ width: "24px", height: "24px", flexShrink: 0 }}>
        <path d="M31.4142136,11.4142136 C32.1952621,10.633165 32.1952621,9.36683502 31.4142136,8.58578644 C30.633165,7.80473785 29.366835,7.80473785 28.5857864,8.58578644 L14.5857864,22.5857864 C13.8047379,23.366835 13.8047379,24.633165 14.5857864,25.4142136 L28.5857864,39.4142136 C29.366835,40.1952621 30.633165,40.1952621 31.4142136,39.4142136 C32.1952621,38.633165 32.1952621,37.366835 31.4142136,36.5857864 L18.8284271,24 L31.4142136,11.4142136 Z" fill="#303030" fillRule="nonzero" transform="translate(23.000000, 24.000000) scale(-1, 1) translate(-23.000000, -24.000000)" />
      </svg>
    );
  };

  // 画像アイコン
  const getImageIcon = (size: number = 32) => {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
        <path d="M22,8 L11.9909413,8 L12,39.9999745 L35.9957423,40 C35.9957423,40 36.0001766,28.3434109 36.0001145,22 L24,22 C22.8954305,22 22,21.1045695 22,20 L22,8 Z M26,18 L35.9999993,18 L26,8 L26,18 Z M11.9909413,4 L26.6055819,4 C27.1573996,4 27.923594,4.31897704 28.3066744,4.70220075 L39.2980619,15.6977016 C39.6857316,16.0855164 40,16.8559261 40,17.3985099 L40,40.0014572 C40,42.2097914 38.2109725,44 35.9957423,44 L12.0042577,44 C9.79276724,44 8,42.2035752 8,39.9999745 L8,8.00002553 C8,5.79087243 9.79176129,4 11.9909413,4 Z M30.9625772,30 C29.3057229,30 27.9625772,28.6568542 27.9625772,27 C27.9625772,25.3431458 29.3057229,24 30.9625772,24 C32.6194314,24 33.9625772,25.3431458 33.9625772,27 C33.9625772,28.6568542 32.6194314,30 30.9625772,30 Z M17.8912175,27.9448407 C18.3460936,26.9335006 19.2647388,26.8239147 19.9366909,27.6918355 L22.8188017,31.4144876 C23.4936094,32.2860968 24.7568098,32.4701867 25.6553698,31.8146248 L26.2334235,31.3928946 C27.1252091,30.7422751 28.3268533,30.9754922 28.9112709,31.9041067 L31.6845549,36.3107367 C32.2717036,37.2436908 31.8518568,37.9999996 30.7467755,37.9999996 L15.3695584,37.9999999 C14.2644885,37.9999999 13.7361177,37.1830028 14.1922784,36.1688067 L17.8912175,27.9448407 Z" fill="#303030" />
      </svg>
    );
  };

  // 商品データ取得
  const fetchProducts = async (cursor?: string | null) => {
    if (isLoadingProducts) return;
    
    setIsLoadingProducts(true);
    try {
      const url = new URL("/api/collection-products", window.location.origin);
      url.searchParams.set("handle", "item");
      url.searchParams.set("first", "10");
      if (cursor) {
        url.searchParams.set("after", cursor);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.success) {
        setProducts((prev) => cursor ? [...prev, ...data.products] : data.products);
        setHasNextPage(data.pageInfo.hasNextPage);
        setEndCursor(data.pageInfo.endCursor);
      }
    } catch (error) {
      console.error("商品取得エラー:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // アイテムタブ選択時に商品を取得
  useEffect(() => {
    if (activeTab === "item" && products.length === 0) {
      fetchProducts();
    }
  }, [activeTab]);

  // 無限スクロール
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight + 200 && hasNextPage && !isLoadingProducts) {
        fetchProducts(endCursor);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, endCursor, isLoadingProducts]);

  // メニュークリック処理
  const handleMenuClick = (id: MenuTab) => {
    if (activeTab === id) {
      // 同じボタンを再クリック → 元に戻す
      setActiveTab(null);
      setIsCollapsed(false);
    } else {
      // 新しいボタンをクリック → 縮小
      setActiveTab(id);
      setIsCollapsed(true);
    }
    // コンパネ2を閉じる
    setIsPanel2Open(false);
    setSelectedStyle(null);
  };

  // 商品カードクリック処理
  const handleProductClick = (productId: string, productImage: string | null, productName: string) => {
    if (productImage) {
      setSelectedProductImage(productImage);
      setSelectedProductName(productName);
      setSelectedProductId(productId);
    }
  };

  // 画像アップロード処理（ポップアップを表示）
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // 画像ファイルのみをフィルタリング
    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    
    // File[]配列として保存
    setPendingFiles(imageFiles);
    setUploadSource("imageManagement");
    
    // 初回のみ利用規約ポップアップを表示、2回目以降は直接サイズチェック
    if (hasAgreedToTerms) {
      checkImageSize(imageFiles);
    } else {
      setShowUploadConfirm(true);
    }
  };

  // 実際の画像アップロード処理（画像管理用）
  const confirmImageManagementUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    let processedCount = 0;
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          processedCount++;
          if (processedCount === files.length) {
            setUploadedImages((prev) => [...newImages, ...prev]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 画像サイズチェックを実行
  const checkImageSize = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0]; // 最初の画像をチェック
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        // プリント範囲: 250mm × 312mm
        // 150 DPI最低: 1182 × 1475px
        // 300 DPI推奨: 2953 × 3685px
        const minWidth = 1182;
        const minHeight = 1475;
        const recommendedWidth = 2953;
        const recommendedHeight = 3685;
        
        const isTooSmall = width < minWidth || height < minHeight;
        const isGoodQuality = width >= recommendedWidth && height >= recommendedHeight;
        
        setImageSizeInfo({
          width,
          height,
          isGoodQuality,
          isTooSmall
        });
        setShowImageSizeCheck(true);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // プリント範囲用の画像アップロード処理（ポップアップを表示）
  const handlePrintAreaFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // 画像ファイルのみをフィルタリング
    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    
    // File[]配列として保存
    setPendingFiles(imageFiles);
    setUploadSource("printArea");
    
    // 初回のみ利用規約ポップアップを表示、2回目以降は直接サイズチェック
    if (hasAgreedToTerms) {
      checkImageSize(imageFiles);
    } else {
      setShowUploadConfirm(true);
    }
  };

  // 実際の画像アップロード処理
  const confirmPrintAreaFileUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const newImageSrcs: string[] = [];
    let processedCount = 0;
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImageSrcs.push(e.target.result as string);
          processedCount++;
          
          if (processedCount === files.length) {
            // 画像オブジェクトを作成
            // 初期スケールはプリント範囲の60%以内に収まるように設定
            const baseSize = 60; // オブジェクトの基本サイズ（%）
            const maxScale = 100 / baseSize; // プリント範囲いっぱいまでのスケール
            const initialScale = Math.min(1, maxScale * 0.8); // 初期サイズは最大の80%
            
            const newImageObjects: ImageObject[] = newImageSrcs.map((src, index) => ({
              id: `${Date.now()}-${index}`,
              src,
              x: 50, // 中央
              y: 50, // 中央
              scale: initialScale,
              rotation: 0,
              zIndex: printedImages.length + index,
            }));
            
            // プリント範囲とアップロード済み画像の両方に追加
            setPrintedImages((prev) => [...prev, ...newImageObjects]);
            setUploadedImages((prev) => [...newImageSrcs, ...prev]);
            // 画像管理タブに切り替え
            setActiveTab("image");
            setIsCollapsed(true); // サイドバーを縮小してコンパネを表示
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // プリント範囲のドラッグ＆ドロップ
  const handlePrintAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPrintAreaDragging(true);
  };

  const handlePrintAreaDragLeave = () => {
    setIsPrintAreaDragging(false);
  };

  const handlePrintAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPrintAreaDragging(false);
    handlePrintAreaFileUpload(e.dataTransfer.files);
  };

  // ファイル選択処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    e.target.value = ""; // ファイル入力をリセット
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingUpload(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingUpload(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingUpload(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // カラースウォッチクリック処理
  const handleColorClick = (e: React.MouseEvent, productId: string, colorImage: string | null, colorName: string, productName: string) => {
    e.stopPropagation(); // 親の商品カードクリックイベントを防ぐ
    console.log("Color clicked:", { productId, colorImage, colorName, productName });
    if (colorImage) {
      setSelectedProductImage(colorImage);
      setSelectedProductName(`${productName} - ${colorName}`);
      setSelectedProductId(productId);
      console.log("Updated selectedProductImage to:", colorImage);
    } else {
      console.warn("No color image available for:", colorName);
    }
  };

  // AI生成画像を画像管理に保存
  const handleSaveToGallery = () => {
    if (generatedImage) {
      setUploadedImages((prev) => [generatedImage, ...prev]);
      // 画像管理タブに切り替え
      setActiveTab("image");
    }
  };

  // 参照画像アップロード処理
  const handleReferenceFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setReferenceImages((prev) => [...newImages, ...prev]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // 参照画像ファイル選択処理
  const handleReferenceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleReferenceFileUpload(e.target.files);
    e.target.value = ""; // ファイル入力をリセット
  };

  // 参照画像ドラッグ&ドロップ処理
  const handleReferenceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsReferenceDragging(true);
  };

  const handleReferenceDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsReferenceDragging(false);
  };

  const handleReferenceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsReferenceDragging(false);
    handleReferenceFileUpload(e.dataTransfer.files);
  };

  // スタイルフォルダマッピング
  const styleFolderMap: { [key: string]: string } = {
    "カップル": "couples",
    "結婚式": "weddings",
    "家族": "families",
    "記念日": "anniversaries",
    "スポーツ": "sports",
    "チーム": "teams",
    "ビジネス": "business",
    "イベント": "events",
    "ペット": "pets",
    "動物": "animals",
    "趣味": "hobbies",
    "ファン": "fans",
    "季節": "seasons",
    "ホリデー": "holidays",
    "旅行": "travel",
    "冒険": "adventure",
    "芸術": "art",
    "クリエイティブ": "creative",
    "キッズ": "kids",
    "教育": "education"
  };

  // スタイル画像を取得（仮：各フォルダに1.jpgがあると仮定）
  const getStyleImages = async (styleName: string): Promise<string[]> => {
    const folderName = styleFolderMap[styleName];
    if (!folderName) return [];
    
    try {
      const url = new URL("/api/style-images", window.location.origin);
      url.searchParams.set("style", folderName);
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success && data.images) {
        return data.images;
      }
    } catch (error) {
      console.error("スタイル画像の取得に失敗:", error);
    }
    
    return [];
  };

  // 画像のメタデータを取得
  const fetchImageMetadata = async (imagePath: string): Promise<string> => {
    try {
      const url = new URL("/api/image-metadata", window.location.origin);
      url.searchParams.set("path", imagePath);
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success && data.description) {
        return data.description;
      }
    } catch (error) {
      console.error("メタデータの取得に失敗:", error);
    }
    return "メタデータがありません";
  };

  // プロンプトに反映
  const handleApplyPrompt = (text: string) => {
    setPromptText(text);
    setIsImagePopupOpen(false);
  };

  // プリント範囲を計算（mm → px変換）
  const getPrintAreaInPixels = (containerWidth: number) => {
    // 商品名または画像パスから商品タイプを判定
    const imagePath = selectedProductImage.toLowerCase();
    const productName = selectedProductName.toLowerCase();
    let currentProductId = product.id;
    
    // まず商品名から判定（Shopify商品の場合）
    if (productName.includes('パーカ') || productName.includes('hoodie')) {
      currentProductId = 'hoodie';
    } else if (productName.includes('スウェットシャツ') || productName.includes('sweatshirt')) {
      currentProductId = 'sweatshirt';
    } else if (productName.includes('長袖') || productName.includes('long')) {
      currentProductId = 'box-tshirt-long';
    } else if (productName.includes('半袖') || productName.includes('short') || productName.includes('tシャツ')) {
      currentProductId = 'box-tshirt-short';
    }
    // 画像パスからも判定（ローカル画像の場合）
    else if (imagePath.includes('hoodie')) {
      currentProductId = 'hoodie';
    } else if (imagePath.includes('sweatshirt')) {
      currentProductId = 'sweatshirt';
    } else if (imagePath.includes('box-tshirt-long')) {
      currentProductId = 'box-tshirt-long';
    } else if (imagePath.includes('box-tshirt-short')) {
      currentProductId = 'box-tshirt-short';
    }
    
    // 商品ごとにプリント範囲のスケールを調整
    let baseScale = 0.36; // 全商品共通: 0.36
    let topOffset = 0; // デフォルト: オフセットなし
    
    // 商品ごとに個別のオフセットを設定
    if (currentProductId === 'box-tshirt-short') {
      topOffset = -20; // 半袖Tシャツ: 上に20px移動
    } else if (currentProductId === 'box-tshirt-long') {
      topOffset = -25; // 長袖Tシャツ: 上に25px移動
    } else if (currentProductId === 'sweatshirt') {
      topOffset = -35; // スウェットシャツ: 上に35px移動
    } else if (currentProductId === 'hoodie') {
      topOffset = 10; // パーカー: 下に10px移動
    }
    
    const scale = containerWidth * baseScale;
    const ratio = product.printAreaWidth / product.printAreaHeight;
    
    let width, printHeight;
    if (ratio > 1) {
      // 横長
      width = scale;
      printHeight = scale / ratio;
    } else {
      // 縦長
      printHeight = scale;
      width = scale * ratio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(printHeight),
      left: Math.round((containerWidth - width) / 2),
      top: topOffset,
    };
  };

  // 画像ロード時・リサイズ時にプリント範囲を計算
  const updatePrintArea = () => {
    if (!mainImageRef.current) return;
    
    const containerWidth = mainImageRef.current.offsetWidth;
    const imageHeight = mainImageRef.current.offsetHeight;
    const printArea = getPrintAreaInPixels(containerWidth);
    
    // 画像の中央に配置
    const topPosition = (imageHeight - printArea.height) / 2 + printArea.top;
    
    // 点線の色を決定（画像ファイル名から商品カラーを判定）
    const imagePath = selectedProductImage.toLowerCase();
    let borderColor = '#666666'; // デフォルト: グレー
    
    if (imagePath.includes('black')) {
      // 黒い商品 → 白い点線
      borderColor = '#ffffff';
    } else if (imagePath.includes('white')) {
      // 白い商品 → グレーの点線
      borderColor = '#999999';
    }
    
    setPrintAreaStyle({
      width: `${printArea.width}px`,
      height: `${printArea.height}px`,
      left: `${printArea.left}px`,
      top: `${topPosition}px`,
      border: `1px dashed ${borderColor}`,
      pointerEvents: "none",
    });
  };

  // 画像変更時・ウィンドウリサイズ時にプリント範囲を更新
  useEffect(() => {
    updatePrintArea();
    
    window.addEventListener('resize', updatePrintArea);
    return () => window.removeEventListener('resize', updatePrintArea);
  }, [selectedProductImage]);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        height: "auto",
        backgroundColor: "#f8f8f8",
        display: "flex",
        overflow: "visible",
        fontFamily: '"Yu Gothic", "游ゴシック体", YuGothic, "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", sans-serif',
        position: "relative",
      }}
    >
      {/* グローバルスタイル（モバイル対応） */}
      <style>{`
        @media (max-width: 768px) {
          /* モバイル用：ルートdivを100vh固定に戻す */
          body > div {
            height: 100vh !important;
            min-height: 100vh !important;
            overflow: hidden !important;
          }
          
          /* モバイル用：サイドバーを下部固定タブバーに */
          .mobile-sidebar {
            position: fixed !important;
            left: 0 !important;
            top: auto !important;
            bottom: 80px !important;
            width: 100% !important;
            height: 80px !important;
            padding: 10px 15px !important;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
            z-index: 100 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          
          /* モバイル用：ロゴを非表示 */
          .desktop-only {
            display: none !important;
          }
          
          /* モバイル用：メニューを横並びに */
          .mobile-sidebar nav {
            flex-direction: row !important;
            gap: 0 !important;
            width: 100% !important;
            justify-content: space-around !important;
          }
          
          /* モバイル用：メニューボタンのスタイル */
          .mobile-menu-button {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 12px !important;
            gap: 4px !important;
            min-width: 0 !important;
            height: auto !important;
            width: auto !important;
            border: none !important;
            background-color: transparent !important;
            box-shadow: none !important;
            opacity: 1 !important;
          }
          
          .mobile-menu-button-icon {
            margin: 0 !important;
          }
          
          .mobile-menu-button-label {
            display: block !important;
            font-size: 10px !important;
            text-align: center !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            white-space: nowrap !important;
          }
          
          /* デスクトップ用のラベルを非表示 */
          .mobile-menu-button > span:not(.mobile-menu-button-icon):not(.mobile-menu-button-label) {
            display: none !important;
          }
          
          /* モバイル用：ホバーエフェクトを無効化 */
          .mobile-sidebar nav > div > div {
            display: none !important;
          }
          
          /* デスクトップ専用要素を非表示 */
          .desktop-title-only {
            display: none !important;
          }
          
          /* モバイル専用要素を表示 */
          .mobile-show {
            display: block !important;
          }
          
          /* モバイル用：コンパネを下部に配置 */
          .mobile-panel {
            position: fixed !important;
            left: 0 !important;
            top: auto !important;
            bottom: 160px !important;
            width: 100% !important;
            height: 240px !important;
            padding: 15px 15px 15px 15px !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            z-index: 90 !important;
            transform: translateY(0) !important;
            transition: transform 0.3s ease-in-out !important;
            box-sizing: border-box !important;
          }
          
          .mobile-panel.hidden {
            transform: translateY(100%) !important;
          }
          
          /* モバイル用：アイテムコンパネは縦スクロール無効 */
          .mobile-panel:has(.mobile-item-layout) {
            overflow-y: hidden !important;
          }
          
          /* モバイル用：コンパネ2をタブで切り替え */
          .mobile-panel2 {
            position: fixed !important;
            left: 0 !important;
            top: auto !important;
            bottom: 160px !important;
            width: 100% !important;
            height: 50vh !important;
            padding: 20px 15px !important;
            overflow: auto !important;
            z-index: 95 !important;
          }
          
          /* モバイル用：メインエリアを全画面に */
          .mobile-main {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 400px !important;
            padding: 10px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          }
          
          /* モバイル用：コンパネの項目を横スクロール */
          .mobile-scroll-container {
            display: flex !important;
            overflow-x: auto !important;
            gap: 15px !important;
            padding-bottom: 10px !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .mobile-scroll-item {
            flex: 0 0 280px !important;
            max-width: 280px !important;
          }
          
          /* モバイル用：カートに追加ボタンを非表示 */
          .desktop-cart-button {
            display: none !important;
          }
          
          /* モバイル用：カートに追加ボタンを表示 */
          .mobile-cart-button {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 80px !important;
            background-color: #303030 !important;
            color: #ffffff !important;
            border: none !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            z-index: 100 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
          }
          
          /* モバイル用：アイテムメニューのレイアウト */
          .mobile-item-layout {
            display: flex !important;
            gap: 15px !important;
            height: 100% !important;
          }
          
          .mobile-item-info {
            flex: 0 0 100px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          .mobile-item-list {
            flex: 1 !important;
            display: flex !important;
            overflow-x: auto !important;
            gap: 10px !important;
            padding-bottom: 10px !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .mobile-item-card {
            flex: 0 0 140px !important;
            max-width: 140px !important;
            position: relative !important;
            overflow: visible !important;
          }
          
          /* モバイル用：商品画像を正方形コンテナに（画像は3:4維持、横に余白） */
          .mobile-item-card > div:first-child {
            padding-bottom: 100% !important;
            margin-bottom: 60px !important;
          }
          
          .mobile-item-card > div:first-child img {
            object-fit: contain !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          /* モバイル用：商品情報を下端固定 */
          .mobile-item-card .product-info {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            padding: 8px 8px 8px 8px !important;
            background: linear-gradient(to top, rgba(248, 248, 248, 1) 0%, rgba(248, 248, 248, 1) 70%, rgba(248, 248, 248, 0) 100%) !important;
            border-radius: 0 0 13px 13px !important;
          }
          
          .mobile-item-card h3 {
            font-size: 11px !important;
            margin: 0 0 3px 0 !important;
            line-height: 1.2 !important;
          }
          
          .mobile-item-card p {
            font-size: 10px !important;
            margin: 0 0 3px 0 !important;
            line-height: 1.2 !important;
          }
          
          .mobile-item-card .color-swatches {
            gap: 3px !important;
            margin-bottom: 0 !important;
            margin-top: 3px !important;
          }
          
          .mobile-item-card .color-swatch {
            width: 12px !important;
            height: 12px !important;
          }
          
          .mobile-item-card .color-label {
            font-size: 9px !important;
          }
          
          .mobile-show {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-item-layout {
            display: block !important;
          }
          
          .mobile-item-info {
            display: none !important;
          }
          
          .mobile-item-list {
            display: block !important;
          }
          
          .mobile-item-card {
            flex: none !important;
            max-width: none !important;
          }
          
          .mobile-show {
            display: none !important;
          }
          
          .mobile-cart-button {
            display: none !important;
          }
        }
      `}</style>
      {/* コンパネ2（スタイル詳細） */}
      <div
        className="mobile-panel2"
        style={{
          position: "absolute",
          left: "339.5px",
          top: 0,
          width: "259.5px",
          height: "100vh",
          backgroundColor: "rgba(238, 238, 238, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 4,
          boxShadow: "5px 0 15px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          paddingTop: "35px",
          paddingBottom: "35px",
          paddingLeft: "17.5px",
          paddingRight: "17.5px",
          transform: isPanel2Open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          pointerEvents: isPanel2Open ? "auto" : "none",
        }}
      >
        {selectedStyle && (
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#303030", marginTop: "0", marginBottom: "15px" }}>
              {selectedStyle}
            </h2>
            
            {/* スタイル画像一覧 */}
            <div style={{ 
              columnCount: 2,
              columnGap: "9px"
            }}>
              {styleImages.map((imageSrc, index) => (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    borderRadius: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "4.5px",
                    breakInside: "avoid",
                    display: "inline-block",
                  }}
                  onClick={async () => {
                    setSelectedPopupImage(imageSrc);
                    const metadata = await fetchImageMetadata(imageSrc);
                    setImageMetadata(metadata);
                    setIsImagePopupOpen(true);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={`${selectedStyle} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 画像ポップアップ */}
      {isImagePopupOpen && selectedPopupImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
          onClick={() => setIsImagePopupOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "13px",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 画像 */}
            <img
              src={selectedPopupImage}
              alt="選択された画像"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "13px",
                marginBottom: "20px",
              }}
            />

            {/* IPTCメタデータ */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#303030", marginBottom: "10px" }}>
                この画像のプロンプト
              </h3>
              <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.6", margin: "0", whiteSpace: "pre-wrap" }}>
                {imageMetadata}
              </p>
            </div>

            {/* プロンプトに反映ボタン */}
            <button
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffffff",
                backgroundColor: "#303030",
                border: "none",
                borderRadius: "13px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#404040";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#303030";
              }}
              onClick={() => {
                handleApplyPrompt(imageMetadata);
              }}
            >
              プロンプトに反映
            </button>
          </div>
        </div>
      )}

      {/* コンテンツパネル（サイドバーの下） */}
      <div
        ref={scrollContainerRef}
        className={`mobile-panel ${!activeTab ? 'hidden' : ''}`}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "339.5px",
          height: "100vh",
          backgroundColor: "#eeeeee",
          zIndex: 5,
          boxShadow: isCollapsed ? "5px 0 15px rgba(0, 0, 0, 0.1)" : "none",
          transition: isCollapsed ? "none" : "box-shadow 0s 0.28s",
          overflow: "auto",
          paddingTop: "35px",
          paddingBottom: "35px",
          paddingLeft: "97.5px",
          paddingRight: "17.5px",
        }}
      >
        {/* パネルの内容（activeTabに応じて表示） */}
        {activeTab && (
          <div>
            <h2 className="desktop-title-only" style={{ fontSize: "16px", fontWeight: 700, color: "#303030", marginTop: "0", marginBottom: "15px" }}>
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h2>

            {/* ダミーテキスト */}
            <p className="desktop-title-only" style={{ fontSize: "12px", fontWeight: 400, color: "#666", lineHeight: "1.6", margin: "0 0 20px 0" }}>
              ここにダミーテキストが入ります。商品の説明やカテゴリーの情報など、ユーザーに伝えたい内容を表示することができます。
            </p>

            {/* アイテムタブの内容 */}
            {activeTab === "item" && (
              <div className="mobile-item-layout">
                {/* モバイル用：左側の情報エリア */}
                <div className="mobile-item-info">
                  <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#303030", margin: 0, display: "none" }} className="mobile-show">
                    {menuItems.find((item) => item.id === activeTab)?.label}
                  </h2>
                  <p style={{ fontSize: "11px", fontWeight: 400, color: "#666", lineHeight: "1.4", margin: 0, display: "none" }} className="mobile-show">
                    商品の説明やカテゴリーの情報など
                  </p>
                </div>
                
                {/* モバイル用：横スクロール商品リスト */}
                <div className="mobile-item-list">
                  {products.map((shopifyProduct) => {
                    const isHovered = hoveredProductId === shopifyProduct.id;
                    const isSelected = selectedProductId === shopifyProduct.id;
                    const showBorder = isHovered || isSelected;
                    
                    return (
                      <div
                        key={shopifyProduct.id}
                        className="mobile-item-card"
                        style={{
                          backgroundColor: "#f8f8f8",
                          borderRadius: "13px",
                          marginBottom: "17.5px",
                          border: showBorder ? "1px solid #303030" : "1px solid transparent",
                          boxShadow: isSelected ? "0 5px 15px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => handleProductClick(shopifyProduct.id, shopifyProduct.image, shopifyProduct.title)}
                        onMouseEnter={() => setHoveredProductId(shopifyProduct.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                    {/* 商品画像 */}
                    {shopifyProduct.image && (
                      <div style={{
                        width: "100%",
                        paddingBottom: "133.33%", /* 3:4 = 4/3 * 100% = 133.33% */
                        position: "relative",
                        borderRadius: "13px 13px 0 0",
                        overflow: "hidden",
                      }}>
                        <img
                          src={shopifyProduct.image}
                          alt={shopifyProduct.imageAlt}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* 商品情報 */}
                    <div className="product-info" style={{ padding: "17.5px 17.5px" }}>
                      {/* 商品名 */}
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#303030", margin: "0 0 6px 0" }}>
                        {shopifyProduct.title}
                      </h3>

                      {/* 価格 */}
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#666", margin: "0 0 6px 0" }}>
                        ¥{parseInt(shopifyProduct.price).toLocaleString()}（税込）
                      </p>

                      {/* カラー */}
                      {shopifyProduct.colors.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <span className="color-label" style={{ fontSize: "12px", color: "#666" }}>カラー</span>
                          <div className="color-swatches" style={{ display: "flex", gap: "4px" }}>
                            {shopifyProduct.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="color-swatch"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50%",
                                  backgroundColor: color.hex,
                                  border: "1px solid #ddd",
                                  cursor: color.image ? "pointer" : "default",
                                  transition: "transform 0.2s ease",
                                }}
                                title={color.name}
                                onClick={(e) => handleColorClick(e, shopifyProduct.id, color.image, color.name, shopifyProduct.title)}
                                onMouseEnter={(e) => {
                                  if (color.image) {
                                    e.currentTarget.style.transform = "scale(1.2)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
                </div>
              </div>
            )}

            {/* 画像管理タブの内容 */}
            {activeTab === "image" && (
              <div>
                {/* 隠しファイル入力 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />

                {/* 大きなアップロードカード */}
                <div
                  style={{
                    width: "223.5px",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "13px",
                    boxShadow: isDraggingUpload ? "inset 0 2px 8px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: isDraggingUpload ? "2px dashed #303030" : "2px dashed transparent",
                    transition: "all 0.2s ease",
                    marginBottom: "18px",
                    padding: "20px",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {getImageIcon(32)}
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#303030", marginTop: "12px", marginBottom: "10px" }}>
                    画像を追加
                  </span>
                  <div style={{ fontSize: "9px", color: "#666", textAlign: "center", lineHeight: "1.5" }}>
                    <p style={{ margin: "0 0 2px 0", fontWeight: 600 }}>推奨: 2953×3685px以上</p>
                    <p style={{ margin: "0 0 5px 0", fontWeight: 600 }}>RGB、300dpi</p>
                    <p style={{ margin: "0 0 4px 0" }}>対応形式: JPG, PNG (最大15MB)</p>
                    <p style={{ margin: "0", fontSize: "8px", color: "#999" }}>著作権を侵害する画像の使用は禁止です</p>
                  </div>
                </div>

                {/* 小さな画像カード（グリッドレイアウト）*/}
                {uploadedImages.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 107.5px)",
                      gap: "9px",
                    }}
                  >
                    {uploadedImages.map((imageSrc, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setFullSizeImageSrc(imageSrc);
                          setShowFullSizeImage(true);
                        }}
                        style={{
                          width: "107.5px",
                          height: "107.5px",
                          backgroundColor: "#f8f8f8",
                          borderRadius: "13px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt={`アップロード画像 ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI画像生成タブの内容 */}
            {activeTab === "ai" && (
              <div>
                {/* スタイル選択エリア */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#303030", marginBottom: "8px" }}>
                    スタイル
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      overflowX: "auto",
                      overflowY: "hidden",
                      paddingBottom: "5px",
                    }}
                  >
                    {[
                      { name: "カップル", image: "couples.jpg" },
                      { name: "結婚式", image: "weddings.jpg" },
                      { name: "家族", image: "families.jpg" },
                      { name: "記念日", image: "anniversaries.jpg" },
                      { name: "スポーツ", image: "sports.jpg" },
                      { name: "チーム", image: "teams.jpg" },
                      { name: "ビジネス", image: "business.jpg" },
                      { name: "イベント", image: "events.jpg" },
                      { name: "ペット", image: "pets.jpg" },
                      { name: "動物", image: "animals.jpg" },
                      { name: "趣味", image: "hobbies.jpg" },
                      { name: "ファン", image: "fans.jpg" },
                      { name: "季節", image: "seasons.jpg" },
                      { name: "ホリデー", image: "holidays.jpg" },
                      { name: "旅行", image: "travel.jpg" },
                      { name: "冒険", image: "adventure.jpg" },
                      { name: "芸術", image: "art.jpg" },
                      { name: "クリエイティブ", image: "creative.jpg" },
                      { name: "キッズ", image: "kids.jpg" },
                      { name: "教育", image: "education.jpg" }
                    ].map((style, index) => (
                      <div
                        key={index}
                        style={{
                          minWidth: "107.5px",
                          width: "107.5px",
                          height: "107.5px",
                          backgroundImage: `url(/images/style/${style.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "13px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: "1px solid transparent",
                          flexShrink: 0,
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = "1px solid #303030";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = "1px solid transparent";
                        }}
                        onClick={async () => {
                          setSelectedStyle(style.name);
                          setIsPanel2Open(true);
                          // スタイル画像を取得
                          const images = await getStyleImages(style.name);
                          setStyleImages(images);
                        }}
                      >
                        {/* 半透明オーバーレイ */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "13px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#ffffff",
                            textAlign: "center",
                            position: "relative",
                            zIndex: 1,
                            textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                          }}
                        >
                          {style.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* プロンプト入力エリア */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#303030", marginBottom: "8px" }}>
                    プロンプト
                  </label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="画像生成のためのテキストプロンプトを入力してください..."
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "12px",
                      fontSize: "12px",
                      color: "#303030",
                      backgroundColor: "#f8f8f8",
                      border: "1px solid #ddd",
                      borderRadius: "13px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      resize: "vertical",
                      fontFamily: "inherit",
                      lineHeight: "1.6",
                    }}
                  />
                </div>

                {/* 画像入力エリア */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#303030", marginBottom: "8px" }}>
                    画像アップロード<span style={{ fontWeight: 400, color: "#666" }}>（最大14枚）</span>
                  </label>
                  
                  {/* 隠しファイル入力 */}
                  <input
                    ref={referenceFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleReferenceFileSelect}
                  />

                  {/* アップロードエリア */}
                  <div
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      backgroundColor: "#f8f8f8",
                      borderRadius: "13px",
                      boxShadow: isReferenceDragging ? "inset 0 2px 8px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      border: isReferenceDragging ? "2px dashed #303030" : "2px dashed transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      padding: "20px",
                    }}
                    onClick={() => referenceFileInputRef.current?.click()}
                    onDragOver={handleReferenceDragOver}
                    onDragLeave={handleReferenceDragLeave}
                    onDrop={handleReferenceDrop}
                  >
                    {getImageIcon(24)}
                    <span style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
                      クリックまたはドラッグ&ドロップで画像を追加
                    </span>
                  </div>

                  {/* アップロード済み参照画像 */}
                  {referenceImages.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(107.5px, 1fr))",
                        gap: "9px",
                        marginTop: "12px",
                      }}
                    >
                      {referenceImages.map((imageSrc, index) => (
                        <div
                          key={index}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            backgroundColor: "#f8f8f8",
                            borderRadius: "13px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={imageSrc}
                            alt={`参照画像 ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {/* 削除ボタン（オプション） */}
                          <button
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              width: "24px",
                              height: "24px",
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              cursor: "pointer",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setReferenceImages((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* アスペクト比選択 */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#303030", marginBottom: "8px" }}>
                    アスペクト比
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}>
                    {[
                      { value: "1:1", width: 24, height: 24, label: "1:1" },
                      { value: "4:3", width: 28, height: 21, label: "4:3" },
                      { value: "3:4", width: 21, height: 28, label: "3:4" },
                      { value: "16:9", width: 32, height: 18, label: "16:9" },
                      { value: "9:16", width: 18, height: 32, label: "9:16" },
                      { value: "3:2", width: 30, height: 20, label: "3:2" },
                      { value: "2:3", width: 20, height: 30, label: "2:3" },
                      { value: "21:9", width: 35, height: 15, label: "21:9" },
                    ].map((aspect) => (
                      <button
                        key={aspect.value}
                        type="button"
                        style={{
                          padding: "12px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#303030",
                          backgroundColor: "#f8f8f8",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#e8e8e8";
                          e.currentTarget.style.borderColor = "#303030";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f8f8";
                          e.currentTarget.style.borderColor = "#ddd";
                        }}
                      >
                        {/* アスペクト比アイコン */}
                        <div
                          style={{
                            width: `${aspect.width}px`,
                            height: `${aspect.height}px`,
                            backgroundColor: "#303030",
                            borderRadius: "2px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                          }}
                        />
                        {/* ラベル */}
                        <span style={{ lineHeight: 1 }}>{aspect.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 生成ボタン */}
                <button
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    backgroundColor: "#303030",
                    border: "none",
                    borderRadius: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "20px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#404040";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#303030";
                  }}
                  onClick={() => {
                    console.log("画像生成開始");
                    // テスト用：ダミー画像を生成画像として設定
                    setGeneratedImage("https://via.placeholder.com/800x450/4a90e2/ffffff?text=AI+Generated+Image");
                    // コンパネ2を閉じる
                    setIsPanel2Open(false);
                    setSelectedStyle(null);
                  }}
                >
                  画像を生成
                </button>

                {/* 生成された画像表示エリア */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={generatedImage || "https://via.placeholder.com/800x450/cccccc/666666?text=Generated+Image"}
                    alt="生成された画像"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* 画像管理に保存ボタン */}
                <button
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: generatedImage ? "#ffffff" : "#999",
                    backgroundColor: generatedImage ? "#303030" : "#e0e0e0",
                    border: "none",
                    borderRadius: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    cursor: generatedImage ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                  }}
                  disabled={!generatedImage}
                  onMouseEnter={(e) => {
                    if (generatedImage) {
                      e.currentTarget.style.backgroundColor = "#404040";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (generatedImage) {
                      e.currentTarget.style.backgroundColor = "#303030";
                    }
                  }}
                  onClick={handleSaveToGallery}
                >
                  画像管理に保存
                </button>
              </div>
            )}

            {/* 他のタブの内容 */}
            {activeTab !== "item" && activeTab !== "image" && activeTab !== "ai" && (
              <div>
                <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.6" }}>
                  このメニューの内容は別途実装されます。
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* サイドバー */}
      <aside
        className="mobile-sidebar"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: isCollapsed ? "80px" : "339px",
          height: "100%",
          backgroundColor: "#f8f8f8",
          paddingLeft: "17.5px",
          paddingRight: "17.5px",
          boxShadow: "5px 0 15px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
          transition: "width 0.3s ease-in-out",
          overflow: isCollapsed ? "visible" : "hidden",
        }}
      >
        {/* PrintAize ロゴ */}
        <h1
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#303030",
            marginLeft: "10.5px",
            marginTop: "35px",
            marginBottom: "35px",
            letterSpacing: "0",
            whiteSpace: "nowrap",
          }}
          className="desktop-only"
        >
          {isCollapsed ? "PAI" : "PrintAize"}
        </h1>

        {/* メニューボタン */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {menuItems.map((item) => {
            const isHovered = hoveredTab === item.id && !isCollapsed;
            const isActive = activeTab === item.id;
            const showBorder = isHovered || isActive;
            const isCollapsedHovered = isCollapsed && hoveredTab === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  position: "relative",
                }}
              >
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className="mobile-menu-button"
                  style={{
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10.5px",
                    paddingRight: isCollapsed ? "10.5px" : "16px",
                    backgroundColor: showBorder ? "transparent" : "#f8f8f8",
                    border: showBorder ? "1px solid #303030" : "1px solid transparent",
                    borderRadius: isCollapsed && isActive ? "50%" : "17.16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    width: isCollapsed ? "auto" : "fit-content",
                    justifyContent: "flex-start",
                    boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
                    position: "relative",
                    opacity: isCollapsedHovered ? 0 : 1,
                    marginLeft: "0",
                  }}
                >
                  {/* アイコン */}
                  <span className="mobile-menu-button-icon">
                    {getIcon(item.id)}
                  </span>
                  {/* テキスト（展開時のみ） */}
                  {!isCollapsed && (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#303030",
                        lineHeight: "35px",
                        marginLeft: "8px",
                        whiteSpace: "nowrap",
                        opacity: isCollapsed ? 0 : 1,
                        transition: "opacity 0.2s ease-in-out",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                  {/* モバイル用：常にラベルを表示 */}
                  <span
                    className="mobile-menu-button-label"
                    style={{
                      display: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#303030",
                    }}
                  >
                    {item.label}
                  </span>
                </button>

                {/* 縮小時のホバーボタン（コンパネの上にレイヤー表示） */}
                {isCollapsedHovered && (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      height: "45px",
                      backgroundColor: "#818181",
                      border: "1px solid #303030",
                      borderRadius: "17.16px",
                      paddingLeft: "10.5px",
                      paddingRight: "16px",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      zIndex: 1000,
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    {getIcon(item.id, "#ffffff")}
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: "45px",
                        marginLeft: "8px",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 展開ボタン（縮小時のみ表示） */}
        {isCollapsed && (
          <button
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setActiveTab(null);
              setIsCollapsed(false);
            }}
          >
            {getExpandIcon()}
          </button>
        )}

        {/* カートに追加ボタン */}
        <button
          className="desktop-cart-button"
          style={{
            position: "absolute",
            bottom: "35px",
            left: isCollapsed ? "50%" : "17.5px",
            right: isCollapsed ? "auto" : "17.5px",
            transform: isCollapsed ? "translateX(-50%)" : "none",
            width: isCollapsed ? "auto" : "auto",
            height: isCollapsed ? "auto" : "70px",
            backgroundColor: isCollapsed ? "transparent" : "#818181",
            color: "#ffffff",
            border: "none",
            borderRadius: isCollapsed ? "0" : "13px",
            fontSize: "18px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            paddingLeft: isCollapsed ? "0" : "70px",
            gap: "10px",
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            // 機能は別途実装
            console.log("カートに追加");
          }}
        >
          {getCartIcon(isCollapsed ? "#303030" : "#ffffff")}
          {!isCollapsed && <span>カートに追加</span>}
        </button>
      </aside>

      {/* モバイル用カートに追加ボタン */}
      <button
        className="mobile-cart-button"
        style={{
          display: "none",
        }}
        onClick={() => {
          // 機能は別途実装
          console.log("カートに追加");
        }}
      >
        {getCartIcon("#ffffff")}
        <span>カートに追加</span>
      </button>

      {/* メインエリア（Tシャツ表示） */}
      <main
        className="mobile-main"
        style={{
          position: "absolute",
          left: "339px",
          top: 0,
          right: 0,
          height: "100%",
          backgroundColor: "#f8f8f8",
          padding: "17.5px",
          overflow: "auto",
        }}
      >
        {/* 商品画像コンテナ */}
        <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "2252px" }}>
          {/* コントロールメニュー（プリント範囲に画像がある場合のみ表示） */}
          {isMounted && printedImages.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "17.5px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "17.16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "10.5px 16px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "70px",
              }}
            >
              {/* 元に戻す */}
              <button
                onClick={handleUndo}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M32.0066283,20 C36.4214054,20 40,23.5806679 40,28 C40,32.4151984 36.4153529,36 32.0066283,36 L8,36 C6.8954305,36 6,36.8954305 6,38 C6,39.1045695 6.8954305,40 8,40 L32.0066283,40 C38.6245304,40 44,34.6242988 44,28 C44,21.3720473 38.6310631,16 32.0066283,16 L12.8284271,16 L17.4142136,11.4142136 C18.1952621,10.633165 18.1952621,9.36683502 17.4142136,8.58578644 C16.633165,7.80473785 15.366835,7.80473785 14.5857864,8.58578644 L6.58578644,16.5857864 C5.80473785,17.366835 5.80473785,18.633165 6.58578644,19.4142136 L14.5857864,27.4142136 C15.366835,28.1952621 16.633165,28.1952621 17.4142136,27.4142136 C18.1952621,26.633165 18.1952621,25.366835 17.4142136,24.5857864 L12.8284271,20 L32.0066283,20 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  元に戻す
                </span>
              </button>

              {/* やり直し（アイコン左右反転） */}
              <button
                onClick={handleRedo}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px", transform: "scaleX(-1)" }}>
                  <path d="M32.0066283,20 C36.4214054,20 40,23.5806679 40,28 C40,32.4151984 36.4153529,36 32.0066283,36 L8,36 C6.8954305,36 6,36.8954305 6,38 C6,39.1045695 6.8954305,40 8,40 L32.0066283,40 C38.6245304,40 44,34.6242988 44,28 C44,21.3720473 38.6310631,16 32.0066283,16 L12.8284271,16 L17.4142136,11.4142136 C18.1952621,10.633165 18.1952621,9.36683502 17.4142136,8.58578644 C16.633165,7.80473785 15.366835,7.80473785 14.5857864,8.58578644 L6.58578644,16.5857864 C5.80473785,17.366835 5.80473785,18.633165 6.58578644,19.4142136 L14.5857864,27.4142136 C15.366835,28.1952621 16.633165,28.1952621 17.4142136,27.4142136 C18.1952621,26.633165 18.1952621,25.366835 17.4142136,24.5857864 L12.8284271,20 L32.0066283,20 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  やり直し
                </span>
              </button>

              {/* 上下中央 */}
              <button
                onClick={handleAlignVerticalCenter}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M22,6.99961498 C22,5.89525812 22.8877296,5 24,5 C25.1045695,5 26,5.88743329 26,6.99961498 L26,13.000385 C26,14.1047419 25.1122704,15 24,15 C22.8954305,15 22,14.1125667 22,13.000385 L22,6.99961498 Z M22,20.999615 C22,19.8952581 22.8877296,19 24,19 C25.1045695,19 26,19.8874333 26,20.999615 L26,27.000385 C26,28.1047419 25.1122704,29 24,29 C22.8954305,29 22,28.1125667 22,27.000385 L22,20.999615 Z M22,34.999615 C22,33.8952581 22.8877296,33 24,33 C25.1045695,33 26,33.8874333 26,34.999615 L26,41.000385 C26,42.1047419 25.1122704,43 24,43 C22.8954305,43 22,42.1125667 22,41.000385 L22,34.999615 Z M33.4547978,26.0152987 C31.5467657,24.90228 31.5442237,23.0992028 33.4547978,21.9847013 L38.5452022,19.0152987 C40.4532343,17.90228 42,18.7873299 42,20.9931023 L42,27.0068977 C42,29.2122272 40.4557763,30.0992028 38.5452022,28.9847013 L33.4547978,26.0152987 Z M14.5452022,26.0152987 L9.4547978,28.9847013 C7.54422373,30.0992028 6,29.2122272 6,27.0068977 L6,20.9931023 C6,18.7873299 7.54676566,17.90228 9.4547978,19.0152987 L14.5452022,21.9847013 C16.4557763,23.0992028 16.4532343,24.90228 14.5452022,26.0152987 Z" fill="#303030" transform="translate(24, 24) rotate(-270) translate(-24, -24)" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  上下中央
                </span>
              </button>

              {/* 左右中央 */}
              <button
                onClick={handleAlignHorizontalCenter}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M22,6.99961498 C22,5.89525812 22.8877296,5 24,5 C25.1045695,5 26,5.88743329 26,6.99961498 L26,13.000385 C26,14.1047419 25.1122704,15 24,15 C22.8954305,15 22,14.1125667 22,13.000385 L22,6.99961498 Z M22,20.999615 C22,19.8952581 22.8877296,19 24,19 C25.1045695,19 26,19.8874333 26,20.999615 L26,27.000385 C26,28.1047419 25.1122704,29 24,29 C22.8954305,29 22,28.1125667 22,27.000385 L22,20.999615 Z M22,34.999615 C22,33.8952581 22.8877296,33 24,33 C25.1045695,33 26,33.8874333 26,34.999615 L26,41.000385 C26,42.1047419 25.1122704,43 24,43 C22.8954305,43 22,42.1125667 22,41.000385 L22,34.999615 Z M33.4547978,26.0152987 C31.5467657,24.90228 31.5442237,23.0992028 33.4547978,21.9847013 L38.5452022,19.0152987 C40.4532343,17.90228 42,18.7873299 42,20.9931023 L42,27.0068977 C42,29.2122272 40.4557763,30.0992028 38.5452022,28.9847013 L33.4547978,26.0152987 Z M14.5452022,26.0152987 L9.4547978,28.9847013 C7.54422373,30.0992028 6,29.2122272 6,27.0068977 L6,20.9931023 C6,18.7873299 7.54676566,17.90228 9.4547978,19.0152987 L14.5452022,21.9847013 C16.4557763,23.0992028 16.4532343,24.90228 14.5452022,26.0152987 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  左右中央
                </span>
              </button>

              {/* 手前へ */}
              <button
                onClick={handleBringForward}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M18,18 L18,7.99700887 C18,6.89409133 18.8970262,6 20.0049466,6 L39.9950534,6 C41.1023548,6 42,6.89702623 42,8.00494659 L42,27.9950534 C42,29.1023548 41.1092129,30 40.0081681,30 L30,30 L30,39.9950534 C30,41.1023548 29.1029738,42 27.9950534,42 L8.00494659,42 C6.89764516,42 6,41.1029738 6,39.9950534 L6,20.0049466 C6,18.8976452 6.89702623,18 8.00494659,18 L18,18 Z M22.0104037,18 L27.9950534,18 C29.1023548,18 30,18.8970262 30,20.0049466 L30,26 L38.0070801,26 L38,10 L22.0533447,10 L22.0104037,18 Z M9.98694588,38.0018557 L26.0012614,38.0168495 L26.0114746,22 L10.0250244,22 L9.98694588,38.0018557 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  手前へ
                </span>
              </button>

              {/* 奥へ */}
              <button
                onClick={handleSendBackward}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M42,7.99961498 L42,14.000385 C42,15.1047419 41.1122704,16 40,16 C38.8954305,16 38,15.1125667 38,14.000385 L38,10 L33.999615,10 C32.8952581,10 32,9.11227036 32,8 C32,6.8954305 32.8874333,6 33.999615,6 L40.000385,6 C40.5524997,6 41.0523518,6.2218812 41.4142011,6.58277368 C41.7761944,6.94373656 42,7.44358875 42,7.99961498 Z M42,28.000385 L42,21.999615 C42,20.8874333 41.1045695,20 40,20 C38.8877296,20 38,20.8952581 38,21.999615 L38,26 L33.999615,26 C32.8874333,26 32,26.8954305 32,28 C32,29.1122704 32.8952581,30 33.999615,30 L40.000385,30 C40.5564113,30 41.0562634,29.7761944 41.4171349,29.4143397 C41.7781188,29.0523518 42,28.5524997 42,28.000385 Z M18,7.99961498 L18,14.000385 C18,15.1125667 18.8954305,16 20,16 C21.1122704,16 22,15.1047419 22,14.000385 L22,10 L26.000385,10 C27.1125667,10 28,9.1045695 28,8 C28,6.88772964 27.1047419,6 26.000385,6 L19.999615,6 C19.4435887,6 18.9437366,6.22380561 18.5828651,6.58566029 C18.2218812,6.94764817 18,7.44750027 18,7.99961498 Z M6,20.0049466 C6,18.8976452 6.89702623,18 8.00494659,18 L27.9950534,18 C29.1023548,18 30,18.8970262 30,20.0049466 L30,39.9950534 C30,41.1023548 29.1029738,42 27.9950534,42 L8.00494659,42 C6.89764516,42 6,41.1029738 6,39.9950534 L6,20.0049466 Z M9.98694588,38.0018557 L26.0012614,38.0168495 L26.0114746,22 L10.0250244,22 L9.98694588,38.0018557 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  奥へ
                </span>
              </button>

              {/* 範囲内最大 */}
              <button
                onClick={handleFitToArea}
                style={{
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginBottom: "4px" }}>
                  <path d="M16,24 C16,19.581722 19.581722,16 24,16 C25.4836172,16 26.8729082,16.4038588 28.0639347,17.1076382 L35.1715729,10 L32.0085302,10 C30.8992496,10 30,9.11227036 30,8 C30,6.8954305 30.9019504,6 32.0085302,6 L39.9914698,6 C40.5508656,6 41.0497149,6.22433028 41.4114209,6.58649593 C41.7763372,6.94642533 42,7.44528861 42,8 L42,15.9914698 C42,17.1007504 41.1122704,18 40,18 C38.8954305,18 38,17.0980496 38,15.9914698 L38,12.8284271 L30.8923618,19.9360653 C31.5961412,21.1270918 32,22.5163828 32,24 C32,28.418278 28.418278,32 24,32 C22.5163828,32 21.1270918,31.5961412 19.9360653,30.8923618 L12.8284271,38 L15.9914698,38 C17.1007504,38 18,38.8877296 18,40 C18,41.1045695 17.0980496,42 15.9914698,42 L8.0085302,42 C7.44913437,42 6.95028513,41.7756697 6.58857914,41.4135041 C6.22366277,41.0535747 6,40.5547114 6,40 L6,32.0085302 C6,30.8992496 6.88772964,30 8,30 C9.1045695,30 10,30.9019504 10,32.0085302 L10,35.1715729 L17.1076382,28.0639347 C16.4038588,26.8729082 16,25.4836172 16,24 Z M24,28 C26.209139,28 28,26.209139 28,24 C28,21.790861 26.209139,20 24,20 C21.790861,20 20,21.790861 20,24 C20,26.209139 21.790861,28 24,28 Z" fill="#303030" />
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 400, color: "#303030", lineHeight: "1" }}>
                  範囲内最大
                </span>
              </button>
            </div>
          )}

          {/* 商品画像 */}
          <div style={{
            width: "100%",
            maxWidth: "2252px",
            position: "relative",
          }}>
            <div style={{
              width: "100%",
              paddingBottom: "133.33%", /* 3:4 = 4/3 * 100% = 133.33% */
              position: "relative",
              backgroundColor: "#ffffff",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            }}>
              <img
                ref={mainImageRef}
                src={selectedProductImage}
                alt={selectedProductName}
                onLoad={updatePrintArea}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
          
          {/* プリント範囲の点線 */}
          {isMounted && (
            <div
              style={{
                position: "absolute",
                ...printAreaStyle,
                zIndex: 0,
              }}
            />
          )}
          
          {/* プリント範囲の画像表示 */}
          {isMounted && printedImages.length > 0 && printAreaStyle.width && (
            <div
              style={{
                position: "absolute",
                width: printAreaStyle.width as string,
                height: printAreaStyle.height as string,
                left: printAreaStyle.left as string,
                top: printAreaStyle.top as string,
                zIndex: 5,
                overflow: "visible",
              }}
              onClick={() => setSelectedImageId(null)}
            >
              {printedImages.map((imageObj) => {
                const isSelected = selectedImageId === imageObj.id;
                
                return (
                  <div
                    key={imageObj.id}
                    style={{
                      position: "absolute",
                      left: `${imageObj.x}%`,
                      top: `${imageObj.y}%`,
                      transform: `translate(-50%, -50%) rotate(${imageObj.rotation}deg) scale(${imageObj.scale})`,
                      cursor: isSelected ? "move" : "pointer",
                      zIndex: imageObj.zIndex,
                      width: "60%",
                      height: "60%",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageId(imageObj.id);
                    }}
                    onMouseDown={(e) => {
                      if (!isSelected) return;
                      e.preventDefault();
                      setIsDraggingImage(true);
                      setDragStart({ x: e.clientX, y: e.clientY });
                    }}
                    onTouchStart={(e) => {
                      if (!isSelected) return;
                      e.preventDefault();
                      setIsDraggingImage(true);
                      const touch = e.touches[0];
                      setDragStart({ x: touch.clientX, y: touch.clientY });
                    }}
                  >
                    <img
                      src={imageObj.src}
                      alt={`Printed image ${imageObj.id}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                      draggable={false}
                    />
                    
                    {/* 選択枠とハンドル（Photoshopスタイル） */}
                    {isSelected && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "1px solid #000000",
                            pointerEvents: "none",
                          }}
                        />
                        
                        {/* 8つのリサイズハンドル */}
                        {/* 左上（回転エリア + リサイズハンドル） */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-12px",
                            left: "-12px",
                            width: "24px",
                            height: "24px",
                            cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z\" fill=\"black\"/></svg>') 12 12, crosshair",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                        >
                          {/* リサイズ用の内側ハンドル */}
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              left: "8px",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #000000",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        
                        {/* 上中央（リサイズ用） */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-4px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #000000",
                            cursor: "ns-resize",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: e.clientX,
                              y: e.clientY,
                              direction: "top",
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            const touch = e.touches[0];
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: touch.clientX,
                              y: touch.clientY,
                              direction: "top",
                            });
                          }}
                        />
                        
                        {/* 右上（回転エリア + リサイズハンドル） */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-12px",
                            right: "-12px",
                            width: "24px",
                            height: "24px",
                            cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z\" fill=\"black\"/></svg>') 12 12, crosshair",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                        >
                          {/* リサイズ用の内側ハンドル */}
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #000000",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        
                        {/* 右中央 */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "-4px",
                            transform: "translateY(-50%)",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #000000",
                            cursor: "ew-resize",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: e.clientX,
                              y: e.clientY,
                              direction: "right",
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            const touch = e.touches[0];
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: touch.clientX,
                              y: touch.clientY,
                              direction: "right",
                            });
                          }}
                        />
                        
                        {/* 右下（回転エリア + リサイズハンドル） */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-12px",
                            right: "-12px",
                            width: "24px",
                            height: "24px",
                            cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z\" fill=\"black\"/></svg>') 12 12, crosshair",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                        >
                          {/* リサイズ用の内側ハンドル */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              right: "8px",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #000000",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        
                        {/* 下中央 */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-4px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #000000",
                            cursor: "ns-resize",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: e.clientX,
                              y: e.clientY,
                              direction: "bottom",
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            const touch = e.touches[0];
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: touch.clientX,
                              y: touch.clientY,
                              direction: "bottom",
                            });
                          }}
                        />
                        
                        {/* 左下（回転エリア + リサイズハンドル） */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-12px",
                            left: "-12px",
                            width: "24px",
                            height: "24px",
                            cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z\" fill=\"black\"/></svg>') 12 12, crosshair",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (!mainImageRef.current || !printAreaStyle.width) return;
                            
                            const printArea = mainImageRef.current.parentElement?.querySelector('[style*="position: absolute"][style*="overflow: visible"]') as HTMLElement;
                            if (!printArea) return;
                            
                            const rect = printArea.getBoundingClientRect();
                            const centerX = rect.left + (rect.width * imageObj.x / 100);
                            const centerY = rect.top + (rect.height * imageObj.y / 100);
                            
                            setIsRotating(true);
                            setRotateStart({
                              rotation: imageObj.rotation,
                              centerX,
                              centerY,
                            });
                          }}
                        >
                          {/* リサイズ用の内側ハンドル */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              left: "8px",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #000000",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        
                        {/* 左中央 */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "-4px",
                            transform: "translateY(-50%)",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #000000",
                            cursor: "ew-resize",
                            zIndex: 1001,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: e.clientX,
                              y: e.clientY,
                              direction: "left",
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            const touch = e.touches[0];
                            setIsResizing(true);
                            setResizeStart({
                              scale: imageObj.scale,
                              rotation: imageObj.rotation,
                              x: touch.clientX,
                              y: touch.clientY,
                              direction: "left",
                            });
                          }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 画像を追加ボタン（プリント範囲に画像がない場合のみ表示） */}
          {isMounted && printedImages.length === 0 && printAreaStyle.width && (
            <button
              type="button"
              onDragOver={handlePrintAreaDragOver}
              onDragLeave={handlePrintAreaDragLeave}
              onDrop={handlePrintAreaDrop}
              onClick={() => {
                printAreaFileInputRef.current?.click();
              }}
              style={{
                position: "absolute",
                width: printAreaStyle.width as string,
                height: printAreaStyle.height as string,
                left: printAreaStyle.left as string,
                top: printAreaStyle.top as string,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: isPrintAreaDragging ? "rgba(0, 0, 0, 0.05)" : "transparent",
                transition: "background-color 0.2s ease",
                pointerEvents: "auto",
                zIndex: 10,
                border: "none",
                padding: "0",
              }}
            >
              {/* 画像アイコン */}
              <svg width="32" height="32" viewBox="0 0 48 48" style={{ marginBottom: "8px" }}>
                <path d="M2,9.99017859 C2,7.7864638 3.79975948,6 5.99029394,6 L18.0767644,6 C19.1835685,6 20.5701975,6.7477726 21.1746315,7.67133451 L24.0075684,12 L41.9918214,12 C44.2054773,12 46,13.7867947 46,15.9992748 L46,38.0007252 C46,40.2094637 44.2069088,42 41.99819,42 L6.00180999,42 C3.79167136,42 2,40.2147544 2,38.0098214 L2,9.99017859 Z M6,38.0098214 L41.99819,38 L42,15.9992748 L24.0075684,16 C22.658105,16 21.3996088,15.3195781 20.6606307,14.1904356 L18,10.0097802 L5.99029394,10 L6,38.0098214 Z M17.862928,23.9448407 C18.3178041,22.9335006 19.2364493,22.8239147 19.9084014,23.6918355 L22.7905122,27.4144876 C23.4653199,28.2860968 24.7285203,28.4701867 25.6270803,27.8146248 L26.205134,27.3928946 C27.0969196,26.7422751 28.2985638,26.9754922 28.8829814,27.9041067 L31.6562655,32.3107367 C32.2434141,33.2436908 31.8235673,33.9999996 30.718486,33.9999996 L15.3412689,33.9999999 C14.236199,33.9999999 13.7078282,33.1830028 14.1639889,32.1688067 L17.862928,23.9448407 Z M30.9342877,26 C29.2774335,26 27.9342877,24.6568542 27.9342877,23 C27.9342877,21.3431458 29.2774335,20 30.9342877,20 C32.591142,20 33.9342877,21.3431458 33.9342877,23 C33.9342877,24.6568542 32.591142,26 30.9342877,26 Z" fill="#303030" />
              </svg>
              
              {/* テキスト */}
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#303030", marginBottom: "12px" }}>
                画像を追加
              </span>
              
              {/* 注意書き */}
              <div style={{ fontSize: "10px", color: "#666", textAlign: "center", lineHeight: "1.5", maxWidth: "85%" }}>
                <p style={{ margin: "0 0 2px 0", fontWeight: 600 }}>推奨: 2953×3685px以上</p>
                <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>RGB、300dpi</p>
                <p style={{ margin: "0 0 4px 0" }}>対応形式: JPG, PNG (最大15MB)</p>
                <p style={{ margin: "0", fontSize: "9px" }}>著作権を侵害する画像の使用は禁止です</p>
              </div>
            </button>
          )}
          
          {/* 隠しファイル入力（プリント範囲用） */}
          <input
            ref={printAreaFileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              handlePrintAreaFileUpload(e.target.files);
              e.target.value = ""; // ファイル入力をリセット
            }}
          />
        </div>
      </main>

      {/* アップロード済み画像の原寸大ポップアップ */}
      {showFullSizeImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 2002,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => {
            setShowFullSizeImage(false);
            setFullSizeImageSrc("");
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => {
                setShowFullSizeImage(false);
                setFullSizeImageSrc("");
              }}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid #ffffff",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ width: "20px", height: "20px" }}>
                <path d="M18 6L6 18M6 6L18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* 原寸大画像 */}
            <img
              src={fullSizeImageSrc}
              alt="原寸大画像"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
        </div>
      )}

      {/* 画像サイズチェックポップアップ */}
      {showImageSizeCheck && imageSizeInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 2001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            if (imageSizeInfo.isGoodQuality) {
              setShowImageSizeCheck(false);
              setImageSizeInfo(null);
              // 高品質な画像の場合は自動的にアップロード
              if (uploadSource === "printArea") {
                confirmPrintAreaFileUpload(pendingFiles);
              } else if (uploadSource === "imageManagement") {
                confirmImageManagementUpload(pendingFiles);
              }
              setPendingFiles([]);
              setUploadSource(null);
            } else {
              // サイズが小さい場合はキャンセル
              setShowImageSizeCheck(false);
              setImageSizeInfo(null);
              setPendingFiles([]);
              setUploadSource(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "0",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 高品質な画像 */}
            {imageSizeInfo.isGoodQuality && (
              <>
                <div style={{
                  backgroundColor: "#d1fae5",
                  border: "3px solid #10b981",
                  borderRadius: "20px",
                  padding: "30px",
                  margin: "20px",
                }}>
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#10b981",
                    marginTop: "0",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ width: "24px", height: "24px" }}>
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    高品質な画像です！
                  </h2>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#303030", margin: "0 0 5px 0" }}>
                    {imageSizeInfo.width} × {imageSizeInfo.height}px
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
                    印刷に最適なサイズです。
                  </p>
                </div>
                <div style={{ padding: "0 20px 20px 20px" }}>
                  <button
                    onClick={() => {
                      setShowImageSizeCheck(false);
                      setImageSizeInfo(null);
                      // アップロード処理
                      if (uploadSource === "printArea") {
                        confirmPrintAreaFileUpload(pendingFiles);
                      } else if (uploadSource === "imageManagement") {
                        confirmImageManagementUpload(pendingFiles);
                      }
                      setPendingFiles([]);
                      setUploadSource(null);
                    }}
                    style={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: "#6b7280",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "13px",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4b5563";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#6b7280";
                    }}
                  >
                    閉じる
                  </button>
                </div>
              </>
            )}

            {/* サイズが小さい警告 */}
            {imageSizeInfo.isTooSmall && !imageSizeInfo.isGoodQuality && (
              <>
                <div style={{
                  backgroundColor: "#fef3c7",
                  border: "3px solid #f59e0b",
                  borderRadius: "20px",
                  padding: "30px",
                  margin: "20px",
                }}>
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#f59e0b",
                    marginTop: "0",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ width: "24px", height: "24px" }}>
                      <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    画像サイズが小さすぎます
                  </h2>
                  <p style={{ fontSize: "14px", color: "#303030", margin: "0 0 10px 0" }}>
                    現在: <strong>{imageSizeInfo.width} × {imageSizeInfo.height}px</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#303030", margin: "0 0 10px 0" }}>
                    最低: <strong>1182 × 1475px (150 DPI)</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#303030", margin: "0 0 15px 0" }}>
                    推奨: <strong>2953 × 3685px (300 DPI)</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
                    印刷時に画質が粗くなる可能性があります。
                  </p>
                </div>
                <div style={{ padding: "0 20px 20px 20px" }}>
                  <p style={{ fontSize: "14px", color: "#303030", margin: "0 0 15px 0", textAlign: "center" }}>
                    それでもこの画像を使用しますか？
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => {
                        setShowImageSizeCheck(false);
                        setImageSizeInfo(null);
                        setPendingFiles([]);
                        setUploadSource(null);
                      }}
                      style={{
                        flex: 1,
                        height: "50px",
                        backgroundColor: "#e5e7eb",
                        color: "#303030",
                        border: "none",
                        borderRadius: "13px",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#e5e7eb";
                      }}
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        setShowImageSizeCheck(false);
                        setImageSizeInfo(null);
                        // アップロード処理
                        if (uploadSource === "printArea") {
                          confirmPrintAreaFileUpload(pendingFiles);
                        } else if (uploadSource === "imageManagement") {
                          confirmImageManagementUpload(pendingFiles);
                        }
                        setPendingFiles([]);
                        setUploadSource(null);
                      }}
                      style={{
                        flex: 1,
                        height: "50px",
                        backgroundColor: "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "13px",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2563eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#3b82f6";
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 通常サイズ（警告なし） */}
            {!imageSizeInfo.isGoodQuality && !imageSizeInfo.isTooSmall && (
              <>
                <div style={{ padding: "30px" }}>
                  <p style={{ fontSize: "14px", color: "#303030", margin: "0 0 5px 0" }}>
                    画像サイズ: <strong>{imageSizeInfo.width} × {imageSizeInfo.height}px</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
                    印刷可能なサイズです。
                  </p>
                </div>
                <div style={{ padding: "0 20px 20px 20px" }}>
                  <button
                    onClick={() => {
                      setShowImageSizeCheck(false);
                      setImageSizeInfo(null);
                      // アップロード処理
                      if (uploadSource === "printArea") {
                        confirmPrintAreaFileUpload(pendingFiles);
                      } else if (uploadSource === "imageManagement") {
                        confirmImageManagementUpload(pendingFiles);
                      }
                      setPendingFiles([]);
                      setUploadSource(null);
                    }}
                    style={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: "#6366f1",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "13px",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4f46e5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#6366f1";
                    }}
                  >
                    閉じる
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 画像アップロード確認ポップアップ */}
      {showUploadConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setShowUploadConfirm(false);
            setPendingFiles([]);
            setUploadSource(null);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* タイトル */}
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#303030", marginTop: "0", marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="28" height="28" viewBox="0 0 48 48" style={{ width: "28px", height: "28px" }}>
                <path d="M2,9.99017859 C2,7.7864638 3.79975948,6 5.99029394,6 L18.0767644,6 C19.1835685,6 20.5701975,6.7477726 21.1746315,7.67133451 L24.0075684,12 L41.9918214,12 C44.2054773,12 46,13.7867947 46,15.9992748 L46,38.0007252 C46,40.2094637 44.2069088,42 41.99819,42 L6.00180999,42 C3.79167136,42 2,40.2147544 2,38.0098214 L2,9.99017859 Z M6,38.0098214 L41.99819,38 L42,15.9992748 L24.0075684,16 C22.658105,16 21.3996088,15.3195781 20.6606307,14.1904356 L18,10.0097802 L5.99029394,10 L6,38.0098214 Z M17.862928,23.9448407 C18.3178041,22.9335006 19.2364493,22.8239147 19.9084014,23.6918355 L22.7905122,27.4144876 C23.4653199,28.2860968 24.7285203,28.4701867 25.6270803,27.8146248 L26.205134,27.3928946 C27.0969196,26.7422751 28.2985638,26.9754922 28.8829814,27.9041067 L31.6562655,32.3107367 C32.2434141,33.2436908 31.8235673,33.9999996 30.718486,33.9999996 L15.3412689,33.9999999 C14.236199,33.9999999 13.7078282,33.1830028 14.1639889,32.1688067 L17.862928,23.9448407 Z M30.9342877,26 C29.2774335,26 27.9342877,24.6568542 27.9342877,23 C27.9342877,21.3431458 29.2774335,20 30.9342877,20 C32.591142,20 33.9342877,21.3431458 33.9342877,23 C33.9342877,24.6568542 32.591142,26 30.9342877,26 Z" fill="#303030" />
              </svg>
              画像アップロード前のご確認
            </h2>

            {/* 推奨画像サイズ */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#22c55e", marginTop: "0", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ width: "20px", height: "20px" }}>
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                推奨画像サイズ
              </h3>
              <div style={{ backgroundColor: "#f8f8f8", padding: "20px", borderRadius: "13px", fontSize: "14px", color: "#303030", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>300 DPI以上の高解像度画像を推奨します。</p>
                <p style={{ margin: "0", color: "#666" }}>プリント範囲: 250mm × 312mm</p>
              </div>
            </div>

            {/* 著作権・利用規約 */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f59e0b", marginTop: "0", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ width: "20px", height: "20px" }}>
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                著作権・利用規約
              </h3>
              <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "14px", color: "#303030", lineHeight: "2" }}>
                <li>第三者の著作権を侵害する画像をアップロードしないでください</li>
                <li>肖像権やプライバシー権を侵害する画像は使用できません</li>
                <li>商標権を侵害する画像（企業ロゴなど）は使用できません</li>
                <li>アップロードされた画像はお客様の責任で管理されます</li>
                <li>不適切な画像が発見された場合、<strong>予告なく削除</strong>することがあります</li>
              </ul>
            </div>

            {/* ボタン */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowUploadConfirm(false);
                  setPendingFiles([]);
                  setUploadSource(null);
                }}
                style={{
                  flex: 1,
                  height: "50px",
                  backgroundColor: "#6b7280",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "13px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4b5563";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#6b7280";
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  // 利用規約に同意したことをlocalStorageに保存
                  if (typeof window !== "undefined") {
                    localStorage.setItem("hasAgreedToImageUploadTerms", "true");
                    setHasAgreedToTerms(true);
                  }
                  
                  // 利用規約ポップアップを閉じる
                  setShowUploadConfirm(false);
                  
                  // 画像サイズをチェック
                  if (pendingFiles.length > 0) {
                    checkImageSize(pendingFiles);
                  }
                }}
                style={{
                  flex: 1,
                  height: "50px",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "13px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#6366f1";
                }}
              >
                同意してアップロード
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
