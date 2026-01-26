/**
 * 商品データ定義
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tshirt' | 'longsleeve' | 'sweatshirt' | 'hoodie';
  colors: Array<{
    name: string;
    hex: string;
  }>;
  mockupImage: string;
  printAreaWidth: number;
  printAreaHeight: number;
}

export const products: Product[] = [
  {
    id: 'box-tshirt-short',
    name: 'ボックスシルエット / 半袖Tシャツ',
    description: 'ゆったりとしたボックスシルエットの半袖Tシャツ（ユニセックス）',
    price: 2490,
    category: 'tshirt',
    colors: [
      { name: 'ホワイト', hex: '#FFFFFF' },
      { name: 'ブラック', hex: '#000000' },
    ],
    mockupImage: '/images/products/box-tshirt-short-white.png',
    printAreaWidth: 200,
    printAreaHeight: 250,
  },
  {
    id: 'box-tshirt-long',
    name: 'ボックスシルエット / 長袖Tシャツ',
    description: 'ゆったりとしたボックスシルエットの長袖Tシャツ（ユニセックス）',
    price: 2990,
    category: 'longsleeve',
    colors: [
      { name: 'ホワイト', hex: '#FFFFFF' },
      { name: 'ブラック', hex: '#000000' },
    ],
    mockupImage: '/images/products/box-tshirt-long-white.png',
    printAreaWidth: 200,
    printAreaHeight: 250,
  },
  {
    id: 'sweatshirt',
    name: 'スウェットシャツ',
    description: '快適な着心地のスウェットシャツ（ユニセックス）',
    price: 3990,
    category: 'sweatshirt',
    colors: [
      { name: 'オフホワイト', hex: '#F5F5DC' },
      { name: 'ブラック', hex: '#000000' },
    ],
    mockupImage: '/images/products/sweatshirt-white.png',
    printAreaWidth: 220,
    printAreaHeight: 280,
  },
  {
    id: 'hoodie',
    name: 'スウェットプルパーカ',
    description: 'フード付きスウェットパーカー（ユニセックス）',
    price: 4990,
    category: 'hoodie',
    colors: [
      { name: 'オフホワイト', hex: '#F5F5DC' },
      { name: 'ブラック', hex: '#000000' },
    ],
    mockupImage: '/images/products/hoodie-white.png',
    printAreaWidth: 220,
    printAreaHeight: 280,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
