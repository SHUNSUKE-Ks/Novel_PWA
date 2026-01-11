import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/title.css';

export const TitleScreen = () => {
    const { goToChapterGallery, goToCollection } = useGameStore();

    return (
        <div className="title-screen">
            <div className="title-content">
                <h1 className="game-title">理の魔法使い</h1>
                <div className="title-buttons">
                    <button className="start-button" onClick={goToChapterGallery}>
                        ストーリー
                    </button>
                    <button className="start-button secondary-btn" onClick={goToCollection}>
                        コレクション
                    </button>
                </div>
            </div>
        </div>
    );
};
