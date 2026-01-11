import React from 'react';
import { ChevronLeft, Music, Menu } from 'lucide-react';
import { useGameStore } from '../hooks/useGameStore';
import { useBGMPlayer } from '../hooks/useBGMPlayer';
import NowPlayingControl from '../components/bgm/NowPlayingControl';
import '../styles/screens/bgmPlayer.css';

import bgmListJson from '../assets/sound/bgm/BGM/00_bgmlist01.json';

// Generate playlist from JSON
const initialPlaylist = Object.entries(bgmListJson).map(([key, filename], index) => ({
    id: index + 1,
    title: key,
    subtitle: filename,
    url: new URL(`../assets/sound/bgm/BGM/${filename}`, import.meta.url).href
}));

export const BGMPlayerScreen = ({ embedded = false }) => {
    const { goBack } = useGameStore();
    const { state, actions } = useBGMPlayer(initialPlaylist);
    const { currentTrack, isPlaying, currentTime, duration, filteredPlaylist, showSelectedOnly, searchQuery, shuffleMode, repeatMode } = state;

    return (
        <div className={`bgm-player-screen ${embedded ? 'embedded' : ''}`}>
            {/* Header - Only show if not embedded */}
            {!embedded && (
                <header className="bgm-header">
                    <div className="bgm-header-left">
                        <button className="back-btn" onClick={goBack}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="bgm-title-area">
                            <div className="bgm-icon-mini">
                                <Music size={18} />
                            </div>
                            <span className="bgm-title-text">BGM</span>
                            <span className="bgm-count">{state.currentTrackIndex + 1}/{state.playlist.length}</span>
                        </div>
                    </div>

                    <div className="bgm-header-right">
                        <label className="filter-toggle">
                            <span>選択した曲のみ</span>
                            <div className="switch" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={showSelectedOnly}
                                    onChange={(e) => actions.setFilter(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </div>
                        </label>
                        <button className="menu-btn">
                            <Menu size={24} />
                        </button>
                    </div>
                </header>
            )}

            <div className="bgm-main-content">
                {/* Left side: Player display Area with Floating Controls */}
                <div className="bgm-player-area">
                    <div className="bgm-glow-effect"></div>

                    <div className="album-art-container">
                        <div className="art-back-card art-back-left"></div>
                        <div className="art-back-card art-back-right"></div>
                        <div className="main-album-art">
                            <div className="art-placeholder-text">
                                NOVEL<br />GAME
                            </div>
                        </div>

                        {/* Floating Control Panel Integrated as a overlay for the album art container area */}
                        <NowPlayingControl
                            currentTrack={currentTrack}
                            isPlaying={isPlaying}
                            currentTime={currentTime}
                            duration={duration}
                            shuffleMode={shuffleMode}
                            repeatMode={repeatMode}
                            onTogglePlay={actions.togglePlay}
                            onNext={actions.next}
                            onPrevious={actions.previous}
                            onSeek={actions.seek}
                            onToggleShuffle={actions.toggleShuffle}
                            onToggleRepeat={actions.cycleRepeat}
                        />
                    </div>
                </div>

                {/* Right side: Playlist */}
                <div className="bgm-playlist-area">
                    <div className="playlist-search">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="曲名、または説明で検索..."
                            value={searchQuery}
                            onChange={(e) => actions.setSearchQuery(e.target.value)}
                        />
                    </div>

                    {filteredPlaylist.length > 0 ? (
                        filteredPlaylist.map((track) => {
                            const originalIndex = state.playlist.findIndex(t => t.id === track.id);
                            const isActive = originalIndex === state.currentTrackIndex;

                            return (
                                <div
                                    key={track.id}
                                    className={`track-item ${isActive ? 'active' : ''}`}
                                    onClick={() => actions.selectTrack(originalIndex)}
                                >
                                    <div className="track-icon-wrapper">
                                        <Music size={18} fill={isActive && isPlaying ? "currentColor" : "none"} />
                                    </div>
                                    <div className="track-text">
                                        <h3>{track.title}</h3>
                                        <p>{track.subtitle}</p>
                                    </div>
                                    <div className="track-handle">
                                        <div className="handle-dot"></div>
                                        <div className="handle-dot"></div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-tracks">対象の曲が見つかりません</div>
                    )}
                </div>
            </div>
        </div>
    );
};
