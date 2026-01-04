import { useState, useEffect } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useTypewriter } from '../hooks/useTypewriter';
import '../styles/screens/mainGame.css';

const BackgroundLayer = ({ sceneTags }) => {
    const bgClass = sceneTags?.find(tag => tag.startsWith('bg_'))?.replace(/_/g, '-') || 'bg-black';
    return <div className={`background-layer ${bgClass}`} />;
};

const CharacterLayer = ({ tags }) => {
    const hasCharacter = tags?.some(tag => tag.startsWith('chara_'));
    if (!hasCharacter) return null;

    return (
        <div className="character-layer">
            <div className="character-sprite">🧙</div>
        </div>
    );
};

const MessageWindow = ({ speaker, text, isComplete, onClick, isVisible }) => {
    return (
        <div className={`message-window ${!isVisible ? 'hidden' : ''}`} onClick={onClick}>
            <div className="speaker-name">{speaker || 'ナレーション'}</div>
            <div className="message-text">
                {text}
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
    const { returnToChapterGallery, toggleMenu } = useGameStore();

    return (
        <div className="game-header">
            <button className="header-btn" onClick={returnToChapterGallery}>
                ← 戻る
            </button>
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
        scenario
    } = useGameStore();

    const currentNode = getCurrentNode();
    const { displayText, isComplete, skipToEnd } = useTypewriter(currentNode?.text || '', 50);

    useEffect(() => {
        if (!currentNode) return;

        // Handle SCENE_START
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
            goToResult();
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
        return <div className="main-game-screen">Loading...</div>;
    }

    const showMessage = currentNode.type !== 'SCENE_START' && (currentNode.text || currentNode.speaker);
    const showChoices = currentNode.event?.type === 'CHOICE' && isComplete;

    return (
        <div className="main-game-screen">
            <BackgroundLayer sceneTags={currentNode.sceneTags} />
            <GameHeader />
            <CharacterLayer tags={currentNode.tags} />
            <MessageWindow
                speaker={currentNode.speaker}
                text={displayText}
                isComplete={isComplete}
                onClick={handleMessageClick}
                isVisible={showMessage}
            />
            {showChoices && (
                <ChoiceContainer
                    choices={currentNode.event.payload.choices}
                    onSelect={handleChoice}
                />
            )}
            <MenuModal />
        </div>
    );
};
