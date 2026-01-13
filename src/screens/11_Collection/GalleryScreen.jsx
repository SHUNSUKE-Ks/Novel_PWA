import { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import '../../styles/screens/gallery.css';

const GalleryHeader = () => {
    const { goBack } = useGameStore();

    return (
        <div className="gallery-header">
            <div className="gallery-main-title">ギャラリー</div>
            <div className="gallery-actions">
                <button className="gallery-action-btn trash-btn" title="ゴミ箱">🗑️</button>
                <button className="gallery-action-btn add-btn" title="追加">➕</button>
                <button className="gallery-back-btn" onClick={goBack}>戻る</button>
            </div>
        </div>
    );
};

const TagsArea = ({ tags }) => {
    const { selectedTags, toggleTag } = useGameStore();

    return (
        <div className="tags-area">
            <div className="tags-grid">
                {tags.map(tag => (
                    <button
                        key={tag}
                        className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ImageCard = ({ image }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="image-card">
            <div className="image-card-header">
                <span className="image-card-title">{image.title}</span>
                <button className="image-card-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</button>
                {isMenuOpen && (
                    <div className="image-menu-dropdown">
                        <div className="menu-item">編集</div>
                        <div className="menu-item">削除</div>
                    </div>
                )}
            </div>
            <div className="image-card-img">
                <img
                    src={`/src/assets/gallery/${image.filename}`}
                    alt={image.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                />
            </div>
            <div className="image-card-desc">{image.description}</div>
        </div>
    );
};

export const GalleryScreen = () => {
    const { galleryData, selectedTags, isDragging } = useGameStore();

    if (!galleryData) return <div className="gallery-screen">Loading...</div>;

    const allTags = Array.from(new Set(galleryData.images.flatMap(img => img.tags)));

    const filteredImages = selectedTags.length === 0
        ? galleryData.images
        : galleryData.images.filter(img => selectedTags.some(tag => img.tags.includes(tag)));

    return (
        <div className="gallery-screen">
            <GalleryHeader />
            <TagsArea tags={allTags} />
            <div className="gallery-content">
                <div className="images-grid">
                    {filteredImages.map(img => (
                        <ImageCard key={img.id} image={img} />
                    ))}
                </div>
            </div>
            {isDragging && (
                <div className="drop-overlay">
                    <div className="drop-message">画像をドロップして追加</div>
                </div>
            )}
        </div>
    );
};
