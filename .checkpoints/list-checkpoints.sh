#!/bin/bash

# チェックポイント一覧表示スクリプト

echo "📋 チェックポイント履歴（最新20件）"
echo "=========================================="
echo ""

git log --oneline --grep="CHECKPOINT" -20 --format="%h | %s | %ar" | while IFS='|' read -r hash msg time; do
  echo "🔖 $hash"
  echo "   $msg"
  echo "   ⏰ $time"
  echo ""
done

echo "=========================================="
echo "復元方法: git reset --hard <コミットハッシュ>"
