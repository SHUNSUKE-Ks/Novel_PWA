import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Battleboard01 } from './Battleboard01';
// Direct import to ensure path resolution works (bypassing glob matching issues)
import battleBgm from '../../assets/sound/bgm/BGM/君と描いたあの日から…_hatsushiba_kenji_202507100655.mp3';

export const BattleScreen = () => {
    const audioRef = useRef(null);
    const { returnFromBattle } = useGameStore();
    const [fadeOpacity, setFadeOpacity] = useState(1); // Start full black

    useEffect(() => {
        // Fade In on mount
        requestAnimationFrame(() => {
            setFadeOpacity(0);
        });

        if (battleBgm && audioRef.current) {
            // Avoid reloading if already set (React Strict Mode safety)
            // Use getAttribute to compare raw string vs imported string
            if (audioRef.current.getAttribute('src') !== battleBgm) {
                audioRef.current.src = battleBgm;
                audioRef.current.volume = 0.5;
                audioRef.current.play().catch(e => {
                    // Ignore AbortError occurring from rapid processing/Hot Reload/Strict Mode
                    if (e.name !== 'AbortError') {
                        console.error("Battle BGM Playback Failed:", e);
                    }
                });
            } else {
                // If src matches but paused (e.g. strict mode remount), try playing
                if (audioRef.current.paused) {
                    audioRef.current.play().catch(e => {
                        if (e.name !== 'AbortError') console.error("Battle BGM Playback Failed:", e);
                    });
                }
            }
        }

        return () => {
            // Cleanup on unmount
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handleBattleEnd = () => {
        // Fade Out before exit
        setFadeOpacity(1);
        setTimeout(() => {
            returnFromBattle(2039);
        }, 1000); // Wait for fade
    };

    return (
        <div className="battle-screen" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <Battleboard01 onBattleEnd={handleBattleEnd} />
            <audio ref={audioRef} loop />

            {/* Fade Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'black',
                opacity: fadeOpacity,
                transition: 'opacity 1s ease-in-out',
                pointerEvents: fadeOpacity > 0 ? 'auto' : 'none',
                zIndex: 9999
            }} />
        </div>
    );
};
