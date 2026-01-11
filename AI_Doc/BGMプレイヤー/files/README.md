# BGMプレイヤー カスタムフック ドキュメント

## 概要

BGMプレイヤーで使用するカスタムフックのコレクションです。
状態管理、オーディオ再生、永続化など、プレイヤーに必要な機能を提供します。

---

## フック一覧

### 1. usePlayerState (推奨)

統合的なプレイヤー状態管理フック。useReducerベースで、すべての機能を一つのフックで管理できます。

```javascript
import { usePlayerState } from './hooks';

const MyPlayer = () => {
  const { state, actions } = usePlayerState(initialPlaylist);

  return (
    <div>
      <h2>{state.currentTrack?.title}</h2>
      <button onClick={actions.togglePlay}>
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={actions.next}>Next</button>
      <button onClick={actions.previous}>Previous</button>
    </div>
  );
};
```

**提供される状態:**
- `isPlaying` - 再生中かどうか
- `currentTrack` - 現在のトラック
- `currentTrackIndex` - 現在のトラックのインデックス
- `currentTime` - 現在の再生位置(秒)
- `duration` - トラックの長さ(秒)
- `volume` - ボリューム(0-1)
- `isMuted` - ミュート状態
- `shuffleMode` - シャッフルモード
- `repeatMode` - リピートモード('off', 'all', 'one')
- `playlist` - プレイリスト
- `filteredPlaylist` - フィルタリング済みプレイリスト
- `showSelectedOnly` - 選択した曲のみ表示
- `searchQuery` - 検索クエリ

**提供されるアクション:**
- `togglePlay()` - 再生/一時停止切り替え
- `play()` - 再生
- `pause()` - 一時停止
- `next()` - 次の曲
- `previous()` - 前の曲
- `selectTrack(index)` - 特定のトラックを選択
- `seek(time)` - シーク
- `setVolume(volume)` - ボリューム設定
- `toggleMute()` - ミュート切り替え
- `toggleShuffle()` - シャッフル切り替え
- `cycleRepeat()` - リピートモード循環
- `toggleTrackSelection(trackId)` - トラック選択切り替え
- `setFilter(showSelected)` - フィルター設定
- `setSearchQuery(query)` - 検索クエリ設定

---

### 2. useAudioPlayer

基本的なオーディオ再生機能を提供します。

```javascript
import { useAudioPlayer } from './hooks';

const MyPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
  } = useAudioPlayer(playlist);

  return (
    <div>
      <h2>{currentTrack.title}</h2>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};
```

---

### 3. usePlaylist

プレイリストの管理を行います。

```javascript
import { usePlaylist } from './hooks';

const MyPlaylist = () => {
  const {
    filteredPlaylist,
    showSelectedOnly,
    setShowSelectedOnly,
    searchQuery,
    setSearchQuery,
    toggleTrackSelection,
  } = usePlaylist(initialPlaylist);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="検索..."
      />
      <label>
        <input
          type="checkbox"
          checked={showSelectedOnly}
          onChange={(e) => setShowSelectedOnly(e.target.checked)}
        />
        選択した曲のみ表示
      </label>
      {filteredPlaylist.map(track => (
        <div key={track.id} onClick={() => toggleTrackSelection(track.id)}>
          {track.title}
        </div>
      ))}
    </div>
  );
};
```

---

### 4. useProgressBar

プログレスバーのドラッグ操作を管理します。

```javascript
import { useProgressBar } from './hooks';

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const { progressBarRef, progress, handleMouseDown } = useProgressBar(
    currentTime,
    duration,
    onSeek
  );

  return (
    <div
      ref={progressBarRef}
      onMouseDown={handleMouseDown}
      style={{ width: '100%', height: '4px', background: '#333' }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: '#fff',
        }}
      />
    </div>
  );
};
```

---

### 5. useKeyboardShortcuts

キーボードショートカットを設定します。

```javascript
import { useKeyboardShortcuts } from './hooks';

const MyPlayer = () => {
  useKeyboardShortcuts({
    onTogglePlay: () => console.log('Space pressed'),
    onNext: () => console.log('Right arrow pressed'),
    onPrevious: () => console.log('Left arrow pressed'),
    onVolumeUp: () => console.log('Up arrow pressed'),
    onVolumeDown: () => console.log('Down arrow pressed'),
    onToggleMute: () => console.log('M pressed'),
    onToggleShuffle: () => console.log('S pressed'),
    onToggleRepeat: () => console.log('R pressed'),
  });

  return <div>Player with keyboard shortcuts</div>;
};
```

**サポートされるキー:**
- `Space` - 再生/一時停止
- `→` - 次の曲
- `←` - 前の曲
- `↑` - ボリュームアップ
- `↓` - ボリュームダウン
- `M` - ミュート切り替え
- `S` - シャッフル切り替え
- `R` - リピート切り替え

---

### 6. usePlayerPreferences

プレイヤー設定をローカルストレージに保存します。

```javascript
import { usePlayerPreferences } from './hooks';

const Settings = () => {
  const {
    volume,
    setVolume,
    repeatMode,
    setRepeatMode,
    shuffleMode,
    setShuffleMode,
  } = usePlayerPreferences();

  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
};
```

---

### 7. useFavorites

お気に入り機能を提供します。

```javascript
import { useFavorites } from './hooks';

const TrackItem = ({ track }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div>
      <span>{track.title}</span>
      <button onClick={() => toggleFavorite(track.id)}>
        {isFavorite(track.id) ? '★' : '☆'}
      </button>
    </div>
  );
};
```

---

### 8. useTimeFormat

時間のフォーマットを行います。

```javascript
import { useTimeFormat } from './hooks';

const TimeDisplay = ({ seconds }) => {
  const { formatTime } = useTimeFormat();

  return <span>{formatTime(seconds)}</span>;
};
```

---

## 使用例: 完全なプレイヤー

```javascript
import React from 'react';
import {
  usePlayerState,
  useKeyboardShortcuts,
  usePlayerPreferences,
  useTimeFormat,
} from './hooks';

const FullPlayer = ({ initialPlaylist }) => {
  const { state, actions } = usePlayerState(initialPlaylist);
  const preferences = usePlayerPreferences();
  const { formatTime } = useTimeFormat();

  // キーボードショートカット設定
  useKeyboardShortcuts({
    onTogglePlay: actions.togglePlay,
    onNext: actions.next,
    onPrevious: actions.previous,
    onToggleMute: actions.toggleMute,
    onToggleShuffle: actions.toggleShuffle,
    onToggleRepeat: actions.cycleRepeat,
    onVolumeUp: () => actions.setVolume(state.volume + 0.1),
    onVolumeDown: () => actions.setVolume(state.volume - 0.1),
  });

  return (
    <div className="player">
      {/* アルバムアート */}
      <div className="album-art">
        <img src={state.currentTrack?.image} alt={state.currentTrack?.title} />
      </div>

      {/* 曲情報 */}
      <div className="track-info">
        <h2>{state.currentTrack?.title}</h2>
        <p>{state.currentTrack?.subtitle}</p>
      </div>

      {/* プログレスバー */}
      <div className="progress">
        <span>{formatTime(state.currentTime)}</span>
        <input
          type="range"
          min="0"
          max={state.duration}
          value={state.currentTime}
          onChange={(e) => actions.seek(parseFloat(e.target.value))}
        />
        <span>{formatTime(state.duration)}</span>
      </div>

      {/* コントロール */}
      <div className="controls">
        <button onClick={actions.toggleShuffle}>
          Shuffle {state.shuffleMode ? 'ON' : 'OFF'}
        </button>
        <button onClick={actions.previous}>Previous</button>
        <button onClick={actions.togglePlay}>
          {state.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={actions.next}>Next</button>
        <button onClick={actions.cycleRepeat}>
          Repeat: {state.repeatMode}
        </button>
      </div>

      {/* プレイリスト */}
      <div className="playlist">
        {state.filteredPlaylist.map((track, index) => (
          <div
            key={track.id}
            onClick={() => actions.selectTrack(index)}
            className={track.id === state.currentTrack?.id ? 'active' : ''}
          >
            {track.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullPlayer;
```

---

## ベストプラクティス

1. **usePlayerState を優先的に使用**
   - 単一のフックですべての状態を管理できます
   - useReducerベースで予測可能な状態更新

2. **永続化が必要な場合**
   - usePlayerPreferences, useFavorites を併用

3. **パフォーマンス最適化**
   - 必要なフックのみをインポート
   - useCallback, useMemo を適切に使用

4. **キーボードショートカット**
   - useKeyboardShortcuts で一貫したUX提供

---

## トラブルシューティング

### 音声が再生されない
- audioUrl が正しく設定されているか確認
- ブラウザの自動再生ポリシーに注意

### 状態が保存されない
- ローカルストレージが有効か確認
- プライベートブラウジングモードでは保存されません

### プログレスバーがスムーズに動かない
- useProgressBar を使用してドラッグ操作を実装
