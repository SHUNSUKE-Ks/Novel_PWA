import { useEffect, useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { loadGameData } from './utils/dataLoader';
import { TitleScreen } from './screens/TitleScreen';
import { ChapterGalleryScreen } from './screens/ChapterGalleryScreen';
import { MainGameScreen } from './screens/MainGameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { AssetImportScreen } from './screens/AssetImportScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { BGMPlayerScreen } from './screens/BGMPlayerScreen';
import { GlobalHeader } from './components/common/GlobalHeader';
import JsonEditor from './components/JsonEditor';
import './App.css';

function App() {
  const {
    screen, setGameData, episodes, galleryData, scenario,
    isEditorOpen, toggleEditor, editorTargetFile, setEditorTargetFile
  } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic data and save logic based on editorTargetFile
  const getEditorContext = () => {
    switch (editorTargetFile) {
      case 'scenario.json':
        return {
          data: scenario || [],
          save: (newData) => setGameData({ episodes, gallery: galleryData, scenario: newData })
        };
      case 'gallery.json':
        return {
          data: galleryData || { images: [] },
          save: (newData) => setGameData({ episodes, gallery: newData, scenario })
        };
      default:
        return {
          data: episodes || {},
          save: (newData) => setGameData({ episodes: newData, gallery: galleryData, scenario })
        };
    }
  };

  const { data: editorData, save: handleEditorSave } = getEditorContext();

  useEffect(() => {
    const init = async () => {
      try {
        const data = await loadGameData();
        setGameData(data);
        setIsLoading(false);
      } catch (err) {
        setError('データの読み込みに失敗しました。');
        setIsLoading(false);
      }
    };
    init();
  }, [setGameData]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Game Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>エラー</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>再読み込み</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <GlobalHeader />
      <JsonEditor
        gameData={editorData}
        onSave={handleEditorSave}
        jsonFileName={editorTargetFile}
        isDev={import.meta.env.DEV}
        isEditorOpen={isEditorOpen}
        onToggleEditor={toggleEditor}
        onFileChange={setEditorTargetFile}
      >
        <main className="screen-container">
          {screen === 'TITLE' && <TitleScreen />}
          {screen === 'CHAPTER_GALLERY' && <ChapterGalleryScreen />}
          {screen === 'MAIN' && <MainGameScreen />}
          {screen === 'RESULT' && <ResultScreen />}
          {screen === 'GALLERY' && <GalleryScreen />}
          {screen === 'IMPORT' && <AssetImportScreen />}
          {screen === 'COLLECTION' && <CollectionScreen />}
          {screen === 'SOUND' && <BGMPlayerScreen />}
        </main>
      </JsonEditor>
    </div>
  );
}

export default App;
