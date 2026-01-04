import { useState, useEffect } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import '../styles/screens/assetImport.css';

const ImportHeader = ({ onAuth }) => {
    const { returnToTitle } = useGameStore();

    return (
        <div className="import-header">
            <div className="import-title">素材インポート (Dropbox)</div>
            <div className="import-actions">
                <button className="auth-btn" onClick={onAuth}>Dropboxに接続</button>
                <button className="close-import-btn" onClick={returnToTitle}>閉じる</button>
            </div>
        </div>
    );
};

const Pane = ({ title, type, files, onAction, onRefresh }) => {
    return (
        <div className="pane" id={`${type}-pane`}>
            <div className="pane-header">
                <div className="pane-title">{title}</div>
                <button className="refresh-btn" onClick={onRefresh}>更新</button>
            </div>
            <div className="file-list">
                {files.length === 0 ? (
                    <div className="empty-message">ファイルがありません</div>
                ) : (
                    files.map((file, index) => (
                        <div key={index} className="file-item">
                            <div className="file-thumb">
                                {file.isFolder ? '📁' : '📄'}
                            </div>
                            <div className="file-name">{file.name}</div>
                            <button className="btn-action" onClick={() => onAction(file)}>
                                {type === 'dropbox' ? '追加' : '削除'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const AssetImportScreen = () => {
    const [dropboxFiles, setDropboxFiles] = useState([]);
    const [localAssets, setLocalAssets] = useState([]);

    // Dummy data for now
    useEffect(() => {
        setDropboxFiles([
            { name: '01_bg', isFolder: true },
            { name: '02_character', isFolder: true },
            { name: 'bg_forest.png', isFolder: false },
            { name: 'chara_hero.png', isFolder: false }
        ]);

        setLocalAssets([
            { name: 'bg_magic_tower.png', isFolder: false },
            { name: 'chara_mage.png', isFolder: false }
        ]);
    }, []);

    const handleAuth = () => {
        alert('Dropbox連携は設定が必要です。');
    };

    const handleImport = (file) => {
        console.log('Importing', file);
    };

    const handleDelete = (file) => {
        console.log('Deleting', file);
    };

    return (
        <div className="asset-import-screen">
            <ImportHeader onAuth={handleAuth} />
            <div className="import-content">
                <Pane
                    title="Dropbox (Reader)"
                    type="dropbox"
                    files={dropboxFiles}
                    onAction={handleImport}
                    onRefresh={() => { }}
                />
                <Pane
                    title="Local Assets (Cache)"
                    type="local"
                    files={localAssets}
                    onAction={handleDelete}
                    onRefresh={() => { }}
                />
            </div>
        </div>
    );
};
