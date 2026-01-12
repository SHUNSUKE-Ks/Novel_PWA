import React, { useState } from 'react';
import { analyzeCharacterAndOrders, generateAssetImage } from './services/gemini';
import { ImageUpload } from './components/ImageUpload';
import { JsonEditor } from './components/JsonEditor';
import { AssetTable } from './components/AssetTable';
import JSZip from 'jszip';
import './styles.css';

const DEFAULT_ORDER = {
    order_id: "batch_001",
    character_name: "Remi Unant",
    assets: [
        {
            name: "Standard Standing",
            type: "Standing",
            filename: "remi_unant/standing_01.png",
            description: "Standard standing pose, looking at camera, confident."
        },
        {
            name: "Smile Expression",
            type: "Expression",
            filename: "remi_unant/face_smile.png",
            description: "Gentle smiling expression, soft eyes."
        },
        {
            name: "Campfire Event",
            type: "CG",
            filename: "remi_unant/cg_event_01.png",
            description: "Event CG: Character sitting by a campfire at night, warm lighting."
        }
    ]
};

export const GeneratorSidebar = ({ isOpen, onClose }) => {
    const [referenceImage, setReferenceImage] = useState(null);
    const [orderJson, setOrderJson] = useState(JSON.stringify(DEFAULT_ORDER, null, 4));
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!referenceImage) {
            setError("Please upload a reference image first.");
            return;
        }
        setError(null);
        setIsAnalyzing(true);
        try {
            const parsedOrders = JSON.parse(orderJson);
            const result = await analyzeCharacterAndOrders(referenceImage, parsedOrders);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || "Failed to analyze orders.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateImage = async (assetId) => {
        if (!analysis) return;
        setAnalysis(prev => {
            if (!prev) return null;
            return {
                ...prev,
                assets: prev.assets.map(a => a.id === assetId ? { ...a, isGenerating: true } : a)
            };
        });

        try {
            const asset = analysis.assets.find(a => a.id === assetId);
            if (!asset) return;
            const imageUrl = await generateAssetImage(asset.prompt, referenceImage || undefined);
            setAnalysis(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    assets: prev.assets.map(a => a.id === assetId ? { ...a, imageUrl, isGenerating: false } : a)
                };
            });
        } catch (err) {
            setAnalysis(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    assets: prev.assets.map(a => a.id === assetId ? { ...a, isGenerating: false } : a)
                };
            });
        }
    };

    const handleDownloadPackage = async () => {
        if (!analysis) return;
        setIsExporting(true);
        try {
            const zip = new JSZip();
            const folder = zip.folder(analysis.id || 'character_assets');
            if (!folder) return;

            const dataJson = { ...analysis, assets: { standing: [], faces: {}, cgs: [] } };

            for (const asset of analysis.assets) {
                if (asset.imageUrl) {
                    const fileName = asset.filename.split('/').pop() || `asset_${asset.id}.png`;
                    // JSZip expects base64 without prefix for { base64: true }
                    const base64Data = asset.imageUrl.split(',')[1];
                    folder.file(fileName, base64Data, { base64: true });

                    if (asset.type === 'Standing') dataJson.assets.standing.push(fileName);
                    else if (asset.type === 'Expression') dataJson.assets.faces[asset.id] = fileName;
                    else if (asset.type === 'CG') dataJson.assets.cgs.push(fileName);
                }
            }
            folder.file("data.json", JSON.stringify(dataJson, null, 4));

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${analysis.id}_package.zip`;
            link.click();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`ag-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`ag-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="ag-header">
                    <div className="flex items-center gap-2">
                        <div className="ag-logo-box">
                            <span className="ag-logo-text">NB</span>
                        </div>
                        <h3 className="ag-title">Asset Generator</h3>
                    </div>
                    <button onClick={onClose} className="ag-close-btn">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="ag-content scrollbar-thin scrollbar-thumb-slate-700">
                    <section className="space-y-4">
                        <h4 className="ag-section-title">
                            <span className="ag-pulse-dot"></span>
                            Step 1: Reference
                        </h4>
                        <ImageUpload image={referenceImage} onUpload={setReferenceImage} />
                    </section>

                    <section className="space-y-4">
                        <h4 className="ag-section-title">
                            <span className="ag-pulse-dot"></span>
                            Step 2: Specification
                        </h4>
                        <JsonEditor value={orderJson} onChange={setOrderJson} />
                    </section>

                    <div className="pt-2">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`ag-analyze-btn ${isAnalyzing ? 'disabled' : 'active'}`}
                        >
                            {isAnalyzing ? "Analyzing Character..." : "Analyze & Generate"}
                        </button>
                        {error && <p className="mt-4 text-xs text-red-400 text-center">{error}</p>}
                    </div>

                    {analysis && (
                        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="ag-table-container">
                                <div className="ag-table-header">
                                    <h4 className="text-lg font-bold">{analysis.name}</h4>
                                    <button
                                        onClick={handleDownloadPackage}
                                        disabled={isExporting}
                                        className="ag-export-btn"
                                    >
                                        {isExporting ? 'Exporting...' : 'Export Package'}
                                    </button>
                                </div>
                                <AssetTable assets={analysis.assets} onGenerateImage={handleGenerateImage} />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};
