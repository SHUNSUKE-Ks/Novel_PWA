import React, { useState } from 'react';
import NowPlayingControl from './NowPlayingControl';

/**
 * NowPlayingControlコンポーネントの使用例
 */
const NowPlayingExample = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');

  // サンプルトラック
  const currentTrack = {
    title: "Inevitable Fight",
    subtitle: "Story pack Battle Theme",
  };

  const duration = 180; // 3分

  // リピートモードを循環
  const cycleRepeatMode = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative">
      {/* 背景のアルバムアート（イメージ） */}
      <div className="w-96 h-96 bg-white/10 rounded-lg flex items-center justify-center text-white/50 text-xl">
        Album Art
      </div>

      {/* 再生コントロール（前面に配置） */}
      <NowPlayingControl
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        shuffleMode={shuffleMode}
        repeatMode={repeatMode}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={() => console.log('Next track')}
        onPrevious={() => console.log('Previous track')}
        onSeek={(time) => {
          setCurrentTime(time);
          console.log('Seek to:', time);
        }}
        onToggleShuffle={() => setShuffleMode(!shuffleMode)}
        onToggleRepeat={cycleRepeatMode}
      />

      {/* デモ用: 時間を進めるボタン */}
      <button
        onClick={() => setCurrentTime((t) => Math.min(t + 10, duration))}
        className="absolute top-4 right-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30"
      >
        +10秒
      </button>
    </div>
  );
};

export default NowPlayingExample;
