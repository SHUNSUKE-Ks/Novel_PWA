
import React, { useState, useCallback } from 'react';



export const ImageUpload = ({ image, onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, []);

    return (
        <div
            className="relative group"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className={`ag-upload-zone ${image ? 'has-image' : ''} ${isDragging ? 'dragging' : ''}`}>
                {image ? (
                    <>
                        <img src={image} alt="Reference" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4" style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
                            <label className="p-3 bg-slate-900 rounded-full cursor-pointer hover:bg-yellow-400 hover:text-slate-950 transition-colors" style={{ backgroundColor: '#0f172a', borderRadius: '9999px', padding: '0.75rem', cursor: 'pointer' }}>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </label>
                            <button
                                onClick={() => onUpload('')}
                                style={{ backgroundColor: '#0f172a', borderRadius: '9999px', padding: '0.75rem', border: 'none', color: '#fff', cursor: 'pointer' }}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDragging ? '#facc15' : '#1e293b', color: isDragging ? '#020617' : '#94a3b8' }}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', color: isDragging ? '#facc15' : '#cbd5e1' }}>
                                {isDragging ? 'Drop Image Here' : 'Upload Reference Image'}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Drag and drop or click to browse</p>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};
