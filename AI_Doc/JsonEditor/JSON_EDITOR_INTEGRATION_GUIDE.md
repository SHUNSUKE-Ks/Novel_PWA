# JSON編集機能 組み込み引継ぎ資料

## 📋 概要

ノベルゲーム向けのJSON編集機能です。開発時のみ有効化され、ゲーム画面とエディター画面をシームレスに切り替えられます。

---

## 🎯 主な機能

### 1. **3つの編集パターン**
- **パターン1: テキストエリア** - JSONを直接編集（自由度が高い）
- **パターン2: テーブル形式** - 値のみ編集（一覧表示で見やすい）
- **パターン3: ツリー構造** - 階層的に編集（最も直感的）

### 2. **検索機能**
- JSON内の単語をリアルタイム検索
- パターン2: フィルタリング
- パターン3: ハイライト表示

### 3. **開発モード切り替え**
- ゲーム画面: 右上に小さなトグルボタン
- エディター画面: 専用ヘッダーで機能を提供

---

## 🔧 組み込み手順

### ステップ1: ファイルの配置

```
src/
├── components/
│   └── JsonEditor/
│       ├── JsonEditor.jsx          # メインコンポーネント
│       ├── GameHeader.jsx          # ゲーム用ヘッダー
│       ├── EditorHeader.jsx        # エディター用ヘッダー
│       ├── Pattern1TextArea.jsx    # パターン1
│       ├── Pattern2Table.jsx       # パターン2
│       ├── Pattern3Tree.jsx        # パターン3
│       └── TreeNode.jsx            # ツリーノードコンポーネント
```

### ステップ2: 依存関係のインストール

```bash
npm install lucide-react
```

### ステップ3: 既存アプリへの統合

#### 方法A: 完全統合（推奨）

```jsx
import JsonEditor from './components/JsonEditor/JsonEditor';

function App() {
  const [gameData, setGameData] = useState(yourInitialData);
  const isDev = import.meta.env.DEV; // Viteの場合

  return (
    <JsonEditor
      gameData={gameData}
      onSave={setGameData}
      jsonFileName="novel_data.json"
      isDev={isDev}
    >
      {/* ここにゲーム画面のコンポーネントを配置 */}
      <YourGameComponent data={gameData} />
    </JsonEditor>
  );
}
```

#### 方法B: 部分的統合

```jsx
import { GameHeader } from './components/JsonEditor/GameHeader';
import { EditorView } from './components/JsonEditor/EditorView';

function App() {
  const [view, setView] = useState('game');
  const [gameData, setGameData] = useState(yourInitialData);

  return (
    <>
      {view === 'game' ? (
        <>
          <GameHeader onToggleEditor={() => setView('editor')} isDev={true} />
          <YourGameComponent data={gameData} />
        </>
      ) : (
        <EditorView
          gameData={gameData}
          onSave={setGameData}
          jsonFileName="novel_data.json"
          onToggleGame={() => setView('game')}
        />
      )}
    </>
  );
}
```

---

## 📦 コンポーネント仕様

### JsonEditor（メインコンポーネント）

#### Props

| プロップ名 | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `gameData` | Object | ✅ | - | 編集対象のJSONデータ |
| `onSave` | Function | ✅ | - | 保存時のコールバック `(newData) => void` |
| `jsonFileName` | String | ✅ | - | 表示するファイル名（例: "novel_data.json"） |
| `isDev` | Boolean | ❌ | true | 開発モードのフラグ |
| `children` | ReactNode | ✅ | - | ゲーム画面のコンテンツ |

#### 使用例

```jsx
<JsonEditor
  gameData={novelData}
  onSave={(newData) => {
    setNovelData(newData);
    // 必要に応じて保存処理を追加
    saveToLocalStorage(newData);
  }}
  jsonFileName="chapter1.json"
  isDev={process.env.NODE_ENV === 'development'}
>
  <NovelGameScreen data={novelData} />
</JsonEditor>
```

---

## 🎨 UI/UX 仕様

### ゲーム画面のトグルボタン

- **位置**: 右上（absolute positioning）
- **表示条件**: `isDev === true`
- **スタイル**: 半透明背景、ホバーで強調
- **アイコン**: `<Code>` (lucide-react)

```jsx
// 配置例
<div className="absolute top-4 right-4 z-50">
  <button className="p-2 bg-gray-700/90 backdrop-blur rounded-lg">
    <Code size={20} />
  </button>
</div>
```

### エディターヘッダー

#### レイアウト構成

```
┌─────────────────────────────────────────────────────────┐
│ [ファイル名]  [       検索窓       ]  [パターン選択] [👁] │
└─────────────────────────────────────────────────────────┘
```

#### 各要素の仕様

**1. ファイル名**
- フォントサイズ: `text-xl`
- カラー: `text-gray-200`
- 太字: `font-bold`

**2. 検索窓**
- 最大幅: `max-w-md`
- プレースホルダー: "JSON内を検索..."
- 左側にサーチアイコン
- リアルタイム検索（onChange）

**3. パターン選択**
- ドロップダウン形式
- 3つのオプション
  - パターン1: テキストエリア
  - パターン2: テーブル
  - パターン3: ツリー

**4. ゲーム表示ボタン**
- Eyeアイコン
- アクティブ状態（濃い背景）

---

## 🔍 各パターンの詳細仕様

### パターン1: テキストエリア

#### 特徴
- JSONを直接編集可能
- キーと値の両方を変更可能
- 構文エラーのリスクあり

#### 操作方法
1. テキストエリアで直接編集
2. 「保存」ボタンをクリック
3. エラーがある場合は赤い警告が表示

#### エラーハンドリング
```jsx
try {
  const parsed = JSON.parse(editedText);
  onSave(parsed);
} catch (e) {
  setError(`JSON解析エラー: ${e.message}`);
}
```

---

### パターン2: テーブル形式

#### 特徴
- キーは表示のみ（編集不可）
- 値だけを安全に編集
- 型を自動判定して保持

#### テーブル構造

| パス | キー | 値 | 型 |
|-----|-----|-----|-----|
| scene1.dialogue | dialogue | [編集可能input] | string |
| scene1.character | character | [編集可能input] | string |

#### 検索機能
- パス、キー、値のいずれかにマッチする行のみ表示
- マッチ件数を表示: "5 / 20 件表示"

#### データフラット化の仕組み
```jsx
// ネストされたJSON
{
  "scene1": {
    "dialogue": "こんにちは"
  }
}

// フラット化後
[
  { path: "scene1.dialogue", key: "dialogue", value: "こんにちは", type: "string" }
]
```

---

### パターン3: ツリー構造（推奨）

#### 特徴
- 階層構造を視覚的に表示
- 値をクリックで編集開始
- Ctrl+Enter で保存
- 最も直感的で使いやすい

#### 操作方法

**編集の流れ**
1. 値をクリック → 編集モードに切り替わる
2. テキストを入力
3. Ctrl+Enter で保存 / Esc でキャンセル
4. フォーカスを外しても自動保存

#### キーボードショートカット
- `Ctrl + Enter`: 保存
- `Esc`: キャンセル

#### 検索時の挙動
- マッチするキー: 黄色 + 太字
- マッチする値: 黄色 + 太字
- マッチする行: 背景を黄色くハイライト

#### 視覚的インデント
- 各階層ごとに24px右にずれる
- 展開/折りたたみボタン（`>` / `v`）

---

## 💾 データフローと保存処理

### 1. データの流れ

```
ゲーム画面
    ↓ (gameData)
JsonEditor
    ↓ (編集)
パターンコンポーネント
    ↓ (onSave)
JsonEditor
    ↓ (onSave callback)
親コンポーネント
```

### 2. 保存処理の実装例

#### ローカルストレージに保存

```jsx
function App() {
  const [gameData, setGameData] = useState(() => {
    const saved = localStorage.getItem('novel_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const handleSave = (newData) => {
    setGameData(newData);
    localStorage.setItem('novel_data', JSON.stringify(newData));
  };

  return (
    <JsonEditor
      gameData={gameData}
      onSave={handleSave}
      jsonFileName="novel_data.json"
    >
      <YourGame data={gameData} />
    </JsonEditor>
  );
}
```

#### サーバーに保存

```jsx
const handleSave = async (newData) => {
  setGameData(newData);
  
  try {
    await fetch('/api/save-novel-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    console.log('保存成功');
  } catch (error) {
    console.error('保存失敗:', error);
    alert('保存に失敗しました');
  }
};
```

#### ファイルとしてダウンロード

```jsx
const handleSave = (newData) => {
  setGameData(newData);
  
  const blob = new Blob([JSON.stringify(newData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'novel_data.json';
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## 🎨 スタイリング仕様

### カラーパレット

#### ゲーム用ヘッダー
```css
背景: bg-gray-700/90 (半透明)
ホバー: bg-gray-600
アイコン: text-gray-400 → text-white (hover)
```

#### エディター用ヘッダー
```css
背景: bg-gray-800
ボーダー: border-gray-700
テキスト: text-white
```

#### パターン1（テキストエリア）
```css
背景: bg-gray-900 (全体), bg-gray-800 (エリア)
テキスト: text-green-400
エラー: bg-red-900, border-red-600, text-red-200
```

#### パターン2（テーブル）
```css
背景: bg-white
ヘッダー: bg-gray-100
ホバー: hover:bg-gray-50
ボーダー: border-gray-300
```

#### パターン3（ツリー）
```css
背景: bg-gray-900 (全体), bg-gray-800 (ツリー)
キー: text-blue-400
値: text-green-400
検索ハイライト: text-yellow-400 bg-yellow-900/50
ホバー: hover:bg-gray-700
編集モード: border-blue-500
```

---

## 🔒 セキュリティ考慮事項

### 1. 開発モードの制御

**重要**: 本番環境では必ず `isDev={false}` にしてください。

```jsx
// 環境変数で制御（推奨）
const isDev = import.meta.env.DEV; // Vite
const isDev = process.env.NODE_ENV === 'development'; // CRA

// または手動で
const isDev = false; // 本番ビルド時
```

### 2. JSON検証

パターン1（テキストエリア）では、不正なJSONが入力される可能性があります。

```jsx
// 保存前の検証例
const handleSave = (newData) => {
  // 必須キーのチェック
  if (!newData.scene1 || !newData.scene1.dialogue) {
    alert('必須項目が不足しています');
    return;
  }
  
  // データ型のチェック
  if (typeof newData.scene1.dialogue !== 'string') {
    alert('dialogue は文字列である必要があります');
    return;
  }
  
  setGameData(newData);
};
```

### 3. XSS対策

すべての入力値は適切にエスケープされています（React の仕様により自動）。

---

## 🐛 トラブルシューティング

### 問題1: トグルボタンが表示されない

**原因**: `isDev={false}` になっている

**解決策**:
```jsx
<JsonEditor isDev={true} ... />
```

---

### 問題2: 保存しても反映されない

**原因**: `onSave` が正しく実装されていない

**解決策**:
```jsx
// ❌ 間違い
<JsonEditor onSave={setGameData} ... />

// ✅ 正しい
<JsonEditor 
  onSave={(newData) => {
    setGameData(newData);
    console.log('保存:', newData);
  }} 
  ...
/>
```

---

### 問題3: 検索が動作しない

**原因**: 検索クエリが各パターンコンポーネントに渡されていない

**解決策**: 提供されたコードをそのまま使用してください。カスタマイズする場合は `searchQuery` プロップを忘れずに。

---

### 問題4: パターン3で編集できない

**原因**: 値の型判定が正しくない

**解決策**:
```jsx
// TreeNode コンポーネント内
const isPrimitive = !isObject && !isArray;
```

この判定が正しく機能していることを確認してください。

---

## 📊 パフォーマンス最適化

### 1. 大きなJSONファイルの扱い

パターン2（テーブル）で大量のデータを扱う場合：

```jsx
// 仮想スクロールの実装を検討
import { useVirtualizer } from '@tanstack/react-virtual';

// または
// ページネーションを実装
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 50;
```

### 2. 検索パフォーマンス

大きなJSONでの検索を最適化：

```jsx
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  if (!searchQuery) return flatData;
  return flatData.filter(/* ... */);
}, [flatData, searchQuery]);
```

---

## 🎯 カスタマイズガイド

### 1. デフォルトパターンの変更

```jsx
// JsonEditor.jsx
const [currentPattern, setCurrentPattern] = useState(3); // 3に変更
```

### 2. ファイル名を動的に変更

```jsx
function App() {
  const [fileName, setFileName] = useState('novel_data.json');
  
  return (
    <JsonEditor
      jsonFileName={fileName}
      // ファイル選択機能を追加する場合
      onFileNameChange={setFileName}
      ...
    />
  );
}
```

### 3. カスタムバリデーションの追加

```jsx
<JsonEditor
  onSave={(newData) => {
    // カスタムバリデーション
    if (!validateNovelData(newData)) {
      alert('データ形式が不正です');
      return;
    }
    setGameData(newData);
  }}
  ...
/>
```

### 4. 保存ボタンのカスタマイズ

各パターンコンポーネント内で保存ボタンをカスタマイズ：

```jsx
// Pattern3Tree.jsx
<button
  onClick={() => {
    // 保存前処理
    console.log('保存前:', editedData);
    onSave(editedData);
    // 保存後処理
    alert('保存完了！');
  }}
  className="... your-custom-class"
>
  <Save size={16} />
  カスタム保存テキスト
</button>
```

---

## 📝 使用例とベストプラクティス

### 例1: シンプルな統合

```jsx
import React, { useState } from 'react';
import JsonEditor from './components/JsonEditor/JsonEditor';
import NovelGame from './components/NovelGame';

function App() {
  const [novelData, setNovelData] = useState({
    scene1: {
      dialogue: "こんにちは",
      character: "主人公"
    }
  });

  return (
    <JsonEditor
      gameData={novelData}
      onSave={setNovelData}
      jsonFileName="story.json"
      isDev={true}
    >
      <NovelGame data={novelData} />
    </JsonEditor>
  );
}
```

### 例2: 複数ファイル対応

```jsx
function App() {
  const [currentFile, setCurrentFile] = useState('chapter1');
  const [files, setFiles] = useState({
    chapter1: { /* ... */ },
    chapter2: { /* ... */ }
  });

  return (
    <JsonEditor
      gameData={files[currentFile]}
      onSave={(newData) => {
        setFiles(prev => ({
          ...prev,
          [currentFile]: newData
        }));
      }}
      jsonFileName={`${currentFile}.json`}
      isDev={true}
    >
      <NovelGame data={files[currentFile]} />
    </JsonEditor>
  );
}
```

### 例3: 自動保存機能

```jsx
import { useEffect } from 'react';
import { debounce } from 'lodash';

function App() {
  const [novelData, setNovelData] = useState(initialData);

  // 自動保存（3秒後）
  useEffect(() => {
    const autoSave = debounce(() => {
      localStorage.setItem('novel_autosave', JSON.stringify(novelData));
    }, 3000);

    autoSave();
    return () => autoSave.cancel();
  }, [novelData]);

  return (
    <JsonEditor
      gameData={novelData}
      onSave={setNovelData}
      jsonFileName="novel_data.json"
      isDev={true}
    >
      <NovelGame data={novelData} />
    </JsonEditor>
  );
}
```

---

## 🚀 デプロイ時のチェックリスト

- [ ] `isDev` が環境変数で制御されている
- [ ] 本番ビルドで開発機能が無効化される
- [ ] JSONの保存先が適切に設定されている
- [ ] エラーハンドリングが実装されている
- [ ] データバリデーションが実装されている
- [ ] パフォーマンステストを実施
- [ ] 大きなJSONファイルでの動作確認
- [ ] ブラウザの互換性確認（Chrome, Firefox, Safari, Edge）

---

## 📞 サポートと参考情報

### 依存ライブラリ

- **React**: 18.x以上
- **lucide-react**: ^0.263.1以上

### ブラウザサポート

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 推奨開発環境

- Node.js: 18.x以上
- npm: 9.x以上
- Vite: 4.x以上 または Create React App 5.x以上

---

## 🔄 更新履歴

### v1.0.0 (2026-01-04)
- 初回リリース
- 3つの編集パターン実装
- 検索機能実装
- ゲーム/エディター切り替え実装

---

## 📄 ライセンスと利用規約

このコンポーネントは自由に使用・改変できます。
商用・非商用問わず利用可能です。

---

**引継ぎ担当者へ**: 
不明点があれば、このドキュメントの該当セクションを参照してください。
それでも解決しない場合は、コード内のコメントも参考にしてください。
