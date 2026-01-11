# アイテム画面 完全資料

## 📋 概要

短編ノベルゲーム向けのアイテム管理画面。
- **2カラム表示**で左右に均等配置
- **＋ボタン**で新規アイテム追加
- **インライン編集**機能搭載
- **DICT構造**による説明管理

---

## 🎨 画面構成

```
┌─────────────────────────────────────────────────┐
│ 📦 アイテム管理                                   │
├─────────────────────────────────────────────────┤
│ [すべて][アイテム][武器][防具][アクセ][ヴィジュアル][キー] │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌──────────────┐  ┌──────────────┐             │
│ │ アイテム1    │  │ アイテム2    │             │
│ └──────────────┘  └──────────────┘             │
│ ┌──────────────┐  ┌──────────────┐             │
│ │ アイテム3    │  │ アイテム4    │             │
│ └──────────────┘  └──────────────┘             │
│ ┌──────────────┐  ┌──────────────┐             │
│ │ アイテム5    │  │ ＋新規追加   │             │
│ └──────────────┘  └──────────────┘             │
│                                                 │
│ ┌─────────────────────────────────────────┐    │
│ │ 選択中アイテムの詳細 / 編集フォーム      │    │
│ └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## 📊 データ構造

### 基本構造（JSON）

```json
{
  "id": "item_001",
  "name": "小回復ゼリー",
  "icon": "🧪",
  "iconType": "emoji",
  "category": "consumable",
  "dict": {
    "short": "体力を30%回復する",
    "detail": "体力を最大の30%分回復する。ほんのり甘い薬相性の飲むゼリー。"
  },
  "owned": true,
  "count": 5,
  "maxCount": 99,
  "tags": ["consumable", "heal"]
}
```

### フィールド詳細

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✅ | 一意なID（`item_XXX`形式推奨） |
| name | string | ✅ | アイテム名 |
| icon | string | ✅ | 表示アイコン（絵文字 / URL / テキスト） |
| iconType | select | ✅ | アイコンタイプ（emoji / icon / image / text） |
| category | select | ✅ | カテゴリ（consumable / weapon / armor / accessory / visual / key） |
| dict.short | string | ✅ | 簡易説明（1行） |
| dict.detail | string | ✅ | 詳細説明（複数行可） |
| owned | boolean | ✅ | 取得済みフラグ |
| count | number | ✅ | 現在の所持数 |
| maxCount | number | ✅ | 最大所持数 |
| tags | array | ❌ | タグ配列（任意） |

---

## 🎮 操作フロー

### 1️⃣ アイテムの閲覧

1. タブでカテゴリ切り替え（すべて / アイテム / 武器...）
2. 2カラムのリストから選択
3. 下部パネルに詳細表示

### 2️⃣ アイテムの追加

1. 右下または左下の **「＋新しいアイテムを追加」** ボタンをクリック
2. 新規アイテムが生成され、**自動的に編集モード**に移行
3. フォームに情報を入力
4. **「保存」** ボタンで確定

### 3️⃣ アイテムの編集

1. アイテムを選択
2. 詳細パネルの **「編集」** ボタンをクリック
3. インライン編集フォーム表示
4. 各フィールドを編集
5. **「保存」** で確定 / **「キャンセル」** で破棄

### 4️⃣ アイテムの削除

1. アイテムを選択
2. **「編集」** → 編集モードに移行
3. **「削除」** ボタンをクリック
4. アイテムがリストから削除

---

## 🔧 編集フォーム詳細

### 入力フィールド一覧

```
┌─────────────────────────────────────┐
│ [アイテム名] [Icon]                  │
│ [Icon Type ▼] [カテゴリ ▼]          │
│ [DICT - Short]                      │
│ [DICT - Detail（複数行）]            │
│ [所持数] [最大所持数]                 │
│ [タグ（カンマ区切り）]                │
│                                     │
│ [保存] [キャンセル] [削除]           │
└─────────────────────────────────────┘
```

### Icon Type（セレクト）

| 値 | ラベル | 説明 |
|----|--------|------|
| emoji | 絵文字 | 絵文字を直接入力（🧪💊⚔️） |
| icon | アイコン | アイコンフォント（将来対応） |
| image | 画像 | 画像URL（将来対応） |
| text | テキスト | テキスト表示 |

### Category（セレクト）

| 値 | ラベル |
|----|--------|
| consumable | アイテム |
| weapon | 武器 |
| armor | 防具 |
| accessory | アクセサリー |
| visual | ヴィジュアル |
| key | キーアイテム |

### DICT構造の意図

**DICT = Dictionary（辞書）**

- **short**: 
  - 一覧表示用
  - ツールチップ用
  - 1行に収まる簡潔な説明
  
- **detail**:
  - 詳細パネル用
  - 複数行の詳細説明
  - ストーリー性のある説明も可

**メリット**:
- Tips（用語集）と統一構造
- Notion → JSON 変換が容易
- 表示場所に応じた使い分けが明確

---

## 🔗 Notion Database 対応

### カラム設計

| Notion列 | 型 | JSON Path | 説明 |
|---------|-----|-----------|------|
| Name | title | name | アイテム名 |
| Icon | text | icon | アイコン（絵文字など） |
| IconType | select | iconType | emoji/icon/image/text |
| Category | select | category | カテゴリ |
| Short | text | dict.short | 簡易説明 |
| Detail | text | dict.detail | 詳細説明 |
| Owned | checkbox | owned | 取得済み |
| Count | number | count | 所持数 |
| MaxCount | number | maxCount | 最大所持数 |
| Tags | multi-select | tags | タグ配列 |
| ID | text | id | 一意ID |

### Notion → JSON 変換スクリプト例

```javascript
// Notion API レスポンス → JSON変換
function notionToItemJson(notionItem) {
  return {
    id: notionItem.properties.ID.rich_text[0].plain_text,
    name: notionItem.properties.Name.title[0].plain_text,
    icon: notionItem.properties.Icon.rich_text[0]?.plain_text || '📦',
    iconType: notionItem.properties.IconType.select.name,
    category: notionItem.properties.Category.select.name,
    dict: {
      short: notionItem.properties.Short.rich_text[0]?.plain_text || '',
      detail: notionItem.properties.Detail.rich_text[0]?.plain_text || ''
    },
    owned: notionItem.properties.Owned.checkbox,
    count: notionItem.properties.Count.number,
    maxCount: notionItem.properties.MaxCount.number,
    tags: notionItem.properties.Tags.multi_select.map(tag => tag.name)
  };
}
```

---

## 🎯 実装されている機能

### ✅ 完成済み

- [x] 2カラムレイアウト
- [x] タブ切り替え（カテゴリフィルター）
- [x] アイテム選択
- [x] 詳細パネル表示
- [x] インライン編集フォーム
- [x] 新規追加（＋ボタン）
- [x] 削除機能
- [x] 未取得アイテムのグレーアウト
- [x] DICT構造（short / detail）
- [x] Icon Type セレクト
- [x] レスポンシブ対応

### 🔄 拡張可能な機能

- [ ] 画像アップロード（iconType: image 対応）
- [ ] ドラッグ&ドロップ並び替え
- [ ] 検索機能
- [ ] インポート/エクスポート（JSON/CSV）
- [ ] 一括編集
- [ ] プレビューモード
- [ ] アイテム効果のビジュアル化

---

## 💾 データ保存方式

### 現在の実装（State管理）

```javascript
const [state, dispatch] = useReducer(itemReducer, {
  items: initialItems,
  selectedItemId: null,
  editingItemId: null,
  activeTab: 'all'
});
```

**メモリ内管理** → ページリロードでリセット

### 推奨：LocalStorage 保存

```javascript
// 保存
useEffect(() => {
  localStorage.setItem('items', JSON.stringify(state.items));
}, [state.items]);

// 読み込み
const savedItems = JSON.parse(localStorage.getItem('items') || '[]');
```

### 推奨：外部JSON管理

```
src/data/
├── items.json          # アイテムデータ
├── characters.json     # キャラデータ
└── tips.json           # 用語データ
```

---

## 🎨 デザインの特徴

### カラースキーム

```css
--primary-gold: #FFD700;
--primary-orange: #FFA500;
--bg-dark: #0f0f1e;
--bg-medium: #1a1a2e;
--bg-light: #16213e;
--text-primary: #e8e8e8;
--text-secondary: #b0b0b0;
--border-subtle: rgba(255, 255, 255, 0.08);
```

### アニメーション

- ホバー時の **translateX(4px)** シフト
- 選択時の **ゴールドグロー**
- ボタンホバー時の **scale(1.02)**
- フォーカス時の **ボーダーアニメーション**

---

## 📱 レスポンシブ対応

| ブレークポイント | レイアウト |
|----------------|-----------|
| 1024px以上 | 2カラム表示 |
| 768px～1023px | 1カラム表示 |
| 767px以下 | 1カラム + コンパクト表示 |

---

## 🔒 バリデーション

### 必須チェック

- アイテム名は必須
- Iconは必須（デフォルト: 📦）
- カテゴリは必須
- DICT shortは必須
- DICT detailは必須
- 所持数 ≧ 0
- 最大所持数 ≧ 1

### 推奨ルール

- ID形式: `item_XXX`（XXXは連番またはタイムスタンプ）
- タグは小文字推奨
- DICT shortは50文字以内
- DICT detailは500文字以内

---

## 🚀 使用例

### 基本的な使用

```jsx
import ItemScreen from './ItemScreen';

function App() {
  return <ItemScreen />;
}
```

### 外部データ連携

```jsx
import ItemScreen from './ItemScreen';
import itemsData from './data/items.json';

function App() {
  return <ItemScreen initialItems={itemsData} />;
}
```

---

## 🐛 トラブルシューティング

### Q1: ＋ボタンが片方にしか表示されない

**A**: これは正常動作です。アイテム数が偶数の場合は左カラムに、奇数の場合は右カラムに表示されます。

### Q2: 編集が保存されない

**A**: 現在メモリ内管理のため、ページリロードでリセットされます。LocalStorageまたは外部JSON保存を実装してください。

### Q3: アイコンが表示されない

**A**: iconTypeが"emoji"の場合、絵文字をそのまま入力してください（🧪💊⚔️）

---

## 📄 エクスポート形式

### JSON出力例

```json
{
  "items": [
    {
      "id": "item_001",
      "name": "小回復ゼリー",
      "icon": "🧪",
      "iconType": "emoji",
      "category": "consumable",
      "dict": {
        "short": "体力を30%回復する",
        "detail": "体力を最大の30%分回復する。ほんのり甘い薬相性の飲むゼリー。"
      },
      "owned": true,
      "count": 5,
      "maxCount": 99,
      "tags": ["consumable", "heal"]
    }
  ]
}
```

---

## 🎓 設計思想

### なぜDICT構造？

1. **Tips（用語集）との統一**
   - Character/Item/Tipsで共通構造
   
2. **表示場所の明確化**
   - short = リスト/カード表示
   - detail = 詳細パネル
   
3. **Notion連携の容易さ**
   - 2つのカラムで管理可能

### なぜ2カラム？

1. **視認性の向上**
   - 一覧性が高い
   - スクロール量の削減
   
2. **比較しやすさ**
   - 左右のアイテムを比較
   
3. **RPG UI の伝統**
   - 参考画像のレイアウト踏襲

### なぜインライン編集？

1. **シームレスな体験**
   - モーダルを開く必要がない
   
2. **コンテキストの維持**
   - 他のアイテムも見える
   
3. **高速な編集**
   - 選択→編集→保存の流れが早い

---

## 📚 関連資料

- **collection.json**: 全体のカテゴリ構成
- **COLLECTION_README.md**: Collection全体の設計書
- **item_layout_design.md**: UIレイアウト詳細設計

---

**作成日**: 2026-01-05  
**バージョン**: 1.0.0  
**対応範囲**: 短編ノベルゲーム  
**拡張性**: 長編・RPG化も対応可能
