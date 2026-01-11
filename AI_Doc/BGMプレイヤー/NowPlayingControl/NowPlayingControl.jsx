import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

/**
 * 現在再生中の曲情報と再生コントロールを表示するコンポーネント
 * アルバムアートの前に浮遊するように配置される
 */
const NowPlayingControl = ({
  currentTrack,
  isPlaying,
  currentTime = 0,
  duration = 0,
  shuffleMode = false,
  repeatMode = 'off',
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  // プログレスの割合を計算
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 時間をフォーマット (例: 125秒 -> "2:05")
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // プログレスバーをクリックしてシーク
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek?.(newTime);
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      {/* 半透明の背景カード */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        
        {/* 曲情報 */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-1 text-white">
            {currentTrack?.title || 'No Track Selected'}
          </h2>
          <p className="text-gray-400 text-sm">
            {currentTrack?.subtitle || '---'}
          </p>
        </div>
        
        {/* プログレスバー */}
        <div className="mb-4">
          {/* 時間表示 */}
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* プログレスバー本体 */}
          <div
            className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full transition-all group-hover:bg-blue-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex items-center justify-center gap-6">
          {/* シャッフルボタン */}
          <button
            onClick={onToggleShuffle}
            className={`p-2 rounded-full transition ${
              shuffleMode
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-gray-400'
            }`}
            title="シャッフル"
          >
            <Shuffle size={20} />
          </button>

          {/* 前の曲ボタン */}
          <button
            onClick={onPrevious}
            className="p-3 hover:bg-white/10 rounded-full transition text-white"
            title="前の曲"
          >
            <SkipBack size={24} />
          </button>

          {/* 再生/一時停止ボタン（メイン） */}
          <button
            onClick={onTogglePlay}
            className="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition shadow-lg hover:scale-105 transform"
            title={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? (
              <Pause size={28} fill="black" />
            ) : (
              <Play size={28} fill="black" className="ml-1" />
            )}
          </button>

          {/* 次の曲ボタン */}
          <button
            onClick={onNext}
            className="p-3 hover:bg-white/10 rounded-full transition text-white"
            title="次の曲"
          >
            <SkipForward size={24} />
          </button>

          {/* リピートボタン */}
          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition relative ${
              repeatMode !== 'off'
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-gray-400'
            }`}
            title={`リピート: ${repeatMode === 'one' ? '1曲' : repeatMode === 'all' ? '全曲' : 'オフ'}`}
          >
            <Repeat size={20} />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black rounded-full text-xs flex items-center justify-center font-bold">
                1
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingControl;
