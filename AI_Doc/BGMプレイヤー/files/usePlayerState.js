import { useReducer, useEffect, useRef, useCallback } from 'react';

// アクションタイプ
export const PLAYER_ACTIONS = {
  SET_PLAYING: 'SET_PLAYING',
  SET_TRACK: 'SET_TRACK',
  SET_TIME: 'SET_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  TOGGLE_SHUFFLE: 'TOGGLE_SHUFFLE',
  CYCLE_REPEAT: 'CYCLE_REPEAT',
  NEXT_TRACK: 'NEXT_TRACK',
  PREVIOUS_TRACK: 'PREVIOUS_TRACK',
  SET_PLAYLIST: 'SET_PLAYLIST',
  TOGGLE_TRACK_SELECTION: 'TOGGLE_TRACK_SELECTION',
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
};

// 初期状態
const initialState = {
  // プレイヤー状態
  isPlaying: false,
  currentTrackIndex: 0,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  
  // モード
  shuffleMode: false,
  repeatMode: 'off', // 'off', 'all', 'one'
  
  // プレイリスト
  playlist: [],
  originalPlaylist: [],
  
  // フィルター
  showSelectedOnly: false,
  searchQuery: '',
};

// リデューサー関数
const playerReducer = (state, action) => {
  switch (action.type) {
    case PLAYER_ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: action.payload };

    case PLAYER_ACTIONS.SET_TRACK:
      return { 
        ...state, 
        currentTrackIndex: action.payload,
        currentTime: 0,
      };

    case PLAYER_ACTIONS.SET_TIME:
      return { ...state, currentTime: action.payload };

    case PLAYER_ACTIONS.SET_DURATION:
      return { ...state, duration: action.payload };

    case PLAYER_ACTIONS.SET_VOLUME:
      return { 
        ...state, 
        volume: action.payload,
        isMuted: action.payload === 0,
      };

    case PLAYER_ACTIONS.TOGGLE_MUTE:
      return { ...state, isMuted: !state.isMuted };

    case PLAYER_ACTIONS.TOGGLE_SHUFFLE:
      return { ...state, shuffleMode: !state.shuffleMode };

    case PLAYER_ACTIONS.CYCLE_REPEAT:
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...state, repeatMode: nextMode };

    case PLAYER_ACTIONS.NEXT_TRACK: {
      let nextIndex;
      
      if (state.repeatMode === 'one') {
        nextIndex = state.currentTrackIndex;
      } else if (state.shuffleMode) {
        // シャッフル時はランダムに選択
        nextIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
      }
      
      return { 
        ...state, 
        currentTrackIndex: nextIndex,
        currentTime: 0,
      };
    }

    case PLAYER_ACTIONS.PREVIOUS_TRACK: {
      // 3秒以上再生している場合は曲の最初に戻る
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      
      const prevIndex = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
      return { 
        ...state, 
        currentTrackIndex: prevIndex,
        currentTime: 0,
      };
    }

    case PLAYER_ACTIONS.SET_PLAYLIST:
      return { 
        ...state, 
        playlist: action.payload,
        originalPlaylist: action.payload,
      };

    case PLAYER_ACTIONS.TOGGLE_TRACK_SELECTION: {
      const updatedPlaylist = state.playlist.map(track =>
        track.id === action.payload 
          ? { ...track, selected: !track.selected }
          : track
      );
      return { 
        ...state, 
        playlist: updatedPlaylist,
        originalPlaylist: updatedPlaylist,
      };
    }

    case PLAYER_ACTIONS.SET_FILTER:
      return { ...state, showSelectedOnly: action.payload };

    case PLAYER_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
};

/**
 * 統合プレイヤー状態管理フック
 */
export const usePlayerState = (initialPlaylist = []) => {
  const [state, dispatch] = useReducer(playerReducer, {
    ...initialState,
    playlist: initialPlaylist,
    originalPlaylist: initialPlaylist,
    currentTrackIndex: initialPlaylist.findIndex(t => t.selected) || 0,
  });

  const audioRef = useRef(null);

  // フィルタリングされたプレイリストを計算
  const getFilteredPlaylist = useCallback(() => {
    let filtered = state.playlist;

    if (state.showSelectedOnly) {
      filtered = filtered.filter(track => track.selected);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.subtitle.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [state.playlist, state.showSelectedOnly, state.searchQuery]);

  // 現在のトラック
  const currentTrack = state.playlist[state.currentTrackIndex];

  // オーディオ要素の管理
  useEffect(() => {
    if (!currentTrack?.audioUrl) return;

    const audio = new Audio(currentTrack.audioUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      dispatch({ type: PLAYER_ACTIONS.SET_TIME, payload: audio.currentTime });
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: PLAYER_ACTIONS.SET_DURATION, payload: audio.duration });
    };

    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (state.repeatMode === 'all' || state.currentTrackIndex < state.playlist.length - 1) {
        dispatch({ type: PLAYER_ACTIONS.NEXT_TRACK });
      } else {
        dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: false });
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // ボリューム設定
    audio.volume = state.volume;
    audio.muted = state.isMuted;

    // 再生状態に応じて再生/停止
    if (state.isPlaying) {
      audio.play().catch(err => console.error('Playback failed:', err));
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack, state.currentTrackIndex]);

  // 再生状態の変更
  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.play().catch(err => console.error('Playback failed:', err));
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  // ボリューム変更
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // ミュート変更
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = state.isMuted;
    }
  }, [state.isMuted]);

  // アクション関数
  const actions = {
    togglePlay: () => dispatch({ 
      type: PLAYER_ACTIONS.SET_PLAYING, 
      payload: !state.isPlaying 
    }),
    
    play: () => dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: true }),
    
    pause: () => dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: false }),
    
    next: () => dispatch({ type: PLAYER_ACTIONS.NEXT_TRACK }),
    
    previous: () => dispatch({ type: PLAYER_ACTIONS.PREVIOUS_TRACK }),
    
    selectTrack: (index) => {
      dispatch({ type: PLAYER_ACTIONS.SET_TRACK, payload: index });
      dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: true });
    },
    
    seek: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        dispatch({ type: PLAYER_ACTIONS.SET_TIME, payload: time });
      }
    },
    
    setVolume: (volume) => dispatch({ 
      type: PLAYER_ACTIONS.SET_VOLUME, 
      payload: Math.max(0, Math.min(1, volume)) 
    }),
    
    toggleMute: () => dispatch({ type: PLAYER_ACTIONS.TOGGLE_MUTE }),
    
    toggleShuffle: () => dispatch({ type: PLAYER_ACTIONS.TOGGLE_SHUFFLE }),
    
    cycleRepeat: () => dispatch({ type: PLAYER_ACTIONS.CYCLE_REPEAT }),
    
    toggleTrackSelection: (trackId) => dispatch({ 
      type: PLAYER_ACTIONS.TOGGLE_TRACK_SELECTION, 
      payload: trackId 
    }),
    
    setFilter: (showSelected) => dispatch({ 
      type: PLAYER_ACTIONS.SET_FILTER, 
      payload: showSelected 
    }),
    
    setSearchQuery: (query) => dispatch({ 
      type: PLAYER_ACTIONS.SET_SEARCH_QUERY, 
      payload: query 
    }),
  };

  return {
    state: {
      ...state,
      currentTrack,
      filteredPlaylist: getFilteredPlaylist(),
    },
    actions,
    audioRef,
  };
};

/**
 * プログレスバー用のカスタムフック
 */
export const useProgressBar = (currentTime, duration, onSeek) => {
  const progressBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateProgress(e);
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateProgress(e);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onSeek(dragProgress * duration);
    }
  }, [isDragging, dragProgress, duration, onSeek]);

  const updateProgress = (e) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setDragProgress(progress);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const progress = isDragging ? dragProgress : (duration > 0 ? currentTime / duration : 0);

  return {
    progressBarRef,
    progress,
    isDragging,
    handleMouseDown,
  };
};
