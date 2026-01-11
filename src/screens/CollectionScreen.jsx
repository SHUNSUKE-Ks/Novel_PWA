import React, { useState, useEffect } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/collection.css';
import { getCharacterIconUrl, getCharacterVariants } from '../utils/characterRegistry';
import characterDataJson from '../assets/data/characters.json';
import backgroundsDataJson from '../assets/data/backgrounds.json';
import enemyDataJson from '../assets/data/enemies.json';
import tagsDataJson from '../assets/data/tags.json';
import itemsDataJson from '../assets/data/items.json';
import { BGMPlayerScreen } from './BGMPlayerScreen';
import { TableView } from '../components/Collection/DB_system';

// Use glob import to eagerly resolve all character assets
const characterAssets = import.meta.glob('../assets/chara/**/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

// Use glob for background assets as well
const backgroundAssets = import.meta.glob('../assets/bg/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

const resolveAssetUrl = (path) => {
    if (!path) return "https://placehold.co/300x400/2a2a2a/FFF?text=No+Image";
    if (path.startsWith('http')) return path;

    // Construct the lookup key. 
    // import.meta.glob keys are relative to the current file (CollectionScreen.jsx)
    const key = `../assets/chara/${path}`;
    const asset = characterAssets[key];

    if (!asset) {
        console.warn(`Asset not found: ${key}`);
        return "https://placehold.co/300x400/2a2a2a/FFF?text=Asset+Not+Found";
    }

    return asset;
};

const resolveBgUrl = (path) => {
    if (!path) return "https://placehold.co/600x400/2a2a2a/FFF?text=No+BG";
    if (path.startsWith('http')) return path;

    const key = `../assets/${path}`; // path includes 'bg/' prefix
    const asset = backgroundAssets[key];

    if (!asset) {
        // Try without folder prefix if failed
        const key2 = `../assets/bg/${path}`;
        const asset2 = backgroundAssets[key2];
        if (asset2) return asset2;

        console.warn(`BG Asset not found: ${key}`);
        return "https://placehold.co/600x400/2a2a2a/FFF?text=BG+Not+Found";
    }
    return asset;
};

export const CollectionScreen = () => {
    const { goBack } = useGameStore();
    const [activeCategory, setActiveCategory] = useState('library');
    const [activeSubCategory, setActiveSubCategory] = useState('character');
    const [selectedCharacterId, setSelectedCharacterId] = useState(characterDataJson.characters[0]?.id);

    // Backgrounds Data
    const backgroundsData = backgroundsDataJson.backgrounds;

    // View States for Backgrounds
    const [bgView, setBgView] = useState('All');
    const [bgLayout, setBgLayout] = useState('gallery'); // Default to gallery, but allow toggle
    const bgViews = ['All', ...backgroundsDataJson.categories?.map(c => c.id)];

    const getFilteredBackgrounds = () => {
        if (bgView === 'All') return backgroundsData;
        return backgroundsData.filter(bg => bg.category === bgView);
    };

    // Columns for Background List View
    const backgroundColumns = [
        {
            key: 'id',
            label: 'ID',
            width: '120px',
            render: (id) => renderCopyCell(id)
        },
        {
            key: 'name',
            label: 'Name',
            width: '200px',
            render: (name) => renderCopyCell(name)
        },
        {
            key: 'category',
            label: 'Category',
            width: '120px',
            render: (catId) => {
                const cat = backgroundsDataJson.categories?.find(c => c.id === catId);
                return <span className="table-tag" style={{ backgroundColor: '#555' }}>{cat ? cat.label : catId}</span>;
            }
        },
        {
            key: 'tags',
            label: 'Tags',
            render: (tags) => (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {tags.map(tag => (
                        <span key={tag} className="table-tag" style={{ fontSize: '0.8em', padding: '1px 4px' }}>{tag}</span>
                    ))}
                </div>
            )
        },
    ];


    useEffect(() => {
        if (activeCategory === 'library') {
            setActiveSubCategory('character');
        } else if (activeCategory === 'sound') {
            setActiveSubCategory('bgm');
        }
    }, [activeCategory]);

    // Categories definition
    const categories = [
        { id: 'item', label: 'アイテム', implemented: false },
        { id: 'equipment', label: '装備', implemented: false },
        { id: 'skill', label: 'スキル', implemented: false },
        { id: 'ability', label: 'アビリティ', implemented: false },
        { id: 'story', label: 'ストーリー', implemented: false },
        { id: 'library', label: 'ライブラリー', implemented: true }, // Database moved here
        { id: 'sound', label: 'Sound', implemented: true },
        { id: 'keymap', label: 'KeyMap', implemented: false },
    ];

    // Sub-categories for Library
    const librarySubCategories = [
        { id: 'background', label: '背景図鑑', implemented: true },
        { id: 'character', label: 'キャラクター図鑑', implemented: true },
        { id: 'enemy', label: 'エネミー図鑑', implemented: true },
        { id: 'item_dict', label: 'アイテム図鑑', implemented: true },
        { id: 'tips', label: 'TipsDB', implemented: true },
    ];

    // Sub-categories for Sound
    const soundSubCategories = [
        { id: 'bgm', label: 'BGM', implemented: true },
        { id: 'se', label: 'SE', implemented: false },
        { id: 'voice', label: 'Voice', implemented: false },
    ];

    const characterData = characterDataJson.characters;
    const selectedCharacter = characterData.find(c => c.id === selectedCharacterId);

    // Data Loading
    const enemyData = enemyDataJson.enemies;
    const tagsData = tagsDataJson.tags;
    const itemsData = itemsDataJson.items;

    // View States for Items
    const [itemView, setItemView] = useState('All');
    const itemViews = ['All', ...itemsDataJson.categories?.map(c => c.id)];

    const getFilteredItems = () => {
        if (itemView === 'All') return itemsData;
        return itemsData.filter(item => item.category === itemView);
    };

    // View States
    const [tipsView, setTipsView] = useState('All');
    const tagsViews = ['All', 'Affiliation', 'Class', 'Type', 'Appearance'];

    // Filter Data based on View
    const getFilteredTags = () => {
        if (tipsView === 'All') return tagsData;
        return tagsData.filter(tag => tag.category === tipsView);
    };

    const getSubCategories = () => {
        if (activeCategory === 'library') return librarySubCategories;
        if (activeCategory === 'sound') return soundSubCategories;
        return [];
    };

    // Column Definitions for Table Views
    // Column Definitions for Table Views
    const renderCopyCell = (text) => (
        <div className="cell-with-copy">
            <span style={{ marginRight: '8px' }}>{text}</span>
            <button
                className="copy-btn-inline"
                title="Copy"
                onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(text);
                }}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
        </div>
    );

    const enemyColumns = [
        {
            key: 'id',
            label: 'ID',
            width: '120px',
            render: (id) => renderCopyCell(id)
        },
        {
            key: 'name',
            label: 'Name',
            width: '200px',
            render: (name) => renderCopyCell(name)
        },
        { key: 'label', label: 'Monster Label', width: '150px' },
        {
            key: 'tags',
            label: 'Tags',
            render: (tags) => (
                <div>
                    {tags.map(tag => (
                        <span key={tag} className="table-tag">{tag}</span>
                    ))}
                </div>
            )
        },
        {
            key: 'stats',
            label: 'Stats',
            width: '200px',
            render: (stats) => `HP:${stats.hp} ATK:${stats.atk}`
        }
    ];

    const tagsColumns = [
        {
            key: 'id',
            label: 'ID',
            width: '150px',
            render: (id) => renderCopyCell(id)
        },
        {
            key: 'name',
            label: 'Name',
            width: '200px',
            render: (name) => renderCopyCell(name)
        },
        {
            key: 'category',
            label: 'Category',
            width: '150px',
            render: (cat) => <span className="table-tag" style={{ backgroundColor: '#555' }}>{cat}</span>
        },
        { key: 'description', label: 'Description' }
    ];

    const itemColumns = [
        {
            key: 'id',
            label: 'ID',
            width: '150px',
            render: (id) => renderCopyCell(id)
        },
        {
            key: 'name',
            label: '名前',
            width: '150px',
            render: (name) => renderCopyCell(name)
        },
        {
            key: 'category',
            label: 'カテゴリ',
            width: '100px',
            render: (catId) => {
                const cat = itemsDataJson.categories?.find(c => c.id === catId);
                return <span className="table-tag" style={{ backgroundColor: '#555' }}>{cat ? cat.label : catId}</span>;
            }
        },
        {
            key: 'rarity',
            label: 'レア度',
            width: '80px',
            render: (rarity) => '★'.repeat(rarity)
        },
        {
            key: 'price',
            label: '価格',
            width: '80px',
            render: (price) => price > 0 ? `${price}G` : '-'
        },
        {
            key: 'effect',
            label: '効果',
            width: '150px',
            render: (effect) => effect || '-'
        },
        { key: 'description', label: '説明' }
    ];

    // Gallery Card Renderer
    const renderBackgroundCard = (bg) => (
        <div className="bg-gallery-card" style={{
            background: 'rgba(30, 30, 40, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div className="bg-image-container" style={{
                width: '100%',
                aspectRatio: '16/9',
                overflow: 'hidden',
                background: '#000'
            }}>
                <img
                    src={resolveBgUrl(bg.image)}
                    alt={bg.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                    }}
                />
            </div>
            <div className="bg-card-footer" style={{ padding: '0.8rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{bg.name}</h4>
                    <span className="table-tag" style={{ fontSize: '0.7rem' }}>
                        {backgroundsDataJson.categories?.find(c => c.id === bg.category)?.label || bg.category}
                    </span>
                </div>
                {/* <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{bg.description}</p> */}
            </div>
        </div>
    );

    return (
        <div className="collection-screen">
            {/* Top Navigation: Categories */}
            <header className="collection-header">
                <button className="back-btn" onClick={goBack}>← 閉じる</button>
                <nav className="category-nav">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`nav-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                            disabled={!cat.implemented}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* Sub Navigation: Contextual based on Category */}
            <div className="sub-nav-container">
                <nav className="sub-nav">
                    {getSubCategories().map(sub => (
                        <button
                            key={sub.id}
                            className={`sub-nav-btn ${activeSubCategory === sub.id ? 'active' : ''}`}
                            onClick={() => setActiveSubCategory(sub.id)}
                            disabled={!sub.implemented}
                        >
                            {sub.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="collection-content">
                {activeCategory === 'library' && activeSubCategory === 'character' ? (
                    <div className="character-encyclopedia">
                        {/* Character List Sidebar */}
                        <div className="character-list">
                            <h3>キャラクター一覧</h3>
                            <ul>
                                {characterData.map(char => (
                                    <li
                                        key={char.id}
                                        className={selectedCharacterId === char.id ? 'active' : ''}
                                        onClick={() => setSelectedCharacterId(char.id)}
                                    >
                                        {char.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Character Detail View */}
                        <div className="character-detail">
                            {selectedCharacter ? (
                                <div className="detail-grid">
                                    <div className="card-section">
                                        <h4>キャラクターカード</h4>
                                        <div className="char-card">
                                            <img src={resolveAssetUrl(selectedCharacter.image)} alt={selectedCharacter.name} />
                                            <div className="char-info">
                                                <h2>{selectedCharacter.name}</h2>
                                                <div className="tags">
                                                    {selectedCharacter.tags?.map(tag => (
                                                        <span key={tag} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                                <p>{selectedCharacter.dict}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="assets-section">
                                        <div className="icons-section">
                                            <h4>表情アイコン (60x60)</h4>
                                            <div className="icon-grid">
                                                {getCharacterVariants(selectedCharacter.name).map(variant => (
                                                    <div key={variant} className="icon-item">
                                                        <img src={getCharacterIconUrl(selectedCharacter.name, variant)} alt={variant} />
                                                        <span>{variant}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="standing-section">
                                            <h4>立ち絵ギャラリー</h4>
                                            <div className="standing-gallery">
                                                {selectedCharacter.standing?.map((url, idx) => (
                                                    <img key={idx} src={resolveAssetUrl(url)} alt="Standing" className="standing-img" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cg-section">
                                        <h4>CGギャラリー (1920x1080)</h4>
                                        <div className="cg-gallery">
                                            {selectedCharacter.cgs?.length > 0 ? (
                                                selectedCharacter.cgs.map((url, idx) => (
                                                    <img key={idx} src={resolveAssetUrl(url)} alt="CG" className="cg-img" />
                                                ))
                                            ) : (
                                                <div className="no-cg">CGがありません</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-selection">キャラクターを選択してください</div>
                            )}
                        </div>
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'background' ? (
                    <div className="generic-table-view-wrapper" style={{ width: '90%', margin: '0 auto', height: '100%', padding: '20px 0' }}>
                        <TableView
                            title="Background Gallery"
                            data={getFilteredBackgrounds()}
                            columns={backgroundColumns}
                            views={bgViews}
                            activeView={bgView}
                            onViewChange={setBgView}
                            layout={bgLayout}
                            onLayoutChange={setBgLayout}
                            renderGalleryItem={renderBackgroundCard}
                        />
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'enemy' ? (
                    <div className="generic-table-view-wrapper" style={{ width: '90%', margin: '0 auto', height: '100%', padding: '20px 0' }}>
                        <TableView
                            title="Enemy Encyclopedia"
                            data={enemyData}
                            columns={enemyColumns}
                        />
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'item_dict' ? (
                    <div className="generic-table-view-wrapper" style={{ width: '90%', margin: '0 auto', height: '100%', padding: '20px 0' }}>
                        <TableView
                            title="アイテム図鑑"
                            data={getFilteredItems()}
                            columns={itemColumns}
                            views={itemViews}
                            activeView={itemView}
                            onViewChange={setItemView}
                        />
                    </div>
                ) : activeCategory === 'sound' && activeSubCategory === 'bgm' ? (
                    <div className="bgm-player-embedded-container" style={{ width: '100%', height: '100%' }}>
                        <BGMPlayerScreen embedded={true} />
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'tips' ? (
                    <div className="generic-table-view-wrapper" style={{ width: '90%', margin: '0 auto', height: '100%', padding: '20px 0' }}>
                        <TableView
                            title="Tips Database"
                            data={getFilteredTags()}
                            columns={tagsColumns}
                            views={tagsViews}
                            activeView={tipsView}
                            onViewChange={setTipsView}
                        />
                    </div>
                ) : (
                    <div className="placeholder-content">
                        <h2>{categories.find(c => c.id === activeCategory)?.label}</h2>
                        <p>このカテゴリは現在準備中です</p>
                    </div>
                )}
            </div>
        </div>
    );
};
