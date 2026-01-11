# 会話ログ (Talk Log) 実装コード参考資料

この資料は、会話ログ機能の中核となる実装コードをまとめたものです。

## 1. モーダル本体 (Modal)
`src/componemts_ver2.2/TalkLogModal.jsx`

```jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import TalkLogItem from './TalkLogItem';
import './TalkLog.css';

const TalkLogModal = ({ isOpen, onClose, logData, questTitle }) => {
    // 背景のスクロール防止
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="talk-log-overlay">
            <div className="talk-log-header">
                <h2 className="talk-log-title">会話ログ</h2>
                <button className="talk-log-close-btn" onClick={onClose}>
                    <X size={32} />
                </button>
            </div>

            <div className="talk-log-subtitle-container">
                <div className="talk-log-subtitle">
                    メイン <span>{questTitle || "ダレフ病院の医者に会う"}</span>
                </div>
            </div>

            <div className="talk-log-list">
                {logData && logData.length > 0 ? (
                    logData.map((log, index) => (
                        <TalkLogItem key={log.id || index} data={log} />
                    ))
                ) : (
                    <div className="text-center text-gray-400 mt-10">
                        会話ログはありません。
                    </div>
                )}
            </div>
        </div>
    );
};

export default TalkLogModal;
```

## 2. ログアイテム (Item)
`src/componemts_ver2.2/TalkLogItem.jsx`

```jsx
import React from 'react';
import { Volume2 } from 'lucide-react';
import { getCharacterIconUrl } from '../utils/characterRegistry';
import './TalkLog.css';

const TalkLogItem = ({ data, onNameClick, onIconClick, onTextClick }) => {
    const { characterName, characterImage, text, voiceUrl, variant } = data;

    // 画像の解決: Registry等からパスを取得
    const resolvedImage = characterImage || getCharacterIconUrl(characterName, variant);

    const handlePlayVoice = () => {
        if (voiceUrl) {
            console.log(`Playing voice for ${characterName}: ${voiceUrl}`);
        }
    };

    return (
        <div className="talk-log-item">
            <img
                src={resolvedImage || "https://placehold.co/60x60"}
                alt={characterName}
                className={`talk-log-avatar ${onIconClick ? 'cursor-pointer' : ''}`}
                onClick={() => onIconClick && onIconClick(data)}
            />

            <div className="talk-log-content">
                <span
                    className={`talk-log-char-name ${onNameClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onNameClick && onNameClick(data)}
                >
                    {characterName}
                </span>
                <div
                    className={`talk-log-bubble ${onTextClick ? 'cursor-text' : ''}`}
                    onClick={() => onTextClick && onTextClick(data)}
                >
                    {text}
                </div>
            </div>

            <button className="talk-log-voice-btn" onClick={handlePlayVoice}>
                <Volume2 size={18} />
            </button>
        </div>
    );
};

export default TalkLogItem;
```

## 3. スタイル (CSS)
`src/componemts_ver2.2/TalkLog.css`

```css
.talk-log-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    color: #fff;
}

.talk-log-header {
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.talk-log-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.talk-log-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

.talk-log-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background-color: #333;
}

.talk-log-char-name {
    font-size: 0.85rem;
    color: #dca54c;
    font-weight: bold;
}

.talk-log-bubble {
    background-color: #fff;
    color: #1f2937;
    padding: 1rem;
    border-radius: 12px;
    position: relative;
    font-size: 0.95rem;
    line-height: 1.5;
}

.talk-log-bubble::before {
    content: '';
    position: absolute;
    left: -8px; top: 15px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #fff;
}

.talk-log-voice-btn {
    background: #e5e7eb;
    border: none;
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4b5563;
    transition: all 0.2s;
}
```
