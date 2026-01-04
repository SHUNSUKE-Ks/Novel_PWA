import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/result.css';

export const ResultScreen = () => {
    const { flags, returnToChapterGallery, episodes, currentEventID, startEvent } = useGameStore();
    const isTrustedEnding = flags.trusted_reason;

    // Find all events in order to determine the next one
    const allEvents = episodes?.flatMap(ep =>
        ep.chapters.flatMap(ch => ch.events)
    ) || [];

    const currentIndex = allEvents.findIndex(ev => ev.id === currentEventID);
    const nextEvent = currentIndex >= 0 && currentIndex < allEvents.length - 1
        ? allEvents[currentIndex + 1]
        : null;

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

                <div className="result-actions">
                    {nextEvent && (
                        <button
                            className="next-event-button"
                            onClick={() => startEvent(nextEvent.id, nextEvent.startStoryID)}
                        >
                            次のイベントへ: {nextEvent.title}
                        </button>
                    )}
                    <button className="return-button" onClick={returnToChapterGallery}>
                        チャプター選択に戻る
                    </button>
                </div>
            </div>
        </div>
    );
};
