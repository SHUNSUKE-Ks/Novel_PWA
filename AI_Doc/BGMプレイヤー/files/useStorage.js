import { useState, useEffect, useCallback } from 'react';

/**
 * ローカルストレージと同期するフック
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * プレイヤー設定を永続化するフック
 */
export const usePlayerPreferences = () => {
  const [volume, setVolume] = useLocalStorage('bgm-player-volume', 1);
  const [repeatMode, setRepeatMode] = useLocalStorage('bgm-player-repeat', 'off');
  const [shuffleMode, setShuffleMode] = useLocalStorage('bgm-player-shuffle', false);
  const [showSelectedOnly, setShowSelectedOnly] = useLocalStorage('bgm-player-filter', false);

  return {
    volume,
    setVolume,
    repeatMode,
    setRepeatMode,
    shuffleMode,
    setShuffleMode,
    showSelectedOnly,
    setShowSelectedOnly,
  };
};

/**
 * 再生履歴を永続化するフック
 */
export const usePlayHistoryPersist = () => {
  const [history, setHistory] = useLocalStorage('bgm-player-history', []);

  const addToHistory = useCallback((track) => {
    setHistory(prev => {
      const newHistory = [
        {
          trackId: track.id,
          title: track.title,
          playedAt: new Date().toISOString(),
        },
        ...prev.filter(item => item.trackId !== track.id), // 重複を削除
      ].slice(0, 50); // 最新50件まで保持

      return newHistory;
    });
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addToHistory,
    clearHistory,
  };
};

/**
 * お気に入り管理フック
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('bgm-player-favorites', []);

  const isFavorite = useCallback((trackId) => {
    return favorites.includes(trackId);
  }, [favorites]);

  const toggleFavorite = useCallback((trackId) => {
    setFavorites(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  }, [setFavorites]);

  const addFavorite = useCallback((trackId) => {
    setFavorites(prev => {
      if (!prev.includes(trackId)) {
        return [...prev, trackId];
      }
      return prev;
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((trackId) => {
    setFavorites(prev => prev.filter(id => id !== trackId));
  }, [setFavorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
};

/**
 * 最後に再生した位置を記憶するフック
 */
export const useLastPlayedPosition = () => {
  const [positions, setPositions] = useLocalStorage('bgm-player-positions', {});

  const savePosition = useCallback((trackId, time) => {
    setPositions(prev => ({
      ...prev,
      [trackId]: time,
    }));
  }, [setPositions]);

  const getPosition = useCallback((trackId) => {
    return positions[trackId] || 0;
  }, [positions]);

  const clearPosition = useCallback((trackId) => {
    setPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[trackId];
      return newPositions;
    });
  }, [setPositions]);

  return {
    savePosition,
    getPosition,
    clearPosition,
  };
};
