import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Save, Eye, Code } from 'lucide-react';

// サンプルのノベルゲームJSON
const sampleNovelData = {
  "scene1": {
    "dialogue": "こんにちは、ようこそ学園へ",
    "character": "主人公",
    "background": "school.jpg",
    "bgm": "morning_theme.mp3",
    "choices": [
      { "text": "挨拶する", "next": "scene2" },
      { "text": "無視する", "next": "scene3" }
    ]
  },
  "scene2": {
    "dialogue": "いい天気ですね",
    "character": "友人A",
    "background": "classroom.jpg",
    "emotion": "happy"
  }
};

// =====================================
// パターン1：テキストエリア形式
// =====================================
const Pattern1TextArea = ({ jsonData, onSave, searchQuery }) => {
  const [editedText, setEditedText] = useState(JSON.stringify(jsonData, null, 2));
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedText);
      setError('');
      onSave(parsed);
      alert('保存しました！');
    } catch (e) {
      setError(`JSON解析エラー: ${e.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">テキストエリアエディター</h3>
          {searchQuery && (
            <span className="text-sm text-gray-400">
              検索中: "{searchQuery}"
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          <Save size={16} />
          保存
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="flex-1 bg-gray-800 text-green-400 font-mono p-4 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        spellCheck="false"
      />

      <div className="mt-4 text-sm text-gray-400">
        <p>✓ 自由に編集可能</p>
        <p>✓ キーと値の両方を変更できる</p>
        <p>✗ 構文エラーのリスクあり</p>
      </div>
    </div>
  );
};

// =====================================
// パターン2：テーブル形式（値のみ編集）
// =====================================
const Pattern2Table = ({ jsonData, onSave, searchQuery }) => {
  const [editedData, setEditedData] = useState(JSON.parse(JSON.stringify(jsonData)));

  // 再帰的にJSONをフラット化
  const flattenJSON = (obj, prefix = '') => {
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
  const updateValue = (path, newValue) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(editedData));
    
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    
    // 型を保持して更新
    if (typeof current[lastKey] === 'number') {
      current[lastKey] = parseFloat(newValue) || 0;
    } else if (typeof current[lastKey] === 'boolean') {
      current[lastKey] = newValue === 'true';
    } else {
      current[lastKey] = newValue;
    }
    
    setEditedData(newData);
  };

  const flatData = flattenJSON(editedData);

  // 検索フィルター
  const filteredData = searchQuery 
    ? flatData.filter(item => 
        item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flatData;

  return (
    <div className="flex flex-col h-full bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">テーブルエディター</h3>
          {searchQuery && (
            <span className="text-sm text-gray-600">
              {filteredData.length} / {flatData.length} 件表示
            </span>
          )}
        </div>
        <button
          onClick={() => onSave(editedData)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-gray-300 rounded">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 w-1/3">パス</th>
              <th className="text-left p-3 font-semibold text-gray-700 w-1/6">キー</th>
              <th className="text-left p-3 font-semibold text-gray-700">値</th>
              <th className="text-left p-3 font-semibold text-gray-700 w-20">型</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600 font-mono">{item.path}</td>
                <td className="p-3 font-medium text-gray-800">{item.key}</td>
                <td className="p-3">
                  {item.type === 'array' ? (
                    <textarea
                      value={JSON.stringify(item.value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateValue(item.path, parsed);
                        } catch (e) {}
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 font-mono text-sm"
                      rows="3"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateValue(item.path, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </td>
                <td className="p-3 text-xs text-gray-500">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>✓ キーは表示のみ（編集不可）</p>
        <p>✓ 値だけを安全に編集</p>
        <p>✓ 型を自動判定</p>
      </div>
    </div>
  );
};

// =====================================
// パターン3：ツリー構造
// =====================================
const TreeNode = ({ path, nodeKey, value, onUpdate, level = 0, searchQuery, matchesSearch }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isPrimitive = !isObject && !isArray;

  // このノードまたは子ノードが検索にマッチするか
  const isMatchingNode = matchesSearch(nodeKey) || matchesSearch(value);

  const handleEdit = () => {
    setEditValue(String(value));
    setIsEditing(true);
  };

  const handleSave = () => {
    let parsedValue = editValue;
    
    if (typeof value === 'number') {
      parsedValue = parseFloat(editValue) || 0;
    } else if (typeof value === 'boolean') {
      parsedValue = editValue === 'true';
    }
    
    onUpdate(path, parsedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const indent = `${level * 24}px`;

  // ハイライト用のクラス
  const highlightClass = isMatchingNode && searchQuery ? 'bg-yellow-900/50' : '';

  return (
    <div>
      <div
        className={`flex items-center py-1 hover:bg-gray-700 rounded px-2 ${highlightClass}`}
        style={{ paddingLeft: indent }}
      >
        {/* 展開/折りたたみボタン */}
        {(isObject || isArray) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-400 hover:text-white"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        
        {/* キー名（編集不可） */}
        <span className={`font-mono mr-2 min-w-[120px] ${matchesSearch(nodeKey) ? 'text-yellow-400 font-bold' : 'text-blue-400'}`}>
          {nodeKey}:
        </span>

        {/* 値の表示・編集 */}
        {isPrimitive && (
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  className="flex-1 bg-gray-600 text-white px-2 py-1 rounded border border-blue-500 focus:outline-none"
                  autoFocus
                />
                <span className="text-xs text-gray-400">Ctrl+Enter</span>
              </div>
            ) : (
              <span 
                className={`font-mono flex-1 cursor-pointer hover:bg-gray-600 px-2 py-1 rounded ${
                  matchesSearch(value) ? 'text-yellow-400 font-bold' : 'text-green-400'
                }`}
                onClick={handleEdit}
              >
                {typeof value === 'string' ? `"${value}"` : String(value)}
              </span>
            )}
          </div>
        )}

        {isArray && (
          <span className="text-gray-400 text-sm">[{value.length} items]</span>
        )}
        {isObject && (
          <span className="text-gray-400 text-sm">{`{${Object.keys(value).length} props}`}</span>
        )}
      </div>

      {/* 子要素 */}
      {isExpanded && (isObject || isArray) && (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <TreeNode
              key={key}
              path={`${path}.${key}`}
              nodeKey={key}
              value={val}
              onUpdate={onUpdate}
              level={level + 1}
              searchQuery={searchQuery}
              matchesSearch={matchesSearch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Pattern3Tree = ({ jsonData, onSave, searchQuery }) => {
  const [editedData, setEditedData] = useState(JSON.parse(JSON.stringify(jsonData)));

  const updateValue = (path, newValue) => {
    const keys = path.split('.').filter(k => k);
    const newData = JSON.parse(JSON.stringify(editedData));
    
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = newValue;
    setEditedData(newData);
  };

  // 検索にマッチするかチェック
  const matchesSearch = (text) => {
    if (!searchQuery) return false;
    return String(text).toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">ツリー構造エディター</h3>
          {searchQuery && (
            <span className="text-sm text-gray-400">
              検索中: "{searchQuery}"
            </span>
          )}
        </div>
        <button
          onClick={() => onSave(editedData)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-800 rounded p-4 font-mono text-sm">
        {Object.entries(editedData).map(([key, value]) => (
          <TreeNode
            key={key}
            path={key}
            nodeKey={key}
            value={value}
            onUpdate={updateValue}
            level={0}
            searchQuery={searchQuery}
            matchesSearch={matchesSearch}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>✓ 階層構造を視覚的に表示</p>
        <p>✓ 値をクリックで編集開始</p>
        <p>✓ Ctrl+Enter で保存、Esc でキャンセル</p>
      </div>
    </div>
  );
};

// =====================================
// ゲーム用ヘッダー（トグルのみ）
// =====================================
const GameHeader = ({ onToggleEditor, isDev }) => {
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

// =====================================
// エディター専用ヘッダー
// =====================================
const EditorHeader = ({ 
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
        {/* 左側：ファイル名 */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-200">{jsonFileName}</h1>
        </div>

        {/* 中央：検索窓 */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="JSON内を検索..."
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="7" cy="7" r="6" />
              <path d="M11 11l4 4" />
            </svg>
          </div>
        </div>

        {/* 右側：パターン選択とトグル */}
        <div className="flex gap-3 items-center">
          {/* パターン切り替え */}
          <select
            value={currentPattern}
            onChange={(e) => onPatternChange(Number(e.target.value))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>パターン1: テキストエリア</option>
            <option value={2}>パターン2: テーブル</option>
            <option value={3}>パターン3: ツリー</option>
          </select>

          {/* ゲーム表示ボタン */}
          <div className="flex gap-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={onToggleGame}
              className="p-2 rounded transition bg-gray-900 text-white"
              title="ゲーム表示"
            >
              <Eye size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
// =====================================
// メインアプリ（3パターン切り替え）
// =====================================
const App = () => {
  const [currentView, setCurrentView] = useState('game');
  const [currentPattern, setCurrentPattern] = useState(3);
  const [gameData, setGameData] = useState(sampleNovelData);
  const [searchQuery, setSearchQuery] = useState('');
  const [jsonFileName] = useState('novel_data.json'); // 実際はプロップスで受け取る

  const isDev = true; // 開発モード（本番ではfalseにする）

  // JSON内を検索してマッチする部分をハイライト
  const searchInJSON = (obj, query) => {
    if (!query) return obj;
    
    const search = query.toLowerCase();
    let hasMatch = false;

    const checkMatch = (value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search);
      }
      return false;
    };

    const traverse = (item) => {
      if (typeof item === 'object' && item !== null) {
        for (let key in item) {
          if (checkMatch(key) || checkMatch(item[key])) {
            hasMatch = true;
          }
          if (typeof item[key] === 'object') {
            traverse(item[key]);
          }
        }
      }
    };

    traverse(obj);
    return obj;
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {currentView === 'game' ? (
        <>
          {/* ゲーム用ヘッダー（トグルのみ） */}
          <GameHeader 
            onToggleEditor={() => setCurrentView('editor')}
            isDev={isDev}
          />

          {/* ゲーム画面 */}
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">ノベルゲーム画面</h2>
              <p className="text-xl mb-2">{gameData.scene1.dialogue}</p>
              <p className="text-gray-300">キャラクター: {gameData.scene1.character}</p>
              <div className="mt-8">
                <button className="bg-white text-purple-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                  次へ進む
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* エディター専用ヘッダー */}
          <EditorHeader
            jsonFileName={jsonFileName}
            currentPattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onToggleGame={() => setCurrentView('game')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* エディター画面 */}
          <div className="flex-1 overflow-hidden">
            {currentPattern === 1 && (
              <Pattern1TextArea 
                jsonData={gameData} 
                onSave={setGameData}
                searchQuery={searchQuery}
              />
            )}
            {currentPattern === 2 && (
              <Pattern2Table 
                jsonData={gameData} 
                onSave={setGameData}
                searchQuery={searchQuery}
              />
            )}
            {currentPattern === 3 && (
              <Pattern3Tree 
                jsonData={gameData} 
                onSave={setGameData}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
