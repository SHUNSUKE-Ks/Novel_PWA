import episodesData from '../assets/data/episodes.json';
import mainScenarioData from '../assets/data/scenario.json';
import galleryData from '../assets/data/gallery.json';

// Import all quest scenarios
const questScenarios = import.meta.glob('../assets/data/scenarios/*.json', { eager: true, import: 'default' });

export const loadGameData = async () => {
    try {
        // Combine main scenario with all quest scenarios
        const combinedScenario = [
            ...mainScenarioData.scenario,
            ...Object.values(questScenarios).flat()
        ];

        return {
            episodes: episodesData.episodes,
            scenario: combinedScenario,
            gallery: galleryData
        };
    } catch (error) {
        console.error('Error loading game data:', error);
        throw error;
    }
};
