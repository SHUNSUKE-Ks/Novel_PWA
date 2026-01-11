import React, { useState, useReducer } from 'react';

// ============================================
// Mock Items Data
// ============================================

const initialItems = [
  {
    id: 'item_001',
    name: '小回復ゼリー',
    icon: '🧪',
    iconType: 'emoji',
    category: 'consumable',
    dict: {
      short: '体力を30%回復する',
      detail: '体力を最大の30%分回復する。ほんのり甘い薬相性の飲むゼリー。'
    },
    owned: true,
    count: 5,
    maxCount: 99,
    tags: ['consumable', 'heal']
  },
  {
    id: 'item_002',
    name: '正常化タブレット',
    icon: '💊',
    iconType: 'emoji',
    category: 'consumable',
    dict: {
      short: '状態異常を治療',
      detail: '状態異常を治療する錠剤。即効性があり副作用も少ない。'
    },
    owned: true,
    count: 1,
    maxCount: 99,
    tags: ['consumable', 'cure']
  },
  {
    id: 'item_003',
    name: '明星',
    icon: '⚔️',
    iconType: 'emoji',
    category: 'weapon',
    dict: {
      short: '攻撃力+10',
      detail: '基本的な剣。軽量で扱いやすく、初心者にも適している。攻撃力+10'
    },
    owned: false,
    count: 0,
    maxCount: 1,
    tags: ['weapon', 'sword']
  },
  {
    id: 'item_004',
    name: '鎧',
    icon: '🛡️',
    iconType: 'emoji',
    category: 'armor',
    dict: {
      short: '防御力+8',
      detail: '基本的な防具。金属製で重いが防御力は確か。防御力+8'
    },
    owned: true,
    count: 1,
    maxCount: 1,
    tags: ['armor', 'defense']
  },
  {
    id: 'item_005',
    name: '七星剣',
    icon: '💎',
    iconType: 'emoji',
    category: 'key',
    dict: {
      short: '重要なアイテム',
      detail: '物語の鍵となる重要なアイテム。七つの星が刻まれている。'
    },
    owned: false,
    count: 0,
    maxCount: 1,
    tags: ['key', 'story']
  },
  {
    id: 'item_006',
    name: '狐火',
    icon: '🎩',
    iconType: 'emoji',
    category: 'visual',
    dict: {
      short: '見た目変更',
      detail: '見た目を変更できる装飾品。装備すると狐火のようなエフェクトが現れる。'
    },
    owned: true,
    count: 1,
    maxCount: 1,
    tags: ['visual', 'cosmetic']
  }
];

// ============================================
// State Management
// ============================================

const initialState = {
  items: initialItems,
  selectedItemId: null,
  editingItemId: null,
  activeTab: 'all'
};

function itemReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return { ...state, selectedItemId: action.payload };
    case 'START_EDIT':
      return { ...state, editingItemId: action.payload };
    case 'CANCEL_EDIT':
      return { ...state, editingItemId: null };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
        editingItemId: null
      };
    case 'ADD_ITEM':
      const newItem = {
        id: `item_${Date.now()}`,
        name: '新しいアイテム',
        icon: '📦',
        iconType: 'emoji',
        category: 'consumable',
        dict: {
          short: '説明を入力',
          detail: '詳細説明を入力してください'
        },
        owned: true,
        count: 1,
        maxCount: 99,
        tags: []
      };
      return {
        ...state,
        items: [...state.items, newItem],
        editingItemId: newItem.id
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
        editingItemId: null
      };
    case 'SWITCH_TAB':
      return { ...state, activeTab: action.payload, selectedItemId: null };
    default:
      return state;
  }
}

// ============================================
// Icon Types
// ============================================

const iconTypes = [
  { value: 'emoji', label: '絵文字' },
  { value: 'icon', label: 'アイコン' },
  { value: 'image', label: '画像' },
  { value: 'text', label: 'テキスト' }
];

const categories = [
  { value: 'all', label: 'すべて' },
  { value: 'consumable', label: 'アイテム' },
  { value: 'weapon', label: '武器' },
  { value: 'armor', label: '防具' },
  { value: 'accessory', label: 'アクセサリー' },
  { value: 'visual', label: 'ヴィジュアル' },
  { value: 'key', label: 'キーアイテム' }
];

// ============================================
// Main Component
// ============================================

export default function ItemScreen() {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  const filteredItems = state.activeTab === 'all'
    ? state.items
    : state.items.filter(item => item.category === state.activeTab);

  const selectedItem = state.items.find(item => item.id === state.selectedItemId);

  return (
    <div className="item-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Noto Sans JP', sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e8e8e8;
        }

        .item-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
          padding: 20px;
        }

        /* ============================================
           Header
        ============================================ */

        .screen-header {
          margin-bottom: 24px;
        }

        .screen-title {
          font-size: 32px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 16px;
          text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
        }

        /* ============================================
           Tab Navigation
        ============================================ */

        .tab-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 20px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 215, 0, 0.3) transparent;
        }

        .tab-button {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #b0b0b0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .tab-button:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.3);
          color: #FFD700;
        }

        .tab-button.active {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border-color: rgba(255, 215, 0, 0.5);
          color: #FFD700;
          font-weight: 700;
        }

        /* ============================================
           Content Layout
        ============================================ */

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* ============================================
           Item Column
        ============================================ */

        .item-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          background: linear-gradient(135deg, rgba(30, 30, 45, 0.6), rgba(20, 20, 35, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .item-card:hover {
          background: linear-gradient(135deg, rgba(40, 40, 60, 0.8), rgba(30, 30, 50, 0.9));
          border-color: rgba(255, 215, 0, 0.3);
          transform: translateX(4px);
        }

        .item-card.selected {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .item-card.unowned {
          opacity: 0.4;
          filter: grayscale(0.8);
        }

        .item-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .item-status {
          font-size: 14px;
        }

        .item-icon-display {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .item-card-info {
          flex: 1;
        }

        .item-card-name {
          font-size: 16px;
          font-weight: 700;
          color: #e8e8e8;
          margin-bottom: 4px;
        }

        .item-card-short {
          font-size: 13px;
          color: #999;
        }

        .item-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .item-category-badge {
          padding: 4px 8px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 4px;
          font-size: 11px;
          color: #FFD700;
        }

        .item-count {
          font-size: 13px;
          font-weight: 600;
          color: #FFD700;
        }

        /* ============================================
           Add Button
        ============================================ */

        .add-item-button {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border: 2px dashed rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #FFD700;
          font-size: 16px;
          font-weight: 600;
        }

        .add-item-button:hover {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border-color: rgba(255, 215, 0, 0.6);
          transform: scale(1.02);
        }

        /* ============================================
           Detail Panel
        ============================================ */

        .detail-panel {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(30, 30, 45, 0.95));
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          padding: 24px;
          min-height: 200px;
        }

        .empty-detail {
          text-align: center;
          padding: 60px;
          color: #666;
          font-size: 15px;
        }

        .detail-content {
          display: flex;
          gap: 24px;
        }

        .detail-icon-large {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .detail-info {
          flex: 1;
        }

        .detail-name {
          font-size: 24px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 8px;
        }

        .detail-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #999;
        }

        .detail-description {
          font-size: 15px;
          line-height: 1.7;
          color: #d0d0d0;
          margin-bottom: 16px;
        }

        .detail-stats {
          display: flex;
          gap: 20px;
          margin-top: 12px;
        }

        .detail-stat {
          font-size: 14px;
          color: #b0b0b0;
        }

        .detail-stat strong {
          color: #FFD700;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        /* ============================================
           Edit Form
        ============================================ */

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #e8e8e8;
          font-size: 14px;
          font-family: 'Noto Sans JP', sans-serif;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: rgba(255, 215, 0, 0.5);
          background: rgba(0, 0, 0, 0.5);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ============================================
           Buttons
        ============================================ */

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Noto Sans JP', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e8e8e8;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-danger {
          background: rgba(220, 53, 69, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(220, 53, 69, 0.4);
        }

        .btn-danger:hover {
          background: rgba(220, 53, 69, 0.3);
        }

        /* ============================================
           Responsive
        ============================================ */

        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .detail-content {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">📦 アイテム管理</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`tab-button ${state.activeTab === cat.value ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SWITCH_TAB', payload: cat.value })}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content Layout */}
      <div className="content-layout">
        {/* Left Column */}
        <div className="item-column">
          {filteredItems
            .filter((_, index) => index % 2 === 0)
            .map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={state.selectedItemId === item.id}
                onSelect={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
              />
            ))}
          {filteredItems.length % 2 === 0 && (
            <button
              className="add-item-button"
              onClick={() => dispatch({ type: 'ADD_ITEM' })}
            >
              <span style={{ fontSize: '24px' }}>＋</span>
              新しいアイテムを追加
            </button>
          )}
        </div>

        {/* Right Column */}
        <div className="item-column">
          {filteredItems
            .filter((_, index) => index % 2 === 1)
            .map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={state.selectedItemId === item.id}
                onSelect={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
              />
            ))}
          {filteredItems.length % 2 === 1 && (
            <button
              className="add-item-button"
              onClick={() => dispatch({ type: 'ADD_ITEM' })}
            >
              <span style={{ fontSize: '24px' }}>＋</span>
              新しいアイテムを追加
            </button>
          )}
        </div>

        {/* Detail Panel */}
        {selectedItem ? (
          state.editingItemId === selectedItem.id ? (
            <EditPanel
              item={selectedItem}
              onSave={(data) => dispatch({ type: 'UPDATE_ITEM', payload: { id: selectedItem.id, data } })}
              onCancel={() => dispatch({ type: 'CANCEL_EDIT' })}
              onDelete={() => dispatch({ type: 'DELETE_ITEM', payload: selectedItem.id })}
            />
          ) : (
            <DetailPanel
              item={selectedItem}
              onEdit={() => dispatch({ type: 'START_EDIT', payload: selectedItem.id })}
            />
          )
        ) : (
          <div className="detail-panel">
            <div className="empty-detail">
              アイテムを選択すると詳細が表示されます
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ItemCard Component
// ============================================

function ItemCard({ item, isSelected, onSelect }) {
  const categoryLabel = categories.find(c => c.value === item.category)?.label || item.category;

  return (
    <div
      className={`item-card ${!item.owned ? 'unowned' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="item-card-header">
        <div className="item-status">{item.owned ? '✓' : '🔴'}</div>
        <div className="item-icon-display">{item.icon}</div>
        <div className="item-card-info">
          <div className="item-card-name">{item.owned ? item.name : '???'}</div>
          <div className="item-card-short">{item.owned ? item.dict.short : '未取得'}</div>
        </div>
      </div>
      <div className="item-card-footer">
        <div className="item-category-badge">{categoryLabel}</div>
        {item.owned && item.maxCount > 1 && (
          <div className="item-count">×{item.count}</div>
        )}
      </div>
    </div>
  );
}

// ============================================
// DetailPanel Component
// ============================================

function DetailPanel({ item, onEdit }) {
  const categoryLabel = categories.find(c => c.value === item.category)?.label || item.category;

  return (
    <div className="detail-panel">
      <div className="detail-content">
        <div className="detail-icon-large">{item.icon}</div>
        <div className="detail-info">
          <h2 className="detail-name">{item.owned ? item.name : '???'}</h2>
          <div className="detail-meta">
            <span>カテゴリ: {categoryLabel}</span>
            <span>IconType: {item.iconType}</span>
          </div>
          <p className="detail-description">
            {item.owned ? item.dict.detail : 'このアイテムはまだ取得していません。'}
          </p>
          {item.owned && (
            <div className="detail-stats">
              {item.maxCount > 1 && (
                <div className="detail-stat">
                  所持数: <strong>{item.count} / {item.maxCount}</strong>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="detail-stat">
                  タグ: <strong>{item.tags.join(', ')}</strong>
                </div>
              )}
            </div>
          )}
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={onEdit}>
              編集
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EditPanel Component
// ============================================

function EditPanel({ item, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    name: item.name,
    icon: item.icon,
    iconType: item.iconType,
    category: item.category,
    dictShort: item.dict.short,
    dictDetail: item.dict.detail,
    owned: item.owned,
    count: item.count,
    maxCount: item.maxCount,
    tags: item.tags.join(', ')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      icon: formData.icon,
      iconType: formData.iconType,
      category: formData.category,
      dict: {
        short: formData.dictShort,
        detail: formData.dictDetail
      },
      owned: formData.owned,
      count: parseInt(formData.count),
      maxCount: parseInt(formData.maxCount),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    });
  };

  return (
    <div className="detail-panel">
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">アイテム名</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Icon</label>
            <input
              type="text"
              className="form-input"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🧪"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Icon Type</label>
            <select
              className="form-select"
              value={formData.iconType}
              onChange={(e) => setFormData({ ...formData, iconType: e.target.value })}
            >
              {iconTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">カテゴリ</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.filter(c => c.value !== 'all').map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">DICT - Short（簡易説明）</label>
          <input
            type="text"
            className="form-input"
            value={formData.dictShort}
            onChange={(e) => setFormData({ ...formData, dictShort: e.target.value })}
            placeholder="一行の簡単な説明"
          />
        </div>

        <div className="form-group">
          <label className="form-label">DICT - Detail（詳細説明）</label>
          <textarea
            className="form-textarea"
            value={formData.dictDetail}
            onChange={(e) => setFormData({ ...formData, dictDetail: e.target.value })}
            placeholder="詳細な説明を入力"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">所持数</label>
            <input
              type="number"
              className="form-input"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: e.target.value })}
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">最大所持数</label>
            <input
              type="number"
              className="form-input"
              value={formData.maxCount}
              onChange={(e) => setFormData({ ...formData, maxCount: e.target.value })}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">タグ（カンマ区切り）</label>
          <input
            type="text"
            className="form-input"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="consumable, heal, item"
          />
        </div>

        <div className="detail-actions">
          <button type="submit" className="btn btn-primary">
            保存
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
