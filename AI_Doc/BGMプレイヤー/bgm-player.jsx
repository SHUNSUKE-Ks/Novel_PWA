import React, { useState } from 'react';
import { ChevronLeft, Menu, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

// サンプルデータ
const playlist = [
  { id: 1, title: "Everyday Pleasures", subtitle: "BrownDust2 Home Menu Theme", image: "/api/placeholder/80/80" },
  { id: 2, title: "All of a Sudden", subtitle: "Story pack Battle Theme", image: "/api/placeholder/80/80" },
  { id: 3, title: "Archenemy", subtitle: "Story pack Boss Battle Theme", image: "/api/placeholder/80/80" },
  { id: 4, title: "Destroyer", subtitle: "Fiend hunter Battle Theme", image: "/api/placeholder/80/80" },
  { id: 5, title: "Inevitable Fight 1.11", subtitle: "Story pack Battle Theme", image: "/api/placeholder/80/80", selected: true },
  { id: 6, title: "Cracked Sword", subtitle: "Story pack Battle Theme", image: "/api/placeholder/80/80" },
  { id: 7, title: "Don't step back", subtitle: "Character pack Battle Theme", image: "/api/placeholder/80/80" },
  { id: 8, title: "Like an Egret", subtitle: "Character pack Battle Theme", image: "/api/placeholder/80/80" },
  { id: 9, title: "Wanderlust", subtitle: "BrownDust2 PackCollection Menu Theme", image: "/api/placeholder/80/80" },
  { id: 10, title: "Moving day", subtitle: "BrownDust2 MyRoom Main Theme", image: "/api/placeholder/80/80" }
];

const BGMPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [currentTrack] = useState(playlist.find(track => track.selected));

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Play size={16} fill="white" />
            </div>
            <span className="text-xl font-bold">BGM</span>
            <span className="text-gray-400">43/106</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-300">選択した曲のみ表示</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showSelectedOnly}
                onChange={(e) => setShowSelectedOnly(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-blue-500 rounded-full transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </div>
          </label>
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側: アルバムアート表示エリア */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          {/* 背景のぼかしエフェクト */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
          
          {/* 3Dカードスタック効果 */}
          <div className="relative" style={{ perspective: '1000px' }}>
            {/* 後ろのカード */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg transform translate-x-8 translate-y-4 rotate-3 scale-95"></div>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg transform -translate-x-8 translate-y-4 -rotate-3 scale-95"></div>
            
            {/* メインカード */}
            <div className="relative w-96 h-96 bg-white rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 flex items-center justify-center text-gray-800">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    BROWN DUST II
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 再生コントロール */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-1">{currentTrack.title}</h2>
                <p className="text-gray-400">{currentTrack.subtitle}</p>
              </div>
              
              {/* プログレスバー */}
              <div className="mb-4">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              {/* コントロールボタン */}
              <div className="flex items-center justify-center gap-6">
                <button className="p-2 hover:bg-white/10 rounded-full transition">
                  <Shuffle size={20} className="text-gray-400" />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition">
                  <SkipBack size={24} />
                </button>
                <button 
                  className="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" />}
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition">
                  <SkipForward size={24} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition">
                  <Repeat size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右側: プレイリスト */}
        <div className="w-[480px] bg-black/20 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-2">
            {playlist.map((track) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-3 rounded-lg transition cursor-pointer ${
                  track.selected
                    ? 'bg-white/20 hover:bg-white/25'
                    : 'hover:bg-white/10'
                }`}
              >
                {/* 再生アイコン */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Play size={16} fill="white" />
                </div>

                {/* アルバムアート */}
                <div className="w-14 h-14 bg-white/10 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                  ИМАЛИСТ
                </div>

                {/* 曲情報 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{track.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{track.subtitle}</p>
                </div>

                {/* ソートアイコン */}
                <div className="flex-shrink-0">
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BGMPlayer;
