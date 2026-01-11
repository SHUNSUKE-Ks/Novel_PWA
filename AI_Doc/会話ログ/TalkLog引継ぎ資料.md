# Component引継ぎ資料: 会話ログ (Talk Log)

## 1. 機能概要
`TalkLogModal` は、ゲーム中の会話履歴（ログ）を閲覧するためのオーバーレイUIです。キャラクターごとの発言、アイコン、音声再生ボタンなどの機能を備えており、全画面オーバーレイとして表示されます。

## 2. レイアウト構成表
コンポーネントの視覚的な構造は以下の通りです。

| セクション | 要素 | 説明 |
| :--- | :--- | :--- |
| **Header** | タイトル (Title) | 「会話ログ」のテキスト。 |
| | 閉じるボタン (Close) | モーダルを閉じるための X ボタン。 |
| **Sub Header** | クエストタイトル | 現在進行中のクエスト名（例：メイン 「ダレフ病院の医者に会う」）を表示。 |
| **Content Area** | ログリスト (List) | `TalkLogItem` をスクロール可能なリスト形式で表示。 |
| **TalkLogItem** | アイコン (Avatar) | キャラクターの丸型アイコン（60x60）。 |
| | 名前 (Char Name) | キャラクター名。クリック可能なモードもサポート（デバッグ/編集用）。 |
| | 発言内容 (Bubble) | テキストバブル形式の台詞表示。左側に三角形のポインタ。 |
| | 音声ボタン (Voice) | 台詞の音声を再生するためのボタン（Volume2 アイコン）。 |

## 3. 機能一覧表
提供されている主な機能は以下の通りです。

| 機能名 | 操作 / 仕様 | 説明 |
| :--- | :--- | :--- |
| **表示・制御** | `isOpen` Props | 表示の有無をコントロール。表示中は背景のスクロールを固定します。 |
| **アセット解決** | 自動 (Registry) | `characterName` と `variant` を元に、`characterRegistry.js` を使用してアイコンパスを自動取得します。 |
| **音声再生** | 音声ボタンクリック | `voiceUrl` がある場合、現在のところログに URL を出力（拡張ポイント：Audio APIによる再生）。 |
| **カスタマイズ** | Click Handlers | `onNameClick`, `onIconClick`, `onTextClick` 等のPropsを通じて、各要素のクリックイベントを親から制御可能。 |

## 4. 技術仕様と依存関係

### 4.1 構成ファイル
- **モーダルUI**: `src/componemts_ver2.2/TalkLogModal.jsx`
- **アイテムUI**: `src/componemts_ver2.2/TalkLogItem.jsx`
- **スタイル**: `src/componemts_ver2.2/TalkLog.css`
- **アセット管理**: `src/utils/characterRegistry.js`

### 4.2 データ定義 (Log Data Object)
```javascript
{
  id: 1,
  characterName: "レムナント",
  characterImage: "", // 指定がない場合はRegistryから取得
  variant: "smile",    // Registry参照時の表情差分
  text: "会話の内容がここに入ります。",
  voiceUrl: "path/to/voice.mp3"
}
```

## 5. 導入・再利用時のポイント
- **Z-Index**: `talk-log-overlay` は `z-index: 2000` が設定されており、常に最前面に表示されます。
- **スクロールロック**: `useEffect` によりモーダルが開いている間のみ `body` の `overflow: hidden` を適用します。
- **スタイルの移植**: `TalkLog.css` にはスクロールバーのカスタマイズやバブルの装飾が含まれています。
