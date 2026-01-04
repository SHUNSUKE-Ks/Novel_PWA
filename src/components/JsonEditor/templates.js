export const JSON_TEMPLATES = {
    episodes: {
        id: "ep-new",
        title: "新エピソード",
        chapters: []
    },
    chapters: {
        id: "ch-new",
        title: "新チャプター",
        events: []
    },
    events: {
        id: "event-new",
        title: "新イベント",
        description: "説明文",
        startStoryID: 0
    },
    scenario: {
        storyID: 0,
        scene: 0,
        speaker: "キャラ名",
        text: "テキストを入力"
    },
    choices: {
        label: "選択肢ラベル",
        nextStoryID: 0
    }
};

export const getTemplateForPath = (path) => {
    if (path.endsWith('.episodes')) return JSON_TEMPLATES.episodes;
    if (path.endsWith('.chapters')) return JSON_TEMPLATES.chapters;
    if (path.endsWith('.events')) return JSON_TEMPLATES.events;
    if (path.endsWith('.scenario')) return JSON_TEMPLATES.scenario;
    if (path.endsWith('.choices')) return JSON_TEMPLATES.choices;

    // Default for any unknown array
    return {};
};
