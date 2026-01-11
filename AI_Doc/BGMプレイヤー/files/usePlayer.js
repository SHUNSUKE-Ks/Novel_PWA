import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 音楽プレイヤーの状態を管理するフック
 */
export const useAudioPlayer = (playlist) => {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    playlist.findIndex(track => track.selected) || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  // オーディオ要素の初期化
  useEffect(() => {
    audioRef.current = new Audio(currentTrack?.audioUrl);
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentTrackIndex]);

  // 再生/一時停止
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // 次の曲
  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  // 前の曲
  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  // 特定の曲を再生
  const playTrack = useCallback((index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  // シーク
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // ボリューム変更
  const changeVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  // ミュート切り替え
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    playNext,
    playPrevious,
    playTrack,
    seek,
    changeVolume,
    toggleMute,
  };
};

/**
 * プレイリストの管理を行うフック
 */
export const usePlaylist = (initialPlaylist) => {
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [filteredPlaylist, setFilteredPlaylist] = useState(initialPlaylist);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // フィルタリング処理
  useEffect(() => {
    let filtered = playlist;

    // 選択した曲のみ表示
    if (showSelectedOnly) {
      filtered = filtered.filter(track => track.selected);
    }

    // 検索クエリでフィルタリング
    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlaylist(filtered);
  }, [playlist, showSelectedOnly, searchQuery]);

  // 曲の選択状態を切り替え
  const toggleTrackSelection = useCallback((trackId) => {
    setPlaylist(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, selected: !track.selected } : track
      )
    );
  }, []);

  // プレイリストをシャッフル
  const shufflePlaylist = useCallback(() => {
    setPlaylist(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

  // プレイリストをソート
  const sortPlaylist = useCallback((sortBy = 'title') => {
    setPlaylist(prev => {
      const sorted = [...prev];
      sorted.sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
      return sorted;
    });
  }, []);

  return {
    playlist,
    filteredPlaylist,
    showSelectedOnly,
    setShowSelectedOnly,
    searchQuery,
    setSearchQuery,
    toggleTrackSelection,
    shufflePlaylist,
    sortPlaylist,
  };
};

/**
 * リピートモードを管理するフック
 */
export const useRepeatMode = () => {
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'off': return 'all';
        case 'all': return 'one';
        case 'one': return 'off';
        default: return 'off';
      }
    });
  }, []);

  return {
    repeatMode,
    cycleRepeatMode,
  };
};

/**
 * シャッフルモードを管理するフック
 */
export const useShuffleMode = () => {
  const [isShuffleOn, setIsShuffleOn] = useState(false);

  const toggleShuffle = useCallback(() => {
    setIsShuffleOn(prev => !prev);
  }, []);

  return {
    isShuffleOn,
    toggleShuffle,
  };
};

/**
 * 再生履歴を管理するフック
 */
export const usePlayHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((trackId) => {
    setHistory(prev => {
      // 現在の位置より後の履歴を削除
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(trackId);
      // 履歴は最大50件まで
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      setHistoryIndex(prev => prev - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [canGoBack, history, historyIndex]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      setHistoryIndex(prev => prev + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [canGoForward, history, historyIndex]);

  return {
    history,
    canGoBack,
    canGoForward,
    addToHistory,
    goBack,
    goForward,
  };
};

/**
 * キーボードショートカットを管理するフック
 */
export const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // 入力フィールドにフォーカスがある場合は無視
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlers.onTogglePlay?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handlers.onNext?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlers.onPrevious?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          handlers.onVolumeUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          handlers.onVolumeDown?.();
          break;
        case 'm':
          handlers.onToggleMute?.();
          break;
        case 's':
          handlers.onToggleShuffle?.();
          break;
        case 'r':
          handlers.onToggleRepeat?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
};

/**
 * 時間のフォーマットを行うユーティリティフック
 */
export const useTimeFormat = () => {
  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { formatTime };
};
