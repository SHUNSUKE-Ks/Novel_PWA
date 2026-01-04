import { Code } from 'lucide-react';
import { useGameStore } from '../../hooks/useGameStore';
import '../../styles/common/globalHeader.css';

export const GlobalHeader = () => {
    const { goToGallery, goToImport, toggleEditor, isEditorOpen, screen } = useGameStore();

    // Optionally hide on some screens or style differently
    // For now, let's keep it visible everywhere as a pervasive UI element

    return (
        <header className="global-header">
            <div className="header-right-actions">
                <button
                    className={`global-header-btn ${isEditorOpen ? 'active' : ''}`}
                    onClick={toggleEditor}
                    title="エディター"
                >
                    <Code size={20} />
                </button>
                <button
                    className={`global-header-btn ${screen === 'GALLERY' ? 'active' : ''}`}
                    onClick={goToGallery}
                    title="ギャラリー"
                >
                    📷
                </button>
                <button
                    className={`global-header-btn ${screen === 'IMPORT' ? 'active' : ''}`}
                    onClick={goToImport}
                    title="インポート"
                >
                    ☁️
                </button>
            </div>
        </header>
    );
};
