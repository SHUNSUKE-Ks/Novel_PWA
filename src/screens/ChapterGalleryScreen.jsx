import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/chapterGallery.css';

const SidePanel = ({ episodes, selectedChapter, isPanelOpen }) => {
    const { setSelectedChapter } = useGameStore();

    if (!episodes) return null;

    return (
        <div className={`side-panel ${isPanelOpen ? 'open' : 'closed'}`}>
            <div className="side-panel-content">
                <div className="side-panel-header">
                    <h3>エピソード選択</h3>
                </div>
                <div className="stepper-container">
                    {episodes.map((episode) => (
                        <div key={episode.id} className="episode-item">
                            <div className="episode-header">{episode.title}</div>
                            <div className="chapter-list">
                                {episode.chapters.map((chapter) => (
                                    <div
                                        key={chapter.id}
                                        className={`chapter-item ${selectedChapter === chapter.id ? 'active' : ''}`}
                                        onClick={() => setSelectedChapter(chapter.id)}
                                    >
                                        <span className="chapter-icon">
                                            {selectedChapter === chapter.id ? '✓' : '○'}
                                        </span>
                                        <span className="chapter-title">{chapter.title.replace(/第.章：/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EventCard = ({ event }) => {
    const { startEvent } = useGameStore();

    return (
        <div className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <button className="event-read-btn" onClick={() => startEvent(event.id, event.startStoryID)}>
                読む
            </button>
        </div>
    );
};

export const ChapterGalleryScreen = () => {
    const { episodes, selectedChapter, isPanelOpen, togglePanel, returnToTitle } = useGameStore();

    const currentChapter = episodes
        ?.flatMap(ep => ep.chapters)
        .find(ch => ch.id === selectedChapter);

    const currentEpisode = episodes?.find(ep =>
        ep.chapters.some(ch => ch.id === selectedChapter)
    );

    return (
        <div className="chapter-gallery-screen">
            <SidePanel
                episodes={episodes}
                selectedChapter={selectedChapter}
                isPanelOpen={isPanelOpen}
            />
            <button className="toggle-panel-btn" onClick={togglePanel}>
                {isPanelOpen ? '◀' : '▶'}
            </button>
            <div className="main-content-area">
                <button className="back-btn" onClick={returnToTitle}>
                    ← タイトルに戻る
                </button>
                {currentChapter && (
                    <>
                        <div className="chapter-title-section">
                            <div className="chapter-subtitle">{currentEpisode?.title}</div>
                            <h2 className="chapter-main-title">{currentChapter.title}</h2>
                        </div>
                        <div className="events-grid">
                            {currentChapter.events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
