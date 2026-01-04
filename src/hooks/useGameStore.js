import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Screen navigation
  screen: 'TITLE',
  setScreen: (screen) => set({ screen }),

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
  goToChapterGallery: () => set({ screen: 'CHAPTER_GALLERY' }),
  goToGallery: () => set({ screen: 'GALLERY' }),
  goToImport: () => set({ screen: 'IMPORT' }),
  returnToTitle: () => set({ screen: 'TITLE' }),
  returnToChapterGallery: () => set({ screen: 'CHAPTER_GALLERY' }),
  startEvent: (startStoryID) => set({
    screen: 'MAIN',
    currentStoryID: startStoryID,
    flags: {},
    currentSceneTags: []
  }),
  goToResult: () => set({ screen: 'RESULT' }),
}));
