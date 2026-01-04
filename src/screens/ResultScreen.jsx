import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/result.css';

export const ResultScreen = () => {
    const { flags, returnToChapterGallery } = useGameStore();
    const isTrustedEnding = flags.trusted_reason;

    return (
        <div className="result-screen">
            <div className="result-content">
                <h2 className="result-title">
                    {isTrustedEnding ? '真理への道' : 'エンディング'}
                </h2>
                <p className="result-message">
                    {isTrustedEnding
                        ? '理の魔法使いは、論理の力で謎を解いた。'
                        : '物語は終わりを迎えた。'}
                </p>
                <button className="return-button" onClick={returnToChapterGallery}>
                    チャプター選択に戻る
                </button>
            </div>
        </div>
    );
};
