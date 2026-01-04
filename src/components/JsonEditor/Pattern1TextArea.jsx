import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export const Pattern1TextArea = ({ jsonData, onSave, searchQuery }) => {
    const [editedText, setEditedText] = useState(JSON.stringify(jsonData, null, 2));
    const [error, setError] = useState('');

    useEffect(() => {
        setEditedText(JSON.stringify(jsonData, null, 2));
    }, [jsonData]);

    const handleSave = () => {
        try {
            const parsed = JSON.parse(editedText);
            setError('');
            onSave(parsed);
            alert('保存しました！');
        } catch (e) {
            setError(`JSON解析エラー: ${e.message}`);
        }
    };

    return (
        <div className="textarea-editor">
            <div className="textarea-header">
                <div className="flex items-center gap-sm">
                    <h3 className="editor-title">テキストエリアエディター</h3>
                    {searchQuery && (
                        <span className="node-meta">検索中: "{searchQuery}"</span>
                    )}
                </div>
                <button onClick={handleSave} className="save-btn">
                    <Save size={16} /> 保存
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="json-textarea"
                spellCheck="false"
            />

            <div className="mt-sm node-meta">
                <p>✓ 自由に編集可能</p>
                <p>✓ キーと値の両方を変更できる</p>
                <p>✗ 構文エラーのリスクあり</p>
            </div>
        </div>
    );
};
