import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Screen navigation
  screen: 'TITLE',
  previousScreen: null,
  editorTargetFile: 'episodes.json',
  setScreen: (screen) => {
    const targetMap = {
      'MAIN': 'scenario.json',
      'GALLERY': 'gallery.json',
      'IMPORT': 'episodes.json',
      'TITLE': 'episodes.json',
      'CHAPTER_GALLERY': 'episodes.json',
      'RESULT': 'episodes.json'
    };
    set({ screen, editorTargetFile: targetMap[screen] || 'episodes.json' });
  },

  // Game data
  episodes: null,
  scenario: null,
  galleryData: null,
  setGameData: (data) => set({
    episodes: data.episodes,
    scenario: data.scenario,
    galleryData: data.gallery
  }),

  // Main game state
  currentEventID: null,
  currentStoryID: 1100,
  currentSceneTags: [],
  flags: {},
  isTextComplete: false,
  displayText: '',
  fullText: '',

  setCurrentStoryID: (id) => set({ currentStoryID: id }),
  setSceneTags: (tags) => set({ currentSceneTags: tags }),
  setFlags: (newFlags) => set((state) => ({ flags: { ...state.flags, ...newFlags } })),
  setTextState: (displayText, fullText, isComplete) => set({
    displayText,
    fullText,
    isTextComplete: isComplete
  }),

  // Chapter gallery state
  selectedChapter: 'ep1-ch1',
  isPanelOpen: true,
  setSelectedChapter: (chapterId) => set({ selectedChapter: chapterId }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  // Menu state
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  // Editor state
  isEditorOpen: false,
  toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
  setEditorTargetFile: (file) => set({ editorTargetFile: file }),

  // Gallery state
  selectedTags: [],
  isDragging: false,
  openMenuId: null,
  modalData: null,

  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag]
  })),
  setDragging: (isDragging) => set({ isDragging }),
  setOpenMenuId: (id) => set({ openMenuId: id }),
  setModalData: (data) => set({ modalData: data }),

  updateGalleryImage: (id, updates) => set((state) => ({
    galleryData: {
      ...state.galleryData,
      images: state.galleryData.images.map(img =>
        img.id === id ? { ...img, ...updates } : img
      )
    }
  })),

  addGalleryImage: (image) => set((state) => ({
    galleryData: {
      ...state.galleryData,
      images: [...state.galleryData.images, image]
    }
  })),

  // Helper functions
  getCurrentNode: () => {
    const state = get();
    return state.scenario?.find(n => n.storyID === state.currentStoryID);
  },

  goToNextNode: () => {
    const state = get();
    if (!state.scenario) return;

    const currentIndex = state.scenario.findIndex(n => n.storyID === state.currentStoryID);
    if (currentIndex >= 0 && currentIndex < state.scenario.length - 1) {
      const nextNode = state.scenario[currentIndex + 1];
      set({ currentStoryID: nextNode.storyID });
      return nextNode;
    }
  },

  jumpToStoryID: (storyID) => {
    set({ currentStoryID: storyID });
  },

  // Navigation helpers
  goToChapterGallery: () => get().setScreen('CHAPTER_GALLERY'),
  goToGallery: () => {
    const state = get();
    const prev = state.screen;
    state.setScreen('GALLERY');
    set({ previousScreen: prev !== 'GALLERY' && prev !== 'IMPORT' ? prev : state.previousScreen });
  },
  goToImport: () => {
    const state = get();
    const prev = state.screen;
    state.setScreen('IMPORT');
    set({ previousScreen: prev !== 'IMPORT' && prev !== 'GALLERY' ? prev : state.previousScreen });
  },
  goBack: () => {
    const state = get();
    state.setScreen(state.previousScreen || 'TITLE');
    set({ previousScreen: null });
  },
  returnToTitle: () => get().setScreen('TITLE'),
  returnToChapterGallery: () => get().setScreen('CHAPTER_GALLERY'),
  startEvent: (eventID, startStoryID) => {
    get().setScreen('MAIN');
    set({
      currentEventID: eventID,
      currentStoryID: startStoryID,
      flags: {},
      currentSceneTags: []
    });
  },
  goToResult: () => get().setScreen('RESULT'),
}));
