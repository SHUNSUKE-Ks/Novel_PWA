import React from 'react';
import { getCharacterIconUrl } from '../../utils/characterRegistry';

const TalkLogItem = ({ data }) => {
    const { characterName, text } = data;

    // Use placeholder if character icon is not found
    const charIcon = getCharacterIconUrl(characterName) || "https://placehold.co/60x60";

    return (
        <div className="talk-log-item">
            <div className="talk-log-avatar-container">
                <img
                    src={charIcon}
                    alt={characterName}
                    className="talk-log-avatar"
                />
            </div>

            <div className="talk-log-content">
                <span className="talk-log-char-name">
                    {characterName}
                </span>
                <div className="talk-log-bubble">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default TalkLogItem;
