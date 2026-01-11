import React, { useState, useEffect } from 'react';
import { NotebookPen, X } from 'lucide-react';
import TalkLogItem from './TalkLogItem';
import '../../styles/components/talkLog.css';

const TalkLogModal = ({ isOpen, onClose, logData }) => {
    const [showJson, setShowJson] = useState(false);

    // Prevent background scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleJson = () => setShowJson(!showJson);

    return (
        <div className="talk-log-overlay" onClick={onClose}>
            <div className="talk-log-modal" onClick={(e) => e.stopPropagation()}>
                <div className="talk-log-header">
                    <div className="header-left">
                        <button
                            className={`header-btn note-btn ${showJson ? 'active' : ''}`}
                            onClick={toggleJson}
                            title="Toggle JSON View"
                        >
                            <NotebookPen size={24} />
                        </button>
                    </div>

                    <h2 className="talk-log-title">会話ログ</h2>

                    <div className="header-right">
                        <button className="header-btn close-btn" onClick={onClose}>
                            <X size={32} />
                        </button>
                    </div>
                </div>

                <div className="talk-log-body">
                    {showJson ? (
                        <div className="talk-log-json-view">
                            <pre>{JSON.stringify(logData, null, 2)}</pre>
                        </div>
                    ) : (
                        <div className="talk-log-list">
                            {logData && logData.length > 0 ? (
                                logData.map((log, index) => (
                                    <TalkLogItem key={log.id || index} data={log} />
                                ))
                            ) : (
                                <div className="talk-log-empty">
                                    会話ログはありません。
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalkLogModal;
