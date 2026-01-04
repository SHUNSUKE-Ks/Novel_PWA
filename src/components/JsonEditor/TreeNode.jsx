import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';

export const TreeNode = ({
    path, nodeKey, value, onUpdate, onAdd, onDelete,
    level = 0, searchQuery, matchesSearch
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isPrimitive = !isObject && !isArray;

    const isMatchingNode = matchesSearch(nodeKey) || matchesSearch(value);

    const handleEdit = () => {
        setEditValue(String(value));
        setIsEditing(true);
    };

    const handleSave = () => {
        let parsedValue = editValue;
        if (typeof value === 'number') {
            parsedValue = parseFloat(editValue) || 0;
        } else if (typeof value === 'boolean') {
            parsedValue = editValue === 'true';
        }
        onUpdate(path, parsedValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const indent = `${level * 24}px`;
    const highlightClass = isMatchingNode && searchQuery ? 'highlight-match' : '';

    return (
        <div className="tree-node-container">
            <div
                className={`tree-node-row ${highlightClass}`}
                style={{ paddingLeft: indent }}
            >
                {(isObject || isArray) && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="tree-toggle-btn"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}

                <span className={`node-key ${matchesSearch(nodeKey) ? 'highlight-text' : ''}`}>
                    {nodeKey}:
                </span>

                {isPrimitive && (
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="flex items-center gap-xs">
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleSave}
                                    className="node-editing-input"
                                    autoFocus
                                />
                                <span className="node-meta">Ctrl+Enter</span>
                            </div>
                        ) : (
                            <span
                                className={`node-value ${matchesSearch(value) ? 'highlight-text' : ''}`}
                                onClick={handleEdit}
                            >
                                {typeof value === 'string' ? `"${value}"` : String(value)}
                            </span>
                        )}
                    </div>
                )}

                <div className="action-buttons">
                    {(isObject || isArray) && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(path); }}
                            className="node-btn node-btn-add"
                            title="追加"
                        >
                            <Plus size={14} />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(path); }}
                        className="node-btn node-btn-delete"
                        title="削除"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {isExpanded && (isObject || isArray) && (
                <div className="tree-node-children">
                    {Object.entries(value).map(([key, val]) => (
                        <TreeNode
                            key={key}
                            path={`${path}.${key}`}
                            nodeKey={key}
                            value={val}
                            onUpdate={onUpdate}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            level={level + 1}
                            searchQuery={searchQuery}
                            matchesSearch={matchesSearch}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
