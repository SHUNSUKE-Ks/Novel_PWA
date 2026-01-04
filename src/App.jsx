import { useEffect, useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { loadGameData } from './utils/dataLoader';
import { TitleScreen } from './screens/TitleScreen';
import { ChapterGalleryScreen } from './screens/ChapterGalleryScreen';
import { MainGameScreen } from './screens/MainGameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { AssetImportScreen } from './screens/AssetImportScreen';
import './App.css';

function App() {
  const { screen, setGameData } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {screen === 'TITLE' && <TitleScreen />}
      {screen === 'CHAPTER_GALLERY' && <ChapterGalleryScreen />}
      {screen === 'MAIN' && <MainGameScreen />}
      {screen === 'RESULT' && <ResultScreen />}
      {screen === 'GALLERY' && <GalleryScreen />}
      {screen === 'IMPORT' && <AssetImportScreen />}
    </div>
  );
}

export default App;
