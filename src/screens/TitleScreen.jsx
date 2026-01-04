import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/title.css';

export const TitleScreen = () => {
    const { goToChapterGallery, goToGallery, goToImport } = useGameStore();

    return (
        <div className="title-screen">
            <div className="title-content">
                <h1 className="game-title">理の魔法使い</h1>
                <div className="title-buttons">
                    <button className="start-button" onClick={goToChapterGallery}>
                        ストーリー
                    </button>
                </div>
            </div>
        </div>
    );
};
