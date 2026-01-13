import { useState, useEffect, useRef } from 'react';
import { NotebookPen } from 'lucide-react';
import { useGameStore } from '../../hooks/useGameStore';
import { useTypewriter } from '../../hooks/useTypewriter';
import { resolveBgUrl, resolveEnemyUrl, resolveBgmUrl } from '../../utils/assetUtils';
import TalkLogModal from '../../components/talk-log/TalkLogModal';
import '../../styles/screens/mainGame.css';

// BGM Mapping (Temporary, ideally load from 00_bgmlist01.json)
const BGM_MAP = {
    "mori01": "mori01.m4a"
};

const BackgroundLayer = ({ sceneTags, backgroundImage }) => {
    const bgClass = sceneTags?.find(tag => tag.startsWith('bg_'))?.replace(/_/g, '-') || 'bg-black';
    const bgUrl = backgroundImage ? resolveBgUrl(backgroundImage) : null;

    return (
        <div className={`background-layer ${!bgUrl ? bgClass : ''}`} style={bgUrl ? {
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        } : {}} />
    );
};

const CharacterLayer = ({ tags, characterImage }) => {
    // Priority: Explicit characterImage (Enemy/Special) > properties > tags
    const hasCharacter = tags?.some(tag => tag.startsWith('chara_')) || characterImage;
    if (!hasCharacter) return null;

    const imgUrl = characterImage ? resolveEnemyUrl(characterImage) : null;

    return (
        <div className="character-layer">
            {imgUrl ? (
                <img src={imgUrl} alt="Character" className="character-sprite-img" style={{ height: '80vh', objectFit: 'contain' }} />
            ) : (
                <div className="character-sprite">🧙</div>
            )}
        </div>
    );
};

const MessageWindow = ({ speaker, text, isComplete, onClick, isVisible }) => {
    return (
        <div className={`message-window ${!isVisible ? 'hidden' : ''}`} onClick={onClick}>
            <div className="speaker-name">{speaker || 'ナレーション'}</div>
            <div className="message-text">
                <span className="text-content">{text}</span>
                {isComplete && <span className="next-indicator">▼</span>}
            </div>
        </div>
    );
};

const ChoiceContainer = ({ choices, onSelect }) => {
    return (
        <div className="choice-container">
            {choices.map((choice, index) => (
                <button
                    key={index}
                    className="choice-button"
                    onClick={() => onSelect(choice.nextStoryID)}
                >
                    {choice.label}
                </button>
            ))}
        </div>
    );
};

const GameHeader = () => {
    const { returnToChapterGallery, toggleMenu, toggleTalkLog } = useGameStore();

    return (
        <div className="game-header">
            <div className="header-left">
                <button className="header-btn" onClick={toggleTalkLog} title="会話ログ">
                    <NotebookPen size={20} />
                </button>
                <button className="header-btn" onClick={returnToChapterGallery}>
                    ← 戻る
                </button>
            </div>
            <div className="header-right">
                <button className="header-btn" onClick={toggleMenu}>
                    メニュー
                </button>
            </div>
        </div>
    );
};

const MenuModal = () => {
    const { isMenuOpen, toggleMenu, returnToTitle } = useGameStore();

    if (!isMenuOpen) return null;

    return (
        <div className="menu-modal-overlay" onClick={toggleMenu}>
            <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>メニュー</h3>
                <button onClick={() => { toggleMenu(); returnToTitle(); }}>
                    タイトルに戻る
                </button>
                <button onClick={toggleMenu}>閉じる</button>
            </div>
        </div>
    );
};

export const MainGameScreen = () => {
    const {
        currentStoryID,
        getCurrentNode,
        goToNextNode,
        jumpToStoryID,
        setSceneTags,
        setFlags,
        goToResult,
        goToBattle,
        goToCollection,
        scenario,
        isTalkLogOpen,
        toggleTalkLog,
        talkLog
    } = useGameStore();

    const currentNode = getCurrentNode();
    const { displayText, isComplete, skipToEnd } = useTypewriter(currentNode?.text || '', 50);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!currentNode) return;

        // Handle SCENE_START (and BGM)
        if (currentNode.type === 'SCENE_START') {
            if (currentNode.sceneTags) {
                setSceneTags(currentNode.sceneTags);
            }
            // Auto-advance after delay
            const timer = setTimeout(() => {
                goToNextNode();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentNode?.storyID, setSceneTags, goToNextNode]);

    // BGM Effect
    useEffect(() => {
        if (currentNode?.bgm && audioRef.current) {
            const filename = BGM_MAP[currentNode.bgm] || currentNode.bgm;
            const bgmUrl = resolveBgmUrl(filename);
            if (bgmUrl && audioRef.current.src !== bgmUrl) {
                audioRef.current.src = bgmUrl;
                audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed):", e));
            }
        }
    }, [currentNode?.bgm]);


    const [fadeOpacity, setFadeOpacity] = useState(1); // Start black (Fade In)

    // Fade In on mount
    useEffect(() => {
        requestAnimationFrame(() => setFadeOpacity(0));
    }, []);

    const handleMessageClick = () => {
        if (!currentNode) return;

        // If showing choices, don't advance
        if (currentNode.event?.type === 'CHOICE') return;

        // If text not complete, skip to end
        if (!isComplete) {
            skipToEnd();
            return;
        }

        // Check for END event
        if (currentNode.event?.type === 'END') {
            if (currentNode.flags) {
                setFlags(currentNode.flags);
            }
            const dest = currentNode.event.payload?.goto;
            if (dest === 'COLLECTION') {
                setFadeOpacity(1);
                setTimeout(() => goToCollection(), 500);
            } else {
                goToResult();
            }
            return;
        }

        // Check for BATTLE_START event
        if (currentNode.event?.type === 'BATTLE_START') {
            setFadeOpacity(1);
            setTimeout(() => goToBattle(), 1000);
            return;
        }

        // Check for TAP_NEXT event
        if (currentNode.event?.type === 'TAP_NEXT') {
            jumpToStoryID(currentNode.event.payload.nextStoryID);
            return;
        }

        // Normal advance
        goToNextNode();
    };

    const handleChoice = (nextStoryID) => {
        jumpToStoryID(nextStoryID);
    };

    if (!currentNode) {
        return (
            <div className="main-game-screen loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const showMessage = currentNode.type !== 'SCENE_START' && (currentNode.text || currentNode.speaker);
    const showChoices = currentNode.event?.type === 'CHOICE' && isComplete;

    return (
        <div className="main-game-screen">
            {/* Fade Overlay */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'black', opacity: fadeOpacity, pointerEvents: 'none',
                transition: 'opacity 0.5s ease', zIndex: 9999
            }} />

            <BackgroundLayer sceneTags={currentNode.sceneTags} backgroundImage={currentNode.backgroundImage} />
            <GameHeader />
            <CharacterLayer tags={currentNode.tags} characterImage={currentNode.characterImage} />
            <MessageWindow
                key={`msg-${currentNode.storyID}`}
                speaker={currentNode.speaker}
                text={displayText}
                isComplete={isComplete}
                onClick={handleMessageClick}
                isVisible={showMessage}
            />
            {showChoices ? (
                <ChoiceContainer
                    key={`choice-${currentNode.storyID}`}
                    choices={currentNode.event.payload.choices}
                    onSelect={handleChoice}
                />
            ) : null}
            <MenuModal />
            <TalkLogModal
                isOpen={isTalkLogOpen}
                onClose={toggleTalkLog}
                logData={talkLog}
            />
            {/* Hidden Audio Player */}
            <audio ref={audioRef} loop />
        </div>
    );
};
