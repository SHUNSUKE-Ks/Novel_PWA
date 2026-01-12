import React, { useState } from 'react';

const TAG_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#78716c', '#64748b', '#6b7280'
];

/**
 * タグ管理モーダル
 * @param {Object} props
 * @param {Boolean} props.isOpen - モーダル表示状態
 * @param {Function} props.onClose - 閉じるコールバック
 * @param {Array} props.categories - カテゴリリスト
 * @param {Function} props.onSave - 保存コールバック (newTag) => void
 * @param {Object} props.editTag - 編集するタグ (null で新規作成)
 */
export const TagManager = ({
    isOpen,
    onClose,
    categories = [],
    onSave,
    editTag = null
}) => {
    const [name, setName] = useState(editTag?.name || '');
    const [category, setCategory] = useState(editTag?.category || '');
    const [color, setColor] = useState(editTag?.color || '#3b82f6');
    const [description, setDescription] = useState(editTag?.description || '');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;

        const newTag = {
            id: editTag?.id || name.toUpperCase().replace(/\s+/g, '_'),
            name: name.trim(),
            category,
            color,
            description
        };

        onSave(newTag);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(30, 30, 40, 0.98)',
                borderRadius: '12px',
                padding: '1.5rem',
                width: '400px',
                maxWidth: '90vw',
                border: '1px solid #444'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 1rem', color: '#fff' }}>
                    {editTag ? 'タグを編集' : '新規タグ作成'}
                </h3>

                {/* Name */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                        タグ名 *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="タグ名を入力..."
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(50, 50, 60, 0.8)',
                            border: '1px solid #555',
                            borderRadius: '6px',
                            color: '#fff',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Category */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                        カテゴリ
                    </label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(50, 50, 60, 0.8)',
                            border: '1px solid #555',
                            borderRadius: '6px',
                            color: '#fff',
                            outline: 'none'
                        }}
                    >
                        <option value="">カテゴリを選択...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                        カラー
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {TAG_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    background: c,
                                    border: color === c ? '3px solid #fff' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                        説明
                    </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="タグの説明..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(50, 50, 60, 0.8)',
                            border: '1px solid #555',
                            borderRadius: '6px',
                            color: '#fff',
                            outline: 'none',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Preview */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>プレビュー:</span>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: color,
                            color: parseInt(color.slice(1), 16) > 0x7fffff ? '#000' : '#fff',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                        }}>
                            {name || 'タグ名'}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'transparent',
                            color: '#888',
                            border: '1px solid #555',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: name.trim() ? '#22c55e' : '#555',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: name.trim() ? 'pointer' : 'not-allowed'
                        }}
                    >
                        {editTag ? '更新' : '作成'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagManager;
