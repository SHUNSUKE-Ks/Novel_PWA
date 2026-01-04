import React, { useState } from 'react';
import { EditorHeader } from './EditorHeader';
import { Pattern1TextArea } from './Pattern1TextArea';
import { Pattern2Table } from './Pattern2Table';
import { Pattern3Tree } from './Pattern3Tree';
import '../../styles/components/jsonEditor.css';

export default function JsonEditor({
    gameData,
    onSave,
    jsonFileName,
    isDev = true,
    isEditorOpen,
    onToggleEditor,
    onFileChange,
    children
}) {
    const [currentPattern, setCurrentPattern] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    if (!isDev) return children;

    return (
        <div className="json-editor-container">
            {!isEditorOpen ? (
                <div className="flex-1 overflow-hidden relative">
                    {children}
                </div>
            ) : (
                <>
                    <EditorHeader
                        jsonFileName={jsonFileName}
                        currentPattern={currentPattern}
                        onPatternChange={setCurrentPattern}
                        onToggleGame={onToggleEditor}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onFileChange={onFileChange}
                    />

                    <div className="pattern-content">
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
                </>
            )}
        </div>
    );
}
