#!/bin/bash

# チェックポイント復元スクリプト
# 使い方: 
#   ./restore-checkpoint.sh <コミットハッシュ>
#   ./restore-checkpoint.sh HEAD~1  # 1つ前に戻す
#   ./restore-checkpoint.sh HEAD~2  # 2つ前に戻す

TARGET="$1"

if [ -z "$TARGET" ]; then
  echo "エラー: 復元先を指定してください"
  echo ""
  echo "使い方:"
  echo "  ./restore-checkpoint.sh <コミットハッシュ>"
  echo "  ./restore-checkpoint.sh HEAD~1  # 1つ前に戻す"
  echo ""
  echo "チェックポイント一覧を表示:"
  echo "  ./list-checkpoints.sh"
  exit 1
fi

# 現在の変更を確認
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️  未コミットの変更があります。"
  echo ""
  read -p "現在の変更を破棄して復元しますか？ (y/N): " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "キャンセルしました。"
    exit 0
  fi
fi

# 復元
echo "🔄 チェックポイント $TARGET に復元中..."
git reset --hard "$TARGET"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 復元完了！"
  echo ""
  echo "現在の状態:"
  git log -1 --oneline
else
  echo ""
  echo "❌ 復元に失敗しました。"
  exit 1
fi
