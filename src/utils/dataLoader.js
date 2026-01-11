export const loadGameData = async () => {
    try {
        const [episodesRes, scenarioRes, galleryRes] = await Promise.all([
            fetch('/data/episodes.json'),
            fetch('/data/scenario.json'),
            fetch('/data/gallery.json')
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
