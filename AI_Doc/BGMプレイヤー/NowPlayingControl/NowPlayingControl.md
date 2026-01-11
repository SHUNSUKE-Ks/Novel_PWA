# NowPlayingControl コンポーネント

アルバムアートの前に浮遊するように配置される、現在再生中の曲情報と再生コントロールを表示するコンポーネントです。

## 特徴

- 半透明のガラスモーフィズムデザイン
- インタラクティブなプログレスバー
- 再生/一時停止、スキップ、シャッフル、リピート機能
- クリックでシーク可能なプログレスバー
- レスポンシブデザイン

## Props

| Prop | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| `currentTrack` | `Object` | ✓ | - | 現在の曲情報 `{ title, subtitle }` |
| `isPlaying` | `boolean` | ✓ | - | 再生中かどうか |
| `currentTime` | `number` | | `0` | 現在の再生位置（秒） |
| `duration` | `number` | | `0` | 曲の長さ（秒） |
| `shuffleMode` | `boolean` | | `false` | シャッフルモードのオン/オフ |
| `repeatMode` | `string` | | `'off'` | リピートモード: `'off'` \| `'all'` \| `'one'` |
| `onTogglePlay` | `function` | | - | 再生/一時停止のコールバック |
| `onNext` | `function` | | - | 次の曲のコールバック |
| `onPrevious` | `function` | | - | 前の曲のコールバック |
| `onSeek` | `function` | | - | シーク時のコールバック `(time: number) => void` |
| `onToggleShuffle` | `function` | | - | シャッフル切り替えのコールバック |
| `onToggleRepeat` | `function` | | - | リピート切り替えのコールバック |

## 使用例

### 基本的な使用方法

```jsx
import NowPlayingControl from './NowPlayingControl';

function MyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = {
    title: "Inevitable Fight",
    subtitle: "Story pack Battle Theme"
  };

  return (
    <div className="relative">
      {/* アルバムアート */}
      <div className="album-art">
        <img src="album.jpg" alt="Album" />
      </div>

      {/* 再生コントロール */}
      <NowPlayingControl
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={180}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={() => console.log('Next')}
        onPrevious={() => console.log('Previous')}
        onSeek={(time) => setCurrentTime(time)}
      />
    </div>
  );
}
```

### usePlayerState フックとの統合

```jsx
import { usePlayerState } from './hooks';
import NowPlayingControl from './NowPlayingControl';

function IntegratedPlayer({ playlist }) {
  const { state, actions } = usePlayerState(playlist);

  return (
    <div className="relative">
      <div className="album-art">
        <img src={state.currentTrack?.image} alt="Album" />
      </div>

      <NowPlayingControl
        currentTrack={state.currentTrack}
        isPlaying={state.isPlaying}
        currentTime={state.currentTime}
        duration={state.duration}
        shuffleMode={state.shuffleMode}
        repeatMode={state.repeatMode}
        onTogglePlay={actions.togglePlay}
        onNext={actions.next}
        onPrevious={actions.previous}
        onSeek={actions.seek}
        onToggleShuffle={actions.toggleShuffle}
        onToggleRepeat={actions.cycleRepeat}
      />
    </div>
  );
}
```

## スタイリング

コンポーネントは Tailwind CSS を使用しています。以下のクラスで主要なスタイルが適用されています：

- `bg-black/40 backdrop-blur-md` - 半透明の背景とぼかし効果
- `rounded-2xl` - 角丸
- `shadow-2xl` - 影
- `absolute bottom-8` - アルバムアートの前に配置

### カスタマイズ例

```jsx
// サイズを変更
<div className="w-full max-w-xl"> {/* max-w-2xl から max-w-xl に変更 */}

// 背景の透明度を変更
<div className="bg-black/60 backdrop-blur-lg"> {/* より暗く、ぼかしを強く */}

// ボタンの色を変更
<button className="bg-blue-500 hover:bg-blue-600"> {/* 青系に変更 */}
```

## 機能詳細

### プログレスバー

- クリックすると指定位置にシーク
- ホバー時に色が変化（白 → 青）
- スムーズなトランジション

### リピートモード

- `off`: リピートなし
- `all`: 全曲リピート
- `one`: 1曲リピート（ボタンに「1」の表示が追加）

### ボタン状態

- アクティブな機能（シャッフル、リピート）は背景が白く光る
- 非アクティブ時はグレー表示
- ホバー時に背景が薄く光る

## アクセシビリティ

- すべてのボタンに `title` 属性でツールチップを追加
- 視覚的なフィードバック（ホバー、アクティブ状態）
- セマンティックな HTML 構造

## パフォーマンス

- 不要な再レンダリングを防ぐため、コールバック関数は親コンポーネントでメモ化することを推奨
- プログレスバーの更新は CSS transform を使用してスムーズに

```jsx
// 推奨: useCallback でメモ化
const handleTogglePlay = useCallback(() => {
  setIsPlaying(prev => !prev);
}, []);
```

## ブラウザ対応

- Chrome, Firefox, Safari, Edge の最新版
- backdrop-filter をサポートするブラウザ（IE11 は非対応）
