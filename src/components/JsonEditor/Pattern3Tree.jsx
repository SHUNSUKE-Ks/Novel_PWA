import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { TreeNode } from './TreeNode';
import { getTemplateForPath } from './templates';

export const Pattern3Tree = ({ jsonData, onSave, searchQuery }) => {
    const [editedData, setEditedData] = useState(JSON.parse(JSON.stringify(jsonData)));

    useEffect(() => {
        setEditedData(JSON.parse(JSON.stringify(jsonData)));
    }, [jsonData]);

    const updateValue = (path, newValue) => {
        const keys = path.split('.').filter(k => k);
        const newData = JSON.parse(JSON.stringify(editedData));
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = newValue;
        setEditedData(newData);
    };

    const addChild = (path) => {
        const keys = path.split('.').filter(k => k);
        const newData = JSON.parse(JSON.stringify(editedData));
        const template = getTemplateForPath(path);

        let current = newData;
        if (keys.length === 0) {
            // Root level (not usually handled by addChild on nodes, but for completeness)
            return;
        }

        for (let i = 0; i < keys.length; i++) {
            current = current[keys[i]];
        }

        if (Array.isArray(current)) {
            current.push(JSON.parse(JSON.stringify(template)));
        } else if (typeof current === 'object') {
            const newKey = prompt('新しいキーを入力してください:', 'newKey');
            if (newKey) {
                current[newKey] = "";
            }
        }
        setEditedData(newData);
    };

    const deleteNode = (path) => {
        if (!confirm('本当に削除しますか？')) return;

        const keys = path.split('.').filter(k => k);
        const newData = JSON.parse(JSON.stringify(editedData));

        if (keys.length === 1) {
            delete newData[keys[0]];
        } else {
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            const lastKey = keys[keys.length - 1];
            if (Array.isArray(current)) {
                current.splice(Number(lastKey), 1);
            } else {
                delete current[lastKey];
            }
        }
        setEditedData(newData);
    };

    const matchesSearch = (text) => {
        if (!searchQuery) return false;
        return String(text).toLowerCase().includes(searchQuery.toLowerCase());
    };

    return (
        <div className="tree-editor">
            <div className="textarea-header">
                <div className="flex items-center gap-sm">
                    <h3 className="editor-title">ツリー構造エディター</h3>
                    {searchQuery && (
                        <span className="node-meta">検索中: "{searchQuery}"</span>
                    )}
                </div>
                <button onClick={() => onSave(editedData)} className="save-btn">
                    <Save size={16} /> 保存
                </button>
            </div>

            <div className="tree-view-area">
                {Object.entries(editedData).map(([key, value]) => (
                    <TreeNode
                        key={key}
                        path={key}
                        nodeKey={key}
                        value={value}
                        onUpdate={updateValue}
                        onAdd={addChild}
                        onDelete={deleteNode}
                        level={0}
                        searchQuery={searchQuery}
                        matchesSearch={matchesSearch}
                    />
                ))}
            </div>

            <div className="mt-sm node-meta">
                <p>✓ 階層構造を視覚的に表示 / + で要素追加 / ゴミ箱で削除</p>
                <p>✓ 値を直接クリックして名前や文章を編集</p>
                <p>✓ Ctrl+Enter で確定、Esc でキャンセル</p>
            </div>
        </div>
    );
};
