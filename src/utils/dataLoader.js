export const loadGameData = async () => {
    try {
        const [episodesRes, scenarioRes, galleryRes] = await Promise.all([
            fetch('/src/assets/data/episodes.json'),
            fetch('/src/assets/data/scenario.json'),
            fetch('/src/assets/data/gallery.json')
        ]);

        const episodes = await episodesRes.json();
        const scenarioData = await scenarioRes.json();
        const gallery = await galleryRes.json();

        return {
            episodes: episodes.episodes,
            scenario: scenarioData.scenario,
            gallery: gallery
        };
    } catch (error) {
        console.error('Error loading game data:', error);
        throw error;
    }
};
