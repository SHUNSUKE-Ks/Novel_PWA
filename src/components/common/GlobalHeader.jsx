import { Code, Sparkles } from 'lucide-react';
import { useGameStore } from '../../hooks/useGameStore';
import '../../styles/common/globalHeader.css';

export const GlobalHeader = ({ onToggleGenerator }) => {
    const { goToGallery, goToImport, toggleEditor, isEditorOpen, screen } = useGameStore();

    // Optionally hide on some screens or style differently
    // For now, let's keep it visible everywhere as a pervasive UI element

    return (
        <header className="global-header">
            <div className="header-right-actions">
                <button
                    className="global-header-btn"
                    onClick={() => {
                        console.log("GlobalHeader: Generator button clicked");
                        if (onToggleGenerator) onToggleGenerator();
                        else console.error("GlobalHeader: onToggleGenerator prop is missing");
                    }}
                    title="Create Assets"
                    style={{ color: '#fbbf24', marginRight: '8px' }}
                >
                    <Sparkles size={20} />
                </button>
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
