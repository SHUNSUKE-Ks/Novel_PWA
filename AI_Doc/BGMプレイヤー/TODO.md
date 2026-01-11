# BGMプレイヤー実装 TODOリスト

`AI_Doc/BGMプレイヤー` の資料に基づき、現在のプロジェクトにBGMプレイヤー機能を実装します。

## 1. 基盤の実装
- [ ] `src/hooks/useBGMPlayer.js` の作成
    - [ ] `usePlayerState` ロジックの移植（オーディオ再生、状態管理）
    - [ ] `useProgressBar` ロジックの追加（シークバー制御）
- [ ] `src/utils/timeFormatter.js` の作成（時間のフォーマットユーティリティ）

## 2. UIコンポーネントの実装
- [ ] `src/screens/BGMPlayerScreen.jsx` の作成
    - [ ] `lucide-react` アイコンの適用
    - [ ] プレイリスト表示、再生コントロール、アルバムアート（ダミー）の実装
- [ ] `src/styles/screens/bgmPlayer.css` の作成
    - [ ] Tailwind CSSのスタイルをバニラCSSに変換して適用

## 3. インテグレーション
- [ ] `src/hooks/useGameStore.js` の更新
    - [ ] `SOUND`（BGMプレイヤー用）画面の定義追加
    - [ ] `goToBGMPlayer` アクションの追加
- [ ] `src/App.jsx` の更新
    - [ ] `BGMPlayerScreen` のインポートとルーティングへの追加
- [ ] `src/screens/CollectionScreen.jsx` の更新
    - [ ] 「Sound」カテゴリボタンの有効化と画面遷移の紐付け

## 4. 動作確認・調整
- [ ] 基本的な再生、一時停止、スキップ機能の確認
- [ ] プレイリストの検索、フィルタリング機能の確認
- [ ] レスポンシブレイアウトの微調整

---
> [!NOTE]
> 現在、実ファイルが存在しないため、初期データは資料のサンプルデータを使用し、URLはプレースホルダーまたはダミーで実装します。
