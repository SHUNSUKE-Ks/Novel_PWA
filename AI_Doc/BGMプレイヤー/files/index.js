/**
 * BGMプレイヤー用カスタムフック集
 * 
 * このファイルは、BGMプレイヤーで使用されるすべてのカスタムフックを
 * エクスポートします。
 */

// プレイヤー基本機能
export {
  useAudioPlayer,
  usePlaylist,
  useRepeatMode,
  useShuffleMode,
  usePlayHistory,
  useKeyboardShortcuts,
  useTimeFormat,
} from './usePlayer';

// 統合状態管理
export {
  usePlayerState,
  useProgressBar,
  PLAYER_ACTIONS,
} from './usePlayerState';

// ストレージ連携
export {
  useLocalStorage,
  usePlayerPreferences,
  usePlayHistoryPersist,
  useFavorites,
  useLastPlayedPosition,
} from './useStorage';
