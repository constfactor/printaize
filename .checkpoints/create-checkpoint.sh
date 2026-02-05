#!/bin/bash

# チェックポイント作成スクリプト
# 使い方: ./create-checkpoint.sh "変更内容の説明"

DESCRIPTION="$1"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")

if [ -z "$DESCRIPTION" ]; then
  echo "エラー: 変更内容の説明を指定してください"
  echo "使い方: ./create-checkpoint.sh \"変更内容の説明\""
  exit 1
fi

# 変更があるか確認
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  変更がありません。チェックポイントは作成されませんでした。"
  exit 0
fi

# すべての変更をステージング
git add -A

# コミット
COMMIT_MSG="[CHECKPOINT] $TIMESTAMP - $DESCRIPTION"
git commit -m "$COMMIT_MSG"

# 結果表示
echo "✅ チェックポイントを作成しました！"
echo ""
echo "📝 コミットメッセージ: $COMMIT_MSG"
echo "🔖 コミットハッシュ: $(git rev-parse --short HEAD)"
echo ""
echo "復元方法: git reset --hard $(git rev-parse --short HEAD)"
