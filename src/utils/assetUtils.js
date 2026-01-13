// src/utils/assetUtils.js

// Glob imports must be in the utility file to work correctly with Vite
const characterAssets = import.meta.glob('../assets/chara/**/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const backgroundAssets = import.meta.glob('../assets/bg/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const enemyAssets = import.meta.glob('../assets/enemy/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const bgmAssets = import.meta.glob('../assets/sound/bgm/BGM/*.{mp3,m4a,wav}', { eager: true, import: 'default' });

export const resolveAssetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const key = `../assets/chara/${path}`;
    return characterAssets[key] || null;
};

export const resolveBgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Try full path or just filename
    const key = path.includes('/') ? `../assets/${path}` : `../assets/bg/${path}`;
    return backgroundAssets[key] || null;
};

export const resolveEnemyUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    const key = `../assets/enemy/${filename}`;
    return enemyAssets[key] || null;
};

export const resolveBgmUrl = (filename) => {
    if (!filename) return null;
    const directKey = `../assets/sound/bgm/BGM/${filename}`;
    if (bgmAssets[directKey]) return bgmAssets[directKey];

    // Fallback: search for key ending with /filename
    // precise match ensures we don't match 'subfile.mp3' against 'file.mp3' incorrectly if logic was loose
    // but here we want exact filename match
    const foundKey = Object.keys(bgmAssets).find(k => k.endsWith(`/${filename}`));
    return foundKey ? bgmAssets[foundKey] : null;
};
