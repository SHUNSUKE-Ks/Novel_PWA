
import React from 'react';




export const AssetTable = ({ assets, onGenerateImage }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
                    <tr>
                        <th style={{ padding: '1rem' }}>ID</th>
                        <th style={{ padding: '1rem' }}>Asset Info</th>
                        <th style={{ padding: '1rem' }}>Generation Prompt</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Output</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {assets.map((asset) => (
                        <tr key={asset.id} className="ag-asset-row">
                            <td className="align-top">
                                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>{String(asset.id).padStart(2, '0')}</span>
                            </td>
                            <td className="align-top" style={{ maxWidth: '20rem' }}>
                                <div className="flex flex-col gap-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{asset.filename.split('/').pop()}</span>
                                    <span className={`ag-tag ${asset.type === 'Standing' ? 'standing' : asset.type === 'Expression' ? 'expression' : 'cg'}`}>
                                        {asset.type}
                                    </span>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.625' }}>{asset.description}</p>
                                </div>
                            </td>
                            <td className="align-top" style={{ maxWidth: '28rem' }}>
                                <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                                    <p style={{ fontSize: '0.6875rem', fontFamily: 'monospace', lineHeight: '1.625', color: '#94a3b8' }}>
                                        {asset.prompt}
                                    </p>
                                </div>
                            </td>
                            <td className="align-top">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '8rem', height: '8rem', borderRadius: '0.75rem', backgroundColor: '#020617', border: '1px solid #1e293b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
                                    }}>
                                        {asset.imageUrl ? (
                                            <img src={asset.imageUrl} alt={asset.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : asset.isGenerating ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="ag-pulse-dot" style={{ width: '1.5rem', height: '1.5rem' }}></div>
                                                <span style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Generating</span>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#1e293b' }}>
                                                <svg style={{ width: '2rem', height: '2rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {!asset.imageUrl && !asset.isGenerating && (
                                        <button
                                            onClick={() => onGenerateImage(asset.id)}
                                            style={{
                                                fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                color: '#94a3b8', background: 'transparent', border: '1px solid #1e293b', padding: '0.25rem 0.75rem',
                                                borderRadius: '0.25rem', cursor: 'pointer'
                                            }}
                                        >
                                            Render
                                        </button>
                                    )}
                                    {asset.imageUrl && (
                                        <button
                                            onClick={() => onGenerateImage(asset.id)}
                                            style={{
                                                fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Regenerate
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
