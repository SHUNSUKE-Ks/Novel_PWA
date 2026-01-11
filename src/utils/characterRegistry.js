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
const characterAssets = import.meta.glob('../assets/chara/**/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

/**
 * Get the full icon URL for a character by name and variant.
 * @param {string} characterName 
 * @param {string} variant - Optional variant name (e.g., 'smile', 'angry'), defaults to 'default'
 * @returns {string} Resolved image URL
 */
export const getCharacterIconUrl = (characterName, variant = 'default') => {
    const charEntry = characters[characterName];
    if (!charEntry) {
        // Fallback placeholder
        return `https://placehold.co/60x60/2a2a2a/FFF?text=${characterName}`;
    }

    // Try to find the variant, fallback to default icon
    let filename = charEntry.defaultIcon;
    if (charEntry.variants && charEntry.variants[variant]) {
        filename = charEntry.variants[variant];
    }

    // Resolve using glob map
    const key = `../assets/chara/${filename}`;
    const asset = characterAssets[key];

    if (asset) {
        return asset;
    }

    console.warn(`Icon asset not found: ${key}`);
    return `https://placehold.co/60x60/2a2a2a/FFF?text=${characterName}`;
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
