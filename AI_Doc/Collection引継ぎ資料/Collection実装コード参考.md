# Collection機能 実装コード参考資料

この資料は、Collection（図鑑）機能の核心となるソースコードをまとめたものです。移植や再利用の際のコードリファレンスとして活用してください。

## 1. UI (Component)
`src/screens/CollectionScreen.jsx`

```jsx
import React, { useState } from 'react';
import '../styles/CollectionScreen.css';
import { getCharacterIconUrl, getCharacterVariants } from '../utils/characterRegistry';

const CollectionScreen = () => {
    const [activeCategory, setActiveCategory] = useState('library');
    const [activeSubCategory, setActiveSubCategory] = useState('character');
    const [selectedCharacterId, setSelectedCharacterId] = useState(1);

    // Categories definition
    const categories = [
        { id: 'item', label: 'アイテム', implemented: false },
        { id: 'equipment', label: '装備', implemented: false },
        { id: 'skill', label: 'スキル', implemented: false },
        { id: 'ability', label: 'アビリティ', implemented: false },
        { id: 'story', label: 'ストーリー', implemented: false },
        { id: 'library', label: 'ライブラリー', implemented: true },
        { id: 'sound', label: 'Sound', implemented: false },
        { id: 'keymap', label: 'KeyMap', implemented: false },
    ];

    // Sub-categories for Library
    const librarySubCategories = [
        { id: 'background', label: '背景図鑑', implemented: false },
        { id: 'character', label: 'キャラクター図鑑', implemented: true },
        { id: 'enemy', label: 'エネミー図鑑', implemented: false },
        { id: 'item_dict', label: 'アイテム図鑑', implemented: false },
    ];

    // Character Data using real assets
    const characterData = [
        {
            id: 1,
            name: "レムナント",
            image: "https://placehold.co/300x400/2a2a2a/FFF?text=Remnant+Card",
            dict: "謎多き冒険者。鉱山の魔石について詳しい。",
            icons: {
                default: getCharacterIconUrl("レムナント", "default"),
                smile: getCharacterIconUrl("レムナント", "smile"),
                angry: getCharacterIconUrl("レムナント", "angry"),
                sad: getCharacterIconUrl("レムナント", "sad"),
            },
            standing: [
                "https://placehold.co/400x800/transparent/FFF?text=Standing+Full"
            ],
            cgs: [
                "https://placehold.co/1920x1080/1a1a1a/FFF?text=CG+Event+1"
            ]
        },
        {
            id: 2,
            name: "ラテル",
            image: "https://placehold.co/300x400/2a2a2a/FFF?text=Ratel+Card",
            dict: "真面目な戦士。レムナントと行動を共にしている。",
            icons: {
                default: getCharacterIconUrl("ラテル", "default"),
                smile: getCharacterIconUrl("ラテル", "smile"),
                troubled: getCharacterIconUrl("ラテル", "troubled"),
            },
            standing: [
                "https://placehold.co/400x800/transparent/FFF?text=Standing+Full"
            ],
            cgs: []
        },
        {
            id: 3,
            name: "ユースティア",
            image: "https://placehold.co/300x400/2a2a2a/FFF?text=Justia+Card",
            dict: "正義を重んじる騎士。",
            icons: {
                default: getCharacterIconUrl("ユースティア", "default"),
                angry: getCharacterIconUrl("ユースティア", "angry"),
            },
            standing: [
                "https://placehold.co/400x800/transparent/FFF?text=Standing+Full"
            ],
            cgs: []
        }
    ];

    const selectedCharacter = characterData.find(c => c.id === selectedCharacterId);

    return (
        <div className="collection-screen">
            {/* Top Navigation: Categories */}
            <nav className="category-nav">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`nav-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                        disabled={!cat.implemented && cat.id !== 'library'} // Allow clicking library
                    >
                        {cat.label}
                    </button>
                ))}
            </nav>

            {/* Sub Navigation: Contextual based on Category */}
            <div className="sub-nav-container">
                {activeCategory === 'library' && (
                    <nav className="sub-nav">
                        {librarySubCategories.map(sub => (
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
                )}
            </div>

            {/* Main Content Area */}
            <div className="collection-content">
                {activeCategory === 'library' && activeSubCategory === 'character' ? (
                    <div className="character-encyclopedia">
                        {/* Character List Sidebar */}
                        <div className="character-list">
                            <h3>Character List</h3>
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
                                        <h4>Character Card</h4>
                                        <div className="char-card">
                                            <img src={selectedCharacter.image} alt={selectedCharacter.name} />
                                            <div className="char-info">
                                                <h2>{selectedCharacter.name}</h2>
                                                <p>{selectedCharacter.dict}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="assets-section">
                                        <div className="icons-section">
                                            <h4>Icons (60x60)</h4>
                                            <div className="icon-grid">
                                                {Object.entries(selectedCharacter.icons).map(([key, url]) => (
                                                    <div key={key} className="icon-item">
                                                        <img src={url} alt={key} />
                                                        <span>{key}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="standing-section">
                                            <h4>Standing Art</h4>
                                            <div className="standing-gallery">
                                                {selectedCharacter.standing.map((url, idx) => (
                                                    <img key={idx} src={url} alt="Standing" className="standing-img" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cg-section">
                                        <h4>CG Gallery (1920x1080)</h4>
                                        <div className="cg-gallery">
                                            {selectedCharacter.cgs.length > 0 ? (
                                                selectedCharacter.cgs.map((url, idx) => (
                                                    <img key={idx} src={url} alt="CG" className="cg-img" />
                                                ))
                                            ) : (
                                                <p>No CGs available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-selection">Select a character</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="placeholder-content">
                        <h2>{categories.find(c => c.id === activeCategory)?.label}</h2>
                        <p>Not Implemented Yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionScreen;
```

## 2. スタイル (CSS)
`src/styles/CollectionScreen.css`

```css
/* CollectionScreen.css */
.collection-screen {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #121212;
    /* Dark background for game menu feel */
    color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
}

/* Category Navigation */
.category-nav {
    display: flex;
    background-color: #1e1e1e;
    border-bottom: 2px solid #333;
    padding: 0 20px;
}

.nav-btn {
    background: none;
    border: none;
    color: #888;
    padding: 15px 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.nav-btn:hover:not(:disabled) {
    color: #fff;
    background-color: #2a2a2a;
}

.nav-btn.active {
    color: #4facfe;
    border-bottom: 3px solid #4facfe;
    font-weight: bold;
}

.nav-btn:disabled {
    color: #444;
    cursor: not-allowed;
}

/* Sub Navigation */
.sub-nav-container {
    background-color: #252525;
    padding: 10px 20px;
    border-bottom: 1px solid #333;
    min-height: 50px;
    /* Ensure space even if empty */
}

.sub-nav {
    display: flex;
    gap: 15px;
}

.sub-nav-btn {
    background: none;
    border: 1px solid #444;
    color: #aaa;
    padding: 5px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.sub-nav-btn:hover:not(:disabled) {
    border-color: #666;
    color: #fff;
}

.sub-nav-btn.active {
    background-color: #4facfe;
    color: #000;
    border-color: #4facfe;
    font-weight: bold;
}

/* Content Area */
.collection-content {
    flex: 1;
    overflow: hidden;
    padding: 20px;
}

.placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #555;
}

/* Character Encyclopedia Layout */
.character-encyclopedia {
    display: flex;
    height: 100%;
    gap: 20px;
}

.character-list {
    width: 250px;
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 15px;
    overflow-y: auto;
    border: 1px solid #333;
}

.character-list h3 {
    margin-top: 0;
    border-bottom: 1px solid #444;
    padding-bottom: 10px;
    color: #4facfe;
}

.character-list ul {
    list-style: none;
    padding: 0;
}

.character-list li {
    padding: 10px;
    border-bottom: 1px solid #2a2a2a;
    cursor: pointer;
    transition: background 0.2s;
}

.character-list li:hover {
    background-color: #2a2a2a;
}

.character-list li.active {
    background-color: #333;
    color: #4facfe;
    border-left: 3px solid #4facfe;
}

.character-detail {
    flex: 1;
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
    border: 1px solid #333;
}

.detail-grid {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* Card Section */
.card-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.char-card {
    display: flex;
    gap: 20px;
    background-color: #222;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #333;
}

.char-card img {
    width: 150px;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #444;
}

.char-info h2 {
    margin-top: 0;
    color: #fff;
    font-size: 2rem;
}

.char-info p {
    color: #ccc;
    line-height: 1.6;
}

/* Assets Section */
.assets-section {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.icons-section,
.standing-section {
    flex: 1;
    min-width: 300px;
}

.icon-grid {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.icon-item img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #444;
    transition: transform 0.2s;
}

.icon-item img:hover {
    transform: scale(1.1);
    border-color: #4facfe;
}

.icon-item span {
    font-size: 0.8rem;
    color: #888;
}

.standing-gallery {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
}

.standing-img {
    height: 300px;
    width: auto;
    object-fit: contain;
    /* border: 1px solid #333; */
}

/* CG Section */
.cg-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.cg-img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #333;
    transition: transform 0.2s;
}

.cg-img:hover {
    transform: scale(1.02);
    border-color: #4facfe;
}

h4 {
    color: #aaa;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
    margin-bottom: 15px;
}
```

## 3. ロジック (Utility)
`src/utils/characterRegistry.js`

```javascript
import AssetPaths from '../assets/AssetPaths.json';

/**
 * Registry derived from AssetPaths.json
 */
const characters = AssetPaths.CHARACTERS;

/**
 * Get list of all registered character names/keys
 * @returns {string[]} List of character keys
 */
export const getCharacterNames = () => {
    return Object.keys(characters);
};

/**
 * Get the full icon URL for a character by name and variant.
 * @param {string} characterName 
 * @param {string} variant - Optional variant name (e.g., 'smile', 'angry'), defaults to 'default'
 * @returns {string} Resolved image URL
 */
export const getCharacterIconUrl = (characterName, variant = 'default') => {
    const charEntry = characters[characterName];
    if (!charEntry) {
        return new URL(`../assets/assets_Inbox/player_sprite_64x64.png`, import.meta.url).href;
    }

    // Try to find the variant, fallback to default icon
    let filename = charEntry.defaultIcon;
    if (charEntry.variants && charEntry.variants[variant]) {
        filename = charEntry.variants[variant];
    }

    return new URL(`../assets/assets_Inbox/${filename}`, import.meta.url).href;
};

/**
 * Get available variants for a character
 * @param {string} characterName
 * @returns {string[]} List of variant keys
 */
export const getCharacterVariants = (characterName) => {
    const charEntry = characters[characterName];
    if (!charEntry || !charEntry.variants) return ['default'];
    return Object.keys(charEntry.variants);
};

/**
 * Get all character data for selection UI
 */
export const getCharacterOptions = () => {
    return Object.values(characters).map(c => c.name);
};
```

## 4. データ定義 (JSON)
`src/assets/AssetPaths.json`

```json
{
    "TITLE": {
        "TITLE_BG": "title_bg_1920x1080.png",
        "TITLE_LOGO": "title_logo_800x300.png",
        "START_BUTTON": "start_button_300x100.png",
        "OPTION_BUTTON": "option_button_200x80.png",
        "BGM": "bgm_title_theme.mp3",
        "SE_START": "se_button_start.mp3"
    },
    "NOVEL": {
        "MAIN_BG": "game_bg_stage1_1920x1080.png"
    },
    "CHARACTERS": {
        "レムナント": {
            "name": "レムナント",
            "defaultIcon": "icon_remnant.png",
            "variants": {
                "default": "icon_remnant.png",
                "smile": "icon_remnant_smile.png",
                "angry": "icon_remnant_angry.png",
                "sad": "icon_remnant_@sad.png"
            }
        },
        "ラテル": {
            "name": "ラテル",
            "defaultIcon": "icon_latelle.png",
            "variants": {
                "default": "icon_latelle.png",
                "smile": "icon_latelle_smile.png",
                "troubled": "icon_latelle_troubled.png"
            }
        },
        "ユースティア": {
            "name": "ユースティア",
            "defaultIcon": "icon_justia.png",
            "variants": {
                "default": "icon_justia.png",
                "angry": "icon_justia_angry.png"
            }
        }
    }
}
```
