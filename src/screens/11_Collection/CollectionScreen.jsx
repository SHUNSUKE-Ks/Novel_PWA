import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useGameStore } from '../../hooks/useGameStore';
import '../../styles/screens/collection.css';
import '../../styles/screens/chapterGallery.css';
import { getCharacterIconUrl, getCharacterVariants } from '../../utils/characterRegistry';
import characterDataJson from '../../assets/data/characters.json';
import backgroundsDataJson from '../../assets/data/backgrounds.json';
import enemyDataJson from '../../assets/data/enemies.json';
import tagsDataJson from '../../assets/data/tags.json';
import itemsDataJson from '../../assets/data/items.json';
import npcsDataJson from '../../assets/data/npcs.json';
import eventsDataJson from '../../assets/data/events.json';
import galleryDataJson from '../../assets/data/gallery.json';
import { BGMPlayerScreen } from './BGMPlayerScreen';
import { TableView } from '../../components/Collection/DB_system';
import { MultiSelect } from '../../components/common/MultiSelect';
import { TagManager } from '../../components/common/TagManager';

import {
    resolveAssetUrl,
    resolveBgUrl,
    resolveEnemyUrl
} from '../../utils/assetUtils';

export const CollectionScreen = ({ onToggleGenerator }) => {
    const { goBack, episodes, selectedChapter, setSelectedChapter, startEvent } = useGameStore();
    const [activeCategory, setActiveCategory] = useState('library');
    const [activeSubCategory, setActiveSubCategory] = useState('character');
    const [selectedCharacterId, setSelectedCharacterId] = useState(characterDataJson.characters[0]?.id);
    const [selectedNpcId, setSelectedNpcId] = useState(npcsDataJson.npcs[0]?.id);
    const [isStoryPanelOpen, setIsStoryPanelOpen] = useState(true);
    const [storySubCategory, setStorySubCategory] = useState('main');
    const [storyViewMode, setStoryViewMode] = useState('stepper'); // stepper, kanban, list

    // 3rd Level Tag Filters
    const [filterCharacter, setFilterCharacter] = useState([]);
    const [filterNpcRole, setFilterNpcRole] = useState([]);
    const [filterLocation, setFilterLocation] = useState([]);

    // Tag Manager Modal
    const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
    const [localTags, setLocalTags] = useState(tagsDataJson.tags);

    // Get tags by category for filters
    const characterTags = localTags.filter(t => t.category === 'Character' || t.category === 'Class' || t.category === 'Affiliation');
    const npcRoleTags = localTags.filter(t => t.category === 'NPCRole');
    const locationTags = localTags.filter(t => t.category === 'Location');

    const handleCreateTag = (newTag) => {
        setLocalTags([...localTags, newTag]);
    };

    // CG Gallery State
    const [galleryView, setGalleryView] = useState('All');
    const [galleryLayout, setGalleryLayout] = useState('gallery'); // list, gallery
    const [gallerySearch, setGallerySearch] = useState('');
    const galleryViews = ['All', ...galleryDataJson.categories?.map(c => c.id)];
    const getFilteredGallery = () => {
        let items = galleryDataJson.images || [];
        if (galleryView !== 'All') items = items.filter(i => i.category === galleryView);
        if (gallerySearch) items = items.filter(i =>
            i.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
            i.tags?.some(t => t.toLowerCase().includes(gallerySearch.toLowerCase()))
        );
        return items;
    };

    // Right Panel Collapsible State
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    // Locations Data (地名辞典)
    const locationsData = backgroundsDataJson.locations || [];
    const [selectedLocationId, setSelectedLocationId] = useState(locationsData[0]?.id);
    const selectedLocation = locationsData.find(l => l.id === selectedLocationId);

    // View States for Locations
    const [bgView, setBgView] = useState('All');
    const [bgLayout, setBgLayout] = useState('gallery'); // Default to gallery, but allow toggle
    const bgViews = ['All', ...backgroundsDataJson.categories?.map(c => c.id)];

    const getFilteredBackgrounds = () => {
        if (bgView === 'All') return locationsData;
        return locationsData.filter(loc => loc.category === bgView);
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
        { id: 'story', label: 'ストーリー', implemented: true },
        { id: 'library', label: 'ライブラリー', implemented: true }, // Database moved here
        { id: 'sound', label: 'Sound', implemented: true },
        { id: 'keymap', label: 'KeyMap', implemented: false },
    ];

    // Sub-categories for Library
    const librarySubCategories = [
        { id: 'background', label: '地名辞典', implemented: true },
        { id: 'character', label: 'キャラクター図鑑', implemented: true },
        { id: 'npc', label: 'NPC図鑑', implemented: true },
        { id: 'enemy', label: 'エネミー図鑑', implemented: true },
        { id: 'item_dict', label: 'アイテム図鑑', implemented: true },
        { id: 'tips', label: 'TipsDB', implemented: true },
        { id: 'cg_gallery', label: 'CG・Gallery', implemented: true },
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

    // View States for Enemies
    const [enemyView, setEnemyView] = useState('All');
    const [enemyLayout, setEnemyLayout] = useState('gallery');
    const enemyViews = ['All', ...(enemyDataJson.categories?.map(c => c.id) || [])];

    const getFilteredEnemies = () => {
        if (enemyView === 'All') return enemyData;
        return enemyData.filter(enemy => enemy.label === enemyView);
    };

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
        if (activeCategory === 'story') return storySubCategories;
        return [];
    };

    // Sub-categories for Story
    const storySubCategories = [
        { id: 'main', label: 'メイン', implemented: true },
        { id: 'event', label: 'イベント', implemented: true },
    ];

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

    // Enemy Card Renderer - Card Game Style
    const getRarityColor = (rarity) => {
        const colors = {
            1: '#9ca3af', // Common - Gray
            2: '#22c55e', // Uncommon - Green
            3: '#3b82f6', // Rare - Blue
            4: '#a855f7', // Epic - Purple
            5: '#f59e0b'  // Legendary - Gold
        };
        return colors[rarity] || colors[1];
    };

    const renderEnemyCard = (enemy) => (
        <div className="enemy-card" style={{
            background: `linear-gradient(180deg, ${getRarityColor(enemy.rarity)}22 0%, #1a1a2e 30%)`,
            border: `2px solid ${getRarityColor(enemy.rarity)}`,
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxShadow: `0 4px 20px ${getRarityColor(enemy.rarity)}33`,
            transition: 'transform 0.3s, box-shadow 0.3s'
        }}>
            {/* Card Header - Rarity Stars */}
            <div style={{
                padding: '0.5rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.3)',
                borderBottom: `1px solid ${getRarityColor(enemy.rarity)}44`
            }}>
                <span style={{ color: getRarityColor(enemy.rarity), letterSpacing: '2px' }}>
                    {'★'.repeat(enemy.rarity || 1)}{'☆'.repeat(5 - (enemy.rarity || 1))}
                </span>
            </div>

            {/* Monster Image */}
            <div style={{
                width: '100%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                background: 'radial-gradient(circle at center, #2a2a4e 0%, #0a0a1e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <img
                    src={resolveEnemyUrl(enemy.image)}
                    alt={enemy.name}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                    }}
                />
            </div>

            {/* Card Body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Name & Label */}
                <div style={{ textAlign: 'center' }}>
                    <h4 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: '#fff',
                        textShadow: `0 0 10px ${getRarityColor(enemy.rarity)}`
                    }}>{enemy.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{enemy.label}</span>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>HP</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{enemy.stats?.hp || 0}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#3b82f6' }}>MP</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{enemy.stats?.mp || 0}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>ATK</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{enemy.stats?.atk || 0}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#22c55e' }}>DEF</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{enemy.stats?.def || 0}</div>
                    </div>
                </div>

                {/* Description */}
                <p style={{
                    fontSize: '0.75rem',
                    color: '#aaa',
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.4,
                    flex: 1
                }}>{enemy.description}</p>

                {/* Skills */}
                {enemy.skills && enemy.skills.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {enemy.skills.map(skill => (
                            <span key={skill} style={{
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.4)',
                                borderRadius: '4px',
                                color: '#93c5fd'
                            }}>{skill}</span>
                        ))}
                    </div>
                )}
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
                <div style={{ position: 'absolute', top: '15px', right: '20px', zIndex: 10 }}>
                    <button
                        onClick={() => {
                            console.log("Collection: Clicked generator button");
                            if (onToggleGenerator) onToggleGenerator();
                            else alert("Error: onToggleGenerator function missing!");
                        }}
                        title="アセット生成"
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #fbbf24',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            color: '#fbbf24',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Sparkles size={20} />
                    </button>
                </div>
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
                ) : activeCategory === 'library' && activeSubCategory === 'npc' ? (
                    <div className="character-encyclopedia">
                        {/* NPC List Sidebar */}
                        <div className="character-list">
                            <h3>NPC一覧</h3>
                            <ul>
                                {npcsDataJson.npcs.map(npc => (
                                    <li
                                        key={npc.id}
                                        className={selectedNpcId === npc.id ? 'active' : ''}
                                        onClick={() => setSelectedNpcId(npc.id)}
                                    >
                                        {npc.name}
                                        <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>
                                            ({npc.role})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* NPC Detail View */}
                        <div className="character-detail">
                            {(() => {
                                const selectedNpc = npcsDataJson.npcs.find(n => n.id === selectedNpcId);
                                const locationInfo = npcsDataJson.locations?.find(l => l.id === selectedNpc?.location);
                                return selectedNpc ? (
                                    <div className="detail-grid">
                                        <div className="card-section">
                                            <h4>NPCカード</h4>
                                            <div className="char-card">
                                                <img
                                                    src={resolveAssetUrl(selectedNpc.image)}
                                                    alt={selectedNpc.name}
                                                    onError={(e) => { e.target.src = 'https://placehold.co/200x280/2a2a2a/FFF?text=NPC'; }}
                                                />
                                                <div className="char-info">
                                                    <h2>{selectedNpc.name}</h2>
                                                    <div style={{ marginBottom: '0.5rem' }}>
                                                        <span style={{
                                                            background: 'rgba(212, 175, 55, 0.2)',
                                                            border: '1px solid var(--color-text-accent)',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.85rem',
                                                            color: 'var(--color-text-accent)'
                                                        }}>
                                                            {selectedNpc.role}
                                                        </span>
                                                    </div>
                                                    <div className="tags" style={{ marginBottom: '1rem' }}>
                                                        {selectedNpc.tags?.map(tag => (
                                                            <span key={tag} className="tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                    <p>{selectedNpc.dict}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location Info */}
                                        <div className="assets-section" style={{ flexDirection: 'column' }}>
                                            <div className="icons-section" style={{ minWidth: '100%' }}>
                                                <h4>📍 出現場所</h4>
                                                <div style={{
                                                    background: 'rgba(30, 41, 59, 0.8)',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #334155'
                                                }}>
                                                    <span style={{
                                                        background: 'rgba(34, 197, 94, 0.2)',
                                                        border: '1px solid #22c55e',
                                                        padding: '4px 12px',
                                                        borderRadius: '6px',
                                                        color: '#22c55e',
                                                        fontSize: '1rem'
                                                    }}>
                                                        {locationInfo?.label || selectedNpc.location}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="standing-section" style={{ minWidth: '100%' }}>
                                                <h4>📖 関連イベント</h4>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {selectedNpc.relatedEvents?.length > 0 ? (
                                                        selectedNpc.relatedEvents.map(eventId => (
                                                            <span key={eventId} style={{
                                                                background: 'rgba(59, 130, 246, 0.2)',
                                                                border: '1px solid #3b82f6',
                                                                padding: '4px 10px',
                                                                borderRadius: '6px',
                                                                color: '#93c5fd',
                                                                fontSize: '0.85rem'
                                                            }}>
                                                                {eventId}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span style={{ color: '#666' }}>関連イベントなし</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Standing Gallery if available */}
                                        {selectedNpc.standing?.length > 0 && (
                                            <div className="cg-section">
                                                <h4>立ち絵ギャラリー</h4>
                                                <div className="standing-gallery">
                                                    {selectedNpc.standing.map((url, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={resolveAssetUrl(url)}
                                                            alt="Standing"
                                                            className="standing-img"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-selection">NPCを選択してください</div>
                                );
                            })()}
                        </div>
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'background' ? (
                    <div className="character-encyclopedia" style={{ display: 'flex', height: '100%' }}>
                        {/* Location List Sidebar */}
                        <div className="character-list" style={{ width: '250px', borderRight: '1px solid #333', overflowY: 'auto' }}>
                            <div className="list-header" style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
                                <h3 style={{ margin: 0, color: 'var(--color-text-accent)' }}>地名一覧</h3>
                            </div>
                            {locationsData.map(loc => {
                                const category = backgroundsDataJson.categories?.find(c => c.id === loc.category);
                                return (
                                    <div
                                        key={loc.id}
                                        onClick={() => setSelectedLocationId(loc.id)}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #222',
                                            background: selectedLocationId === loc.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                            borderLeft: selectedLocationId === loc.id ? '3px solid var(--color-text-accent)' : '3px solid transparent'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{loc.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: category?.color || '#888' }}>
                                            {category?.label || loc.category}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Location Detail Panel */}
                        <div className="character-detail" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {selectedLocation ? (
                                <>
                                    {/* Location Images */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        {selectedLocation.images?.map((img, idx) => (
                                            <div key={idx} style={{
                                                width: '300px',
                                                height: '180px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '1px solid #333'
                                            }}>
                                                <img
                                                    src={`/assets/${img}`}
                                                    alt={selectedLocation.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Location Card */}
                                    <div className="character-card" style={{ background: 'rgba(30, 30, 40, 0.9)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                        <h2 style={{ margin: '0 0 0.5rem', color: '#fff' }}>{selectedLocation.name}</h2>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                            {selectedLocation.tags?.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <p style={{ color: '#ccc', lineHeight: 1.6 }}>{selectedLocation.description}</p>

                                        {/* Location Info Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#888' }}>地域</div>
                                                <div style={{ color: '#fff' }}>{selectedLocation.region || '-'}</div>
                                            </div>
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#888' }}>気候</div>
                                                <div style={{ color: '#fff' }}>{selectedLocation.climate || '-'}</div>
                                            </div>
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#888' }}>人口</div>
                                                <div style={{ color: '#fff' }}>{selectedLocation.population || '-'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Related NPCs */}
                                    <div style={{ background: 'rgba(30, 30, 40, 0.9)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: '0 0 1rem', color: 'var(--color-text-accent)' }}>👥 関連NPC</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {selectedLocation.relatedNpcs?.length > 0 ? (
                                                selectedLocation.relatedNpcs.map(npcId => {
                                                    const npc = npcsDataJson.npcs.find(n => n.id === npcId);
                                                    return (
                                                        <span key={npcId} style={{
                                                            padding: '0.5rem 1rem',
                                                            background: 'rgba(59, 130, 246, 0.2)',
                                                            border: '1px solid #3b82f6',
                                                            borderRadius: '6px',
                                                            color: '#93c5fd'
                                                        }}>
                                                            {npc?.name || npcId}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span style={{ color: '#666' }}>関連NPCなし</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Related Events */}
                                    <div style={{ background: 'rgba(30, 30, 40, 0.9)', borderRadius: '12px', padding: '1.5rem' }}>
                                        <h4 style={{ margin: '0 0 1rem', color: 'var(--color-text-accent)' }}>📖 関連イベント</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {selectedLocation.relatedEvents?.length > 0 ? (
                                                selectedLocation.relatedEvents.map(eventId => (
                                                    <span key={eventId} style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'rgba(34, 197, 94, 0.2)',
                                                        border: '1px solid #22c55e',
                                                        borderRadius: '6px',
                                                        color: '#86efac'
                                                    }}>
                                                        {eventId}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ color: '#666' }}>関連イベントなし</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="no-selection">地名を選択してください</div>
                            )}
                        </div>
                    </div>
                ) : activeCategory === 'library' && activeSubCategory === 'enemy' ? (
                    <div className="generic-table-view-wrapper" style={{ width: '90%', margin: '0 auto', height: '100%', padding: '20px 0' }}>
                        <TableView
                            title="エネミー図鑑"
                            data={getFilteredEnemies()}
                            columns={enemyColumns}
                            views={enemyViews}
                            activeView={enemyView}
                            onViewChange={setEnemyView}
                            layout={enemyLayout}
                            onLayoutChange={setEnemyLayout}
                            renderGalleryItem={renderEnemyCard}
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
                ) : activeCategory === 'library' && activeSubCategory === 'cg_gallery' ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Gallery Header */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'rgba(30, 30, 40, 0.9)',
                            borderBottom: '1px solid #333',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {/* Category Filter */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {galleryViews.map(view => {
                                    const cat = galleryDataJson.categories?.find(c => c.id === view);
                                    return (
                                        <button
                                            key={view}
                                            onClick={() => setGalleryView(view)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                background: galleryView === view ? (cat?.color || 'var(--color-text-accent)') : 'transparent',
                                                color: galleryView === view ? '#000' : '#fff',
                                                border: `1px solid ${cat?.color || 'var(--color-text-accent)'}`,
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {cat?.label || view}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="タグ・タイトルで検索..."
                                value={gallerySearch}
                                onChange={(e) => setGallerySearch(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: '200px',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(50, 50, 60, 0.8)',
                                    border: '1px solid #555',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            />
                            {/* Layout Toggle */}
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button
                                    onClick={() => setGalleryLayout('gallery')}
                                    style={{
                                        padding: '0.5rem',
                                        background: galleryLayout === 'gallery' ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                    title="ギャラリー表示"
                                >🖼️</button>
                                <button
                                    onClick={() => setGalleryLayout('list')}
                                    style={{
                                        padding: '0.5rem',
                                        background: galleryLayout === 'list' ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                    title="リスト表示"
                                >📋</button>
                            </div>
                        </div>

                        {/* Gallery Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {galleryLayout === 'gallery' ? (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {getFilteredGallery().map(item => {
                                        const cat = galleryDataJson.categories?.find(c => c.id === item.category);
                                        return (
                                            <div key={item.id} style={{
                                                background: 'rgba(30, 30, 40, 0.9)',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                border: '1px solid #333'
                                            }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    background: '#222',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderBottom: `3px solid ${cat?.color || '#666'}`
                                                }}>
                                                    <img
                                                        src={`/assets/gallery/${item.filename}`}
                                                        alt={item.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="font-size: 3rem">${item.category === 'event_movie' ? '🎬' : '🖼️'}</span>`; }}
                                                    />
                                                </div>
                                                <div style={{ padding: '0.75rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <span style={{
                                                            padding: '2px 6px',
                                                            background: cat?.color || '#666',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            color: '#000'
                                                        }}>{cat?.label || item.category}</span>
                                                        {item.duration && <span style={{ fontSize: '0.75rem', color: '#888' }}>{item.duration}</span>}
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</div>
                                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                        {item.tags?.slice(0, 3).map(tag => (
                                                            <span key={tag} style={{
                                                                padding: '2px 6px',
                                                                background: 'rgba(59, 130, 246, 0.2)',
                                                                borderRadius: '4px',
                                                                fontSize: '0.7rem',
                                                                color: '#93c5fd'
                                                            }}>{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #444' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888' }}>タイトル</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888' }}>カテゴリ</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888' }}>タグ</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888' }}>説明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFilteredGallery().map(item => {
                                            const cat = galleryDataJson.categories?.find(c => c.id === item.category);
                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                                                    <td style={{ padding: '0.75rem', color: '#fff' }}>{item.title}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            padding: '2px 8px',
                                                            background: cat?.color || '#666',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            color: '#000'
                                                        }}>{cat?.label || item.category}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                            {item.tags?.map(tag => (
                                                                <span key={tag} style={{
                                                                    padding: '2px 6px',
                                                                    background: 'rgba(59, 130, 246, 0.2)',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.75rem',
                                                                    color: '#93c5fd'
                                                                }}>{tag}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem', color: '#888', fontSize: '0.85rem' }}>{item.description}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                ) : activeCategory === 'story' ? (
                    <div className="story-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Story Sub Navigation */}
                        <div className="story-sub-nav" style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(30, 30, 40, 0.9)',
                            borderBottom: '1px solid #333',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {storySubCategories.map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setStorySubCategory(sub.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: storySubCategory === sub.id ? 'var(--color-text-accent)' : 'transparent',
                                            color: storySubCategory === sub.id ? '#000' : '#fff',
                                            border: '1px solid var(--color-text-accent)',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>
                            {/* View Mode Toggle */}
                            {storySubCategory === 'main' && (
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    {[
                                        { id: 'stepper', label: '📋', title: 'ステッパー' },
                                        { id: 'kanban', label: '📊', title: 'カンバン' },
                                        { id: 'list', label: '📝', title: 'リスト' }
                                    ].map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setStoryViewMode(mode.id)}
                                            title={mode.title}
                                            style={{
                                                padding: '0.5rem',
                                                background: storyViewMode === mode.id ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            {mode.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3rd Level: Tag Filters */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(20, 20, 30, 0.9)',
                            borderBottom: '1px solid #222',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Character:</span>
                                <MultiSelect
                                    options={characterTags}
                                    value={filterCharacter}
                                    onChange={setFilterCharacter}
                                    placeholder="All"
                                    allowCreate
                                    onCreate={(name) => handleCreateTag({ id: name.toUpperCase(), name, category: 'Character', color: '#ef4444' })}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>NPCロール:</span>
                                <MultiSelect
                                    options={npcRoleTags}
                                    value={filterNpcRole}
                                    onChange={setFilterNpcRole}
                                    placeholder="All"
                                    allowCreate
                                    onCreate={(name) => handleCreateTag({ id: name.toUpperCase(), name, category: 'NPCRole', color: '#78716c' })}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Location:</span>
                                <MultiSelect
                                    options={locationTags}
                                    value={filterLocation}
                                    onChange={setFilterLocation}
                                    placeholder="All"
                                    allowCreate
                                    onCreate={(name) => handleCreateTag({ id: name.toUpperCase(), name, category: 'Location', color: '#f59e0b' })}
                                />
                            </div>
                            <button
                                onClick={() => setIsTagManagerOpen(true)}
                                style={{
                                    marginLeft: 'auto',
                                    padding: '0.4rem 0.8rem',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    border: '1px solid #22c55e',
                                    borderRadius: '6px',
                                    color: '#22c55e',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                + タグ管理
                            </button>
                        </div>

                        {/* Main Story Content */}
                        {storySubCategory === 'main' && storyViewMode === 'stepper' && (
                            <div className="chapter-gallery-screen" style={{ flex: 1 }}>
                                <div className={`side-panel ${isStoryPanelOpen ? 'open' : 'closed'}`}>
                                    <div className="side-panel-content">
                                        <div className="side-panel-header">
                                            <h3>エピソード選択</h3>
                                        </div>
                                        <div className="stepper-container">
                                            {episodes?.map((episode) => (
                                                <div key={episode.id} className="episode-item">
                                                    <div className="episode-header">{episode.title}</div>
                                                    <div className="chapter-list">
                                                        {episode.chapters.map((chapter) => (
                                                            <div
                                                                key={chapter.id}
                                                                className={`chapter-item ${selectedChapter === chapter.id ? 'active' : ''}`}
                                                                onClick={() => setSelectedChapter(chapter.id)}
                                                            >
                                                                <span className="chapter-icon">
                                                                    {selectedChapter === chapter.id ? '✓' : '○'}
                                                                </span>
                                                                <span className="chapter-title">{chapter.title.replace(/第.章：/, '')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="toggle-panel-btn" onClick={() => setIsStoryPanelOpen(!isStoryPanelOpen)}>
                                    {isStoryPanelOpen ? '◀' : '▶'}
                                </button>
                                <div className="main-content-area">
                                    {(() => {
                                        const currentChapter = episodes
                                            ?.flatMap(ep => ep.chapters)
                                            .find(ch => ch.id === selectedChapter);
                                        const currentEpisode = episodes?.find(ep =>
                                            ep.chapters.some(ch => ch.id === selectedChapter)
                                        );
                                        const episodeLocations = episodes?.[0]?.locations || eventsDataJson?.locations || [];
                                        return currentChapter ? (
                                            <>
                                                <div className="chapter-title-section">
                                                    <div className="chapter-subtitle">{currentEpisode?.title}</div>
                                                    <h2 className="chapter-main-title">{currentChapter.title}</h2>
                                                </div>
                                                <div className="events-grid">
                                                    {currentChapter.events.map((event) => {
                                                        const loc = episodeLocations.find(l => l.id === event.location);
                                                        return (
                                                            <div key={event.id} className="event-card">
                                                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                    {loc && (
                                                                        <span style={{
                                                                            fontSize: '0.75rem',
                                                                            padding: '2px 8px',
                                                                            background: `${loc.color}22`,
                                                                            border: `1px solid ${loc.color}`,
                                                                            borderRadius: '4px',
                                                                            color: loc.color
                                                                        }}>📍 {loc.label}</span>
                                                                    )}
                                                                </div>
                                                                <h3 className="event-title">{event.title}</h3>
                                                                <p className="event-description">{event.description}</p>
                                                                <button
                                                                    className="event-read-btn"
                                                                    onClick={() => startEvent(event.id, event.startStoryID)}
                                                                >
                                                                    読む
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="placeholder-content">
                                                <h2>エピソードを選択してください</h2>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Kanban View */}
                        {storySubCategory === 'main' && storyViewMode === 'kanban' && (
                            <div style={{
                                flex: 1,
                                padding: '1rem',
                                display: 'flex',
                                gap: '1rem',
                                overflowX: 'auto'
                            }}>
                                {(episodes?.[0]?.locations || []).map(location => {
                                    const locationEvents = episodes?.flatMap(ep =>
                                        ep.chapters.flatMap(ch =>
                                            ch.events.filter(ev => ev.location === location.id).map(ev => ({
                                                ...ev,
                                                chapter: ch.title,
                                                episode: ep.title
                                            }))
                                        )
                                    ) || [];
                                    return (
                                        <div key={location.id} style={{
                                            minWidth: '280px',
                                            background: 'rgba(30, 30, 40, 0.9)',
                                            borderRadius: '12px',
                                            border: `2px solid ${location.color}44`,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                padding: '1rem',
                                                background: `${location.color}22`,
                                                borderBottom: `1px solid ${location.color}44`,
                                                borderRadius: '10px 10px 0 0'
                                            }}>
                                                <h3 style={{ margin: 0, color: location.color }}>📍 {location.label}</h3>
                                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{locationEvents.length} イベント</span>
                                            </div>
                                            <div style={{ padding: '0.5rem', flex: 1, overflowY: 'auto' }}>
                                                {locationEvents.map(event => (
                                                    <div key={event.id} style={{
                                                        background: 'rgba(50, 50, 60, 0.8)',
                                                        padding: '0.75rem',
                                                        marginBottom: '0.5rem',
                                                        borderRadius: '8px',
                                                        borderLeft: `3px solid ${location.color}`,
                                                        cursor: 'pointer'
                                                    }} onClick={() => startEvent(event.id, event.startStoryID)}>
                                                        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.25rem' }}>
                                                            {event.episode} / {event.chapter}
                                                        </div>
                                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{event.title}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{event.description}</div>
                                                    </div>
                                                ))}
                                                {locationEvents.length === 0 && (
                                                    <div style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                                                        イベントなし
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* List View */}
                        {storySubCategory === 'main' && storyViewMode === 'list' && (
                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(30, 30, 40, 0.9)' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>イベント</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>場所</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Episode</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Chapter</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #333' }}>アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {episodes?.flatMap(ep =>
                                            ep.chapters.flatMap(ch =>
                                                ch.events.map(event => {
                                                    const loc = (episodes?.[0]?.locations || []).find(l => l.id === event.location);
                                                    return (
                                                        <tr key={event.id} style={{ borderBottom: '1px solid #222' }}>
                                                            <td style={{ padding: '0.75rem' }}>
                                                                <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{event.description}</div>
                                                            </td>
                                                            <td style={{ padding: '0.75rem' }}>
                                                                {loc && <span style={{ color: loc.color }}>📍 {loc.label}</span>}
                                                            </td>
                                                            <td style={{ padding: '0.75rem', color: '#888' }}>{ep.title}</td>
                                                            <td style={{ padding: '0.75rem', color: '#888' }}>{ch.title}</td>
                                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                                <button
                                                                    onClick={() => startEvent(event.id, event.startStoryID)}
                                                                    style={{
                                                                        padding: '0.5rem 1rem',
                                                                        background: 'var(--color-text-accent)',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >読む</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Event Sub-Category (Quest/Sub Events) */}
                        {storySubCategory === 'event' && (
                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {eventsDataJson.events.map(event => {
                                        const eventType = eventsDataJson.types?.find(t => t.id === event.type);
                                        const loc = (episodes?.[0]?.locations || []).find(l => l.id === event.location);
                                        return (
                                            <div key={event.id} style={{
                                                background: 'rgba(30, 30, 40, 0.9)',
                                                borderRadius: '12px',
                                                border: `1px solid ${eventType?.color || '#333'}44`,
                                                padding: '1rem',
                                                borderLeft: `4px solid ${eventType?.color || '#333'}`
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        background: `${eventType?.color || '#333'}22`,
                                                        border: `1px solid ${eventType?.color || '#333'}`,
                                                        borderRadius: '4px',
                                                        color: eventType?.color || '#888'
                                                    }}>{eventType?.label || event.type}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                                        難易度: {'★'.repeat(event.difficulty)}{'☆'.repeat(3 - event.difficulty)}
                                                    </span>
                                                </div>
                                                <h3 style={{ margin: '0.5rem 0', color: '#fff' }}>{event.title}</h3>
                                                <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.75rem' }}>{event.description}</p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                    {loc && (
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            padding: '2px 6px',
                                                            background: `${loc.color}22`,
                                                            border: `1px solid ${loc.color}`,
                                                            borderRadius: '4px',
                                                            color: loc.color
                                                        }}>📍 {loc.label}</span>
                                                    )}
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        padding: '2px 6px',
                                                        background: 'rgba(59, 130, 246, 0.2)',
                                                        border: '1px solid #3b82f6',
                                                        borderRadius: '4px',
                                                        color: '#93c5fd'
                                                    }}>{event.episode} / {event.chapter}</span>
                                                </div>
                                                <div style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(34, 197, 94, 0.1)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8rem',
                                                    color: '#22c55e'
                                                }}>
                                                    💰 報酬: {event.reward}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (event.startStoryID) {
                                                            startEvent(event.id, event.startStoryID);
                                                        } else {
                                                            alert("このイベントは現在プレイできません");
                                                        }
                                                    }}
                                                    style={{
                                                        marginTop: '0.75rem',
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        background: event.startStoryID ? 'var(--color-text-accent)' : '#444',
                                                        color: event.startStoryID ? '#000' : '#888',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontWeight: 'bold',
                                                        cursor: event.startStoryID ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    {event.startStoryID ? 'イベントを開始' : '準備中'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="placeholder-content">
                        <h2>{categories.find(c => c.id === activeCategory)?.label}</h2>
                        <p>このカテゴリは現在準備中です</p>
                    </div>
                )}
            </div>

            {/* Tag Manager Modal */}
            <TagManager
                isOpen={isTagManagerOpen}
                onClose={() => setIsTagManagerOpen(false)}
                categories={tagsDataJson.categories || []}
                onSave={handleCreateTag}
            />
        </div>
    );
};
