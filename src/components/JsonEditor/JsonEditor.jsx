import React, { useState } from 'react';
import { EditorHeader } from './EditorHeader';
import { Pattern1TextArea } from './Pattern1TextArea';
import { Pattern2Table } from './Pattern2Table';
import { Pattern3Tree } from './Pattern3Tree';
import { Code, Sparkles, Image, Cloud } from 'lucide-react';
import { useGameStore } from '../../hooks/useGameStore';
import '../../styles/components/jsonEditor.css';

export default function JsonEditor({
    gameData,
    onSave,
    jsonFileName,
    isDev = true,
    isEditorOpen,
    onToggleEditor,
    onFileChange,
    onToggleGenerator, // New prop
    children
}) {
    const [currentPattern, setCurrentPattern] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    // Access store for navigation
    const { goToGallery, goToImport, screen } = useGameStore();

    if (!isDev) return children;

    return (
        <div className="json-editor-container">
            {/* Game View (Always Rendered, Flex 1) */}
            <div className="game-view-wrapper">
                {children}

                {/* Right Edge Toggle Button (Visible when Editor is closed) */}
                {!isEditorOpen && (
                    <button
                        className="side-panel-toggle"
                        onClick={onToggleEditor}
                        title="Toggle Editor Panel"
                    >
                        ◀
                    </button>
                )}
            </div>

            {/* Editor View (Rendered when Open, Fixed Width) */}
            {isEditorOpen && (
                <div className="editor-view-wrapper">
                    {/* Global Tools Bar (Moved from Header) */}
                    <div className="global-tools-bar" style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '8px',
                        background: '#111',
                        borderBottom: '1px solid #333',
                        gap: '8px'
                    }}>
                        <button
                            className="tool-btn"
                            onClick={onToggleGenerator}
                            title="Create Assets"
                            style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer' }}
                        >
                            <Sparkles size={20} />
                        </button>
                        <button
                            className={`tool-btn ${screen === 'GALLERY' ? 'active' : ''}`}
                            onClick={goToGallery}
                            title="ギャラリー"
                            style={{ background: 'transparent', border: 'none', color: screen === 'GALLERY' ? '#60a5fa' : '#ccc', cursor: 'pointer' }}
                        >
                            <Image size={20} />
                        </button>
                        <button
                            className={`tool-btn ${screen === 'IMPORT' ? 'active' : ''}`}
                            onClick={goToImport}
                            title="インポート"
                            style={{ background: 'transparent', border: 'none', color: screen === 'IMPORT' ? '#60a5fa' : '#ccc', cursor: 'pointer' }}
                        >
                            <Cloud size={20} />
                        </button>
                        <button
                            onClick={onToggleEditor}
                            title="Close Panel"
                            style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', marginLeft: 'auto' }}
                        >
                            ❌
                        </button>
                    </div>

                    <EditorHeader
                        jsonFileName={jsonFileName}
                        currentPattern={currentPattern}
                        onPatternChange={setCurrentPattern}
                        // onToggleGame={onToggleEditor} // Removed as we have explicit close button now
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onFileChange={onFileChange}
                    />

                    <div className="pattern-content flex-1 overflow-hidden">
                        {currentPattern === 1 && (
                            <Pattern1TextArea
                                jsonData={gameData}
                                onSave={onSave}
                                searchQuery={searchQuery}
                            />
                        )}
                        {currentPattern === 2 && (
                            <Pattern2Table
                                jsonData={gameData}
                                onSave={onSave}
                                searchQuery={searchQuery}
                            />
                        )}
                        {currentPattern === 3 && (
                            <Pattern3Tree
                                jsonData={gameData}
                                onSave={onSave}
                                searchQuery={searchQuery}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
