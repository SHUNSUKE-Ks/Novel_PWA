# クイックスタートガイド

## 🚀 5分で始める JSON編集機能

### 1. ファイルのコピー

提供された `json-editor-patterns.jsx` を以下のように分割配置：

```
src/
└── components/
    └── JsonEditor/
        ├── index.jsx              # メインのエクスポート
        ├── JsonEditor.jsx         # 提供されたファイルをそのままコピー
        └── README.md              # このファイル
```

### 2. インストール

```bash
npm install lucide-react
```

### 3. 最小構成での使用

```jsx
import JsonEditor from './components/JsonEditor/JsonEditor';

function App() {
  const [data, setData] = useState({ scene1: { dialogue: "Hello" } });

  return (
    <JsonEditor
      gameData={data}
      onSave={setData}
      jsonFileName="data.json"
      isDev={true}
    >
      <div>あなたのゲーム画面</div>
    </JsonEditor>
  );
}
```

これだけで動作します！

---

## 📂 推奨ファイル構成（詳細版）

より保守性を高めたい場合は、以下のように分割できます：

```
src/
└── components/
    └── JsonEditor/
        ├── index.js                    # エクスポートのみ
        ├── JsonEditor.jsx              # メインコンポーネント
        ├── components/
        │   ├── GameHeader.jsx          # ゲーム用ヘッダー
        │   ├── EditorHeader.jsx        # エディター用ヘッダー
        │   ├── Pattern1TextArea.jsx    # パターン1
        │   ├── Pattern2Table.jsx       # パターン2
        │   ├── Pattern3Tree.jsx        # パターン3
        │   └── TreeNode.jsx            # ツリーノード
        ├── hooks/
        │   └── useJsonEditor.js        # カスタムフック（オプション）
        ├── utils/
        │   └── jsonHelpers.js          # ユーティリティ関数
        └── README.md
```

### index.js の例

```js
export { default } from './JsonEditor';
export { GameHeader } from './components/GameHeader';
export { EditorHeader } from './components/EditorHeader';
```

---

## ⚡ よくある使い方

### パターンA: ローカルストレージと連携

```jsx
function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('game_data');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const handleSave = (newData) => {
    setData(newData);
    localStorage.setItem('game_data', JSON.stringify(newData));
  };

  return (
    <JsonEditor
      gameData={data}
      onSave={handleSave}
      jsonFileName="game_data.json"
    >
      <YourGame data={data} />
    </JsonEditor>
  );
}
```

### パターンB: 環境変数で開発モード制御

```jsx
function App() {
  return (
    <JsonEditor
      gameData={data}
      onSave={setData}
      jsonFileName="data.json"
      isDev={import.meta.env.DEV} // Vite
      // isDev={process.env.NODE_ENV === 'development'} // CRA
    >
      <YourGame data={data} />
    </JsonEditor>
  );
}
```

---

## 🎨 コンポーネント分割版（完全版）

### ファイル分割の実装例

#### 1. GameHeader.jsx

```jsx
import { Code } from 'lucide-react';

export const GameHeader = ({ onToggleEditor, isDev }) => {
  if (!isDev) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="flex gap-2 bg-gray-700/90 backdrop-blur rounded-lg p-1 shadow-lg">
        <button
          onClick={onToggleEditor}
          className="p-2 rounded transition text-gray-400 hover:text-white hover:bg-gray-600"
          title="エディター表示"
        >
          <Code size={20} />
        </button>
      </div>
    </div>
  );
};
```

#### 2. EditorHeader.jsx

```jsx
import { Eye, Save } from 'lucide-react';

export const EditorHeader = ({ 
  jsonFileName, 
  currentPattern, 
  onPatternChange, 
  onToggleGame,
  searchQuery,
  onSearchChange 
}) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg border-b border-gray-700">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-gray-200">{jsonFileName}</h1>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="JSON内を検索..."
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="7" r="6" />
              <path d="M11 11l4 4" />
            </svg>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={currentPattern}
            onChange={(e) => onPatternChange(Number(e.target.value))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
          >
            <option value={1}>パターン1: テキストエリア</option>
            <option value={2}>パターン2: テーブル</option>
            <option value={3}>パターン3: ツリー</option>
          </select>

          <button
            onClick={onToggleGame}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            title="ゲーム表示"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
```

#### 3. JsonEditor.jsx（メイン）

```jsx
import { useState } from 'react';
import { GameHeader } from './components/GameHeader';
import { EditorHeader } from './components/EditorHeader';
import { Pattern1TextArea } from './components/Pattern1TextArea';
import { Pattern2Table } from './components/Pattern2Table';
import { Pattern3Tree } from './components/Pattern3Tree';

export default function JsonEditor({ 
  gameData, 
  onSave, 
  jsonFileName, 
  isDev = true,
  children 
}) {
  const [currentView, setCurrentView] = useState('game');
  const [currentPattern, setCurrentPattern] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full h-screen flex flex-col">
      {currentView === 'game' ? (
        <>
          <GameHeader 
            onToggleEditor={() => setCurrentView('editor')}
            isDev={isDev}
          />
          {children}
        </>
      ) : (
        <>
          <EditorHeader
            jsonFileName={jsonFileName}
            currentPattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onToggleGame={() => setCurrentView('game')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1 overflow-hidden">
            {currentPattern === 1 && (
              <Pattern1TextArea 
                jsonData={gameData} 
                onSave={onSave}
                searchQuery={searchQuery}
              />
            )}
            {currentPattern === 2 && (
              <Pattern2Table 
                jsonData={gameData} 
                onSave={onSave}
                searchQuery={searchQuery}
              />
            )}
            {currentPattern === 3 && (
              <Pattern3Tree 
                jsonData={gameData} 
                onSave={onSave}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 🔧 ユーティリティ関数の例

### jsonHelpers.js

```js
// JSONをフラット化
export const flattenJSON = (obj, prefix = '') => {
  let result = [];
  
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result = result.concat(flattenJSON(value, fullKey));
    } else {
      result.push({
        path: fullKey,
        key: key,
        value: value,
        type: Array.isArray(value) ? 'array' : typeof value
      });
    }
  }
  
  return result;
};

// パスから値を更新
export const updateValueByPath = (obj, path, newValue) => {
  const keys = path.split('.');
  const newData = JSON.parse(JSON.stringify(obj));
  
  let current = newData;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  
  const lastKey = keys[keys.length - 1];
  
  // 型を保持
  if (typeof current[lastKey] === 'number') {
    current[lastKey] = parseFloat(newValue) || 0;
  } else if (typeof current[lastKey] === 'boolean') {
    current[lastKey] = newValue === 'true';
  } else {
    current[lastKey] = newValue;
  }
  
  return newData;
};

// 検索マッチング
export const matchesSearch = (text, query) => {
  if (!query) return false;
  return String(text).toLowerCase().includes(query.toLowerCase());
};
```

---

## 💡 カスタムフックの例

### useJsonEditor.js

```js
import { useState, useCallback } from 'react';

export const useJsonEditor = (initialData, options = {}) => {
  const [data, setData] = useState(initialData);
  const [history, setHistory] = useState([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateData = useCallback((newData) => {
    setData(newData);
    
    // 履歴管理（オプション）
    if (options.enableHistory) {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newData]);
      setHistoryIndex(prev => prev + 1);
    }

    // 自動保存（オプション）
    if (options.autoSave) {
      localStorage.setItem(options.storageKey || 'json_data', JSON.stringify(newData));
    }
  }, [historyIndex, options]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setData(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setData(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  return {
    data,
    updateData,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};
```

### 使用例

```jsx
import { useJsonEditor } from './hooks/useJsonEditor';

function App() {
  const { data, updateData, undo, redo, canUndo, canRedo } = useJsonEditor(
    initialData,
    { enableHistory: true, autoSave: true, storageKey: 'novel_data' }
  );

  return (
    <>
      <div>
        <button onClick={undo} disabled={!canUndo}>元に戻す</button>
        <button onClick={redo} disabled={!canRedo}>やり直す</button>
      </div>
      
      <JsonEditor
        gameData={data}
        onSave={updateData}
        jsonFileName="novel.json"
      >
        <YourGame data={data} />
      </JsonEditor>
    </>
  );
}
```

---

## 🎯 まとめ

### シンプルに使いたい場合
→ 提供されたファイルをそのまま使用

### 保守性を高めたい場合
→ コンポーネントを分割して配置

### 高機能にしたい場合
→ カスタムフックやユーティリティを追加

どの方法でも動作は同じです。プロジェクトの規模に応じて選択してください！
