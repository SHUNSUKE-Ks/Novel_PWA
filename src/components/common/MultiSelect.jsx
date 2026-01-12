import React, { useState, useRef, useEffect } from 'react';

/**
 * Notion風マルチセレクトコンポーネント
 * @param {Object} props
 * @param {Array} props.options - 選択肢 [{id, name, color}]
 * @param {Array} props.value - 選択された値のID配列
 * @param {Function} props.onChange - 選択変更時のコールバック
 * @param {String} props.placeholder - プレースホルダー
 * @param {Boolean} props.allowCreate - 新規作成を許可
 * @param {Function} props.onCreate - 新規作成時のコールバック
 */
export const MultiSelect = ({
    options = [],
    value = [],
    onChange,
    placeholder = '選択...',
    allowCreate = false,
    onCreate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    // クリック外で閉じる
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOptions = options.filter(opt => value.includes(opt.id));

    const toggleOption = (optId) => {
        if (value.includes(optId)) {
            onChange(value.filter(v => v !== optId));
        } else {
            onChange([...value, optId]);
        }
    };

    const handleCreate = () => {
        if (search.trim() && onCreate) {
            onCreate(search.trim());
            setSearch('');
        }
    };

    const getContrastColor = (hexColor) => {
        if (!hexColor) return '#fff';
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000' : '#fff';
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', minWidth: '150px' }}>
            {/* Selected Tags Display */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    padding: '6px 10px',
                    background: 'rgba(30, 30, 40, 0.9)',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    minHeight: '36px',
                    alignItems: 'center'
                }}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(opt => (
                        <span
                            key={opt.id}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                background: opt.color || '#3b82f6',
                                color: getContrastColor(opt.color),
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                            }}
                        >
                            {opt.name}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOption(opt.id);
                                }}
                                style={{ cursor: 'pointer', opacity: 0.7 }}
                            >
                                ×
                            </span>
                        </span>
                    ))
                ) : (
                    <span style={{ color: '#888' }}>{placeholder}</span>
                )}
                <span style={{ marginLeft: 'auto', color: '#888' }}>▼</span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'rgba(30, 30, 40, 0.98)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {/* Search Input */}
                    <div style={{ padding: '8px', borderBottom: '1px solid #333' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="検索..."
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(50, 50, 60, 0.8)',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Options */}
                    <div style={{ padding: '4px' }}>
                        {filteredOptions.map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => toggleOption(opt.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    background: value.includes(opt.id) ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = value.includes(opt.id) ? 'rgba(59, 130, 246, 0.2)' : 'transparent'}
                            >
                                <span style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '3px',
                                    background: opt.color || '#3b82f6'
                                }} />
                                <span style={{ color: '#fff' }}>{opt.name}</span>
                                {value.includes(opt.id) && (
                                    <span style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</span>
                                )}
                            </div>
                        ))}

                        {/* Create New Option */}
                        {allowCreate && search.trim() && !options.some(o => o.name.toLowerCase() === search.toLowerCase()) && (
                            <div
                                onClick={handleCreate}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    borderTop: '1px solid #333',
                                    marginTop: '4px',
                                    color: '#22c55e'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span>+</span>
                                <span>「{search}」を作成</span>
                            </div>
                        )}

                        {filteredOptions.length === 0 && !search && (
                            <div style={{ padding: '12px', color: '#888', textAlign: 'center' }}>
                                オプションがありません
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
