import { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { QuestMenu } from './QuestMenu';
import '../../styles/screens/title.css';

export const TitleScreen = () => {
    const { goToChapterGallery, goToCollection } = useGameStore();
    const [isQuestOpen, setIsQuestOpen] = useState(false);

    return (
        <div className="title-screen">
            <div className="title-content">
                <h1 className="game-title">理の魔法使い</h1>
                <div className="title-buttons">
                    <button className="start-button" onClick={goToChapterGallery}>
                        ストーリー
                    </button>
                    <button className="start-button secondary-btn" onClick={() => setIsQuestOpen(true)}>
                        クエスト
                    </button>
                    <button className="start-button secondary-btn" onClick={goToCollection}>
                        コレクション
                    </button>
                </div>
            </div>
            {isQuestOpen && <QuestMenu onClose={() => setIsQuestOpen(false)} />}
        </div>
    );
};
