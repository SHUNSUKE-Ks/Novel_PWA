import React from 'react';

/**
 * Background Gallery Card Component
 * Used to render background images in the gallery view.
 * 
 * @param {Object} props
 * @param {Object} props.background - Background data object
 * @param {Function} props.resolveBgUrl - Function to resolve background image URL
 * @param {Array} props.categories - Array of category definitions for label lookup
 */
export const BackgroundCard = ({ background, resolveBgUrl, categories = [] }) => {
    const bg = background;
    const categoryLabel = categories.find(c => c.id === bg.category)?.label || bg.category;

    return (
        <div className="bg-gallery-card" style={{
            background: 'rgba(30, 30, 40, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div className="bg-image-container" style={{
                width: '100%',
                aspectRatio: '16/9',
                overflow: 'hidden',
                background: '#000'
            }}>
                <img
                    src={resolveBgUrl(bg.image)}
                    alt={bg.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                    }}
                />
            </div>
            <div className="bg-card-footer" style={{ padding: '0.8rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{bg.name}</h4>
                    <span className="table-tag" style={{ fontSize: '0.7rem' }}>
                        {categoryLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};
