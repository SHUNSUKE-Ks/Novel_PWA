import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { formatTime } from '../../utils/timeFormatter';

/**
 * NowPlayingControl component - displays track info and playback buttons
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
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        onSeek?.(percentage * duration);
    };

    return (
        <div className="now-playing-container">
            <div className="now-playing-glass-card">
                {/* Track Info */}
                <div className="track-meta text-center">
                    <h2 className="track-title">{currentTrack?.title || 'No Track Selected'}</h2>
                    <p className="track-subtitle">{currentTrack?.subtitle || '---'}</p>
                </div>

                {/* Progress Bar Container */}
                <div className="progress-section">
                    <div className="time-labels">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div
                        className="progress-track"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="progress-knob"></div>
                        </div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="control-buttons-row">
                    <button
                        className={`btn-icon-sm ${shuffleMode ? 'active-mode' : ''}`}
                        onClick={onToggleShuffle}
                        title="Shuffle"
                    >
                        <Shuffle size={20} />
                    </button>

                    <button className="btn-icon-md" onClick={onPrevious} title="Previous">
                        <SkipBack size={24} fill="currentColor" />
                    </button>

                    <button
                        className={`btn-play-main ${isPlaying ? 'playing' : ''}`}
                        onClick={onTogglePlay}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="play-offset" />}
                    </button>

                    <button className="btn-icon-md" onClick={onNext} title="Next">
                        <SkipForward size={24} fill="currentColor" />
                    </button>

                    <button
                        className={`btn-icon-sm relative ${repeatMode !== 'off' ? 'active-mode' : ''}`}
                        onClick={onToggleRepeat}
                        title="Repeat"
                    >
                        <Repeat size={20} />
                        {repeatMode === 'one' && <span className="repeat-one-badge">1</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NowPlayingControl;
