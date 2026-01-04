import React from 'react';
import { Eye, Search } from 'lucide-react';

export const EditorHeader = ({
    jsonFileName,
    currentPattern,
    onPatternChange,
    onToggleGame,
    searchQuery,
    onSearchChange,
    onFileChange
}) => {
    return (
        <header className="editor-view-header">
            <select
                value={jsonFileName}
                onChange={(e) => onFileChange(e.target.value)}
                className="pattern-select editor-title"
                style={{ border: 'none', background: 'transparent' }}
            >
                <option value="episodes.json">episodes.json</option>
                <option value="scenario.json">scenario.json</option>
                <option value="gallery.json">gallery.json</option>
            </select>

            <div className="editor-search-container">
                <div className="editor-search-icon">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="JSON内を検索..."
                    className="editor-search-input"
                />
            </div>

            <div className="editor-controls">
                <select
                    value={currentPattern}
                    onChange={(e) => onPatternChange(Number(e.target.value))}
                    className="pattern-select"
                >
                    <option value={1}>パターン1: テキストエリア</option>
                    <option value={2}>パターン2: テーブル</option>
                    <option value={3}>パターン3: ツリー</option>
                </select>

                <button
                    onClick={onToggleGame}
                    className="game-preview-toggle"
                    title="ゲーム表示"
                >
                    <Eye size={20} />
                </button>
            </div>
        </header>
    );
};
