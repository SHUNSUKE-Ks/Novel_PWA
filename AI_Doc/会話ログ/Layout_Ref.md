# 会話ログ (Talk Log) レイアウト構成案

このドキュメントは、会話ログ画面の基本レイアウト定義です。

## 1. ヘッダー構成 (Header)

### デザイン要素
- **左側**: メモアイコン（シンプルノート/ペン） - Lucide `NotebookPen` を使用
- **中央**: タイトル「会話ログ」
- **右側**: 閉じるボタン (`X`)

### Header Mockup (JSX concept)
```jsx
<div className="layout-header">
  <div className="header-left">
    <button className="header-btn note-btn" title="Raw JSON Data">
      <NotebookPen size={24} />
    </button>
  </div>
  <h2 className="header-title">会話ログ</h2>
  <div className="header-right">
    <button className="header-btn close-btn" onClick={onClose}>
      <X size={32} />
    </button>
  </div>
</div>
```

## 2. コンテンツエリア (Content)

### 会話リスト表示
- タイムライン形式のメッセージ表示
- キャラクターアイコン、名前、メッセージバブル

### JSON表示機能 (Inspector)
- ノートアイコンをクリックすることで、現在の会話データのJSONソースをオーバーレイまたはトグルで表示する。
- **用途**: AIデバッグ、データ整合性確認用。

```json
{
  "log": [
    { "id": 1, "speaker": "勇者", "text": "またこの場所か..." },
    { "id": 2, "speaker": "賢者", "text": "慎重に進みましょう。" }
  ]
}
```

## 3. スタイル定義 (CSS Concept)
- 背景: 半透明ダーク (`rgba(0,0,0,0.9)`)
- テキスト: ホワイト/ゴールド
- メモアイコン: アクセントカラー。ホバー時に発光エフェクト。
